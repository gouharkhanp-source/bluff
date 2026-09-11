import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

let client
let db
let stripeClient

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!stripeClient) stripeClient = new Stripe(key)
  return stripeClient
}

const DEPOSIT_ALLOWLIST = [5, 10, 20]
const EDITION_TITLES = {
  'digital-founders': 'Digital Founders Pass',
  'core-starter': 'Core Starter Deck',
  'highway-hazard': 'Highway Hazard Expansion',
  'collectors-vault': "Collector's Vault",
}

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const DEFAULT_CONFIG = {
  id: 'reservation',
  batchLabel: 'BATCH 01',
  batchGoal: 500,
  reservedCount: 340, // seeds ~68%
  updatedAt: new Date(),
}

async function getConfig(db) {
  let cfg = await db.collection('config').findOne({ id: 'reservation' })
  if (!cfg) {
    await db.collection('config').insertOne(DEFAULT_CONFIG)
    cfg = DEFAULT_CONFIG
  }
  const { _id, ...clean } = cfg
  clean.percent = Math.min(100, Math.round((clean.reservedCount / clean.batchGoal) * 100))
  clean.paymentsEnabled = !!process.env.STRIPE_SECRET_KEY
  return clean
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'EXIT 52 API' }))
    }

    // Reservation tracker config (admin-configurable)
    if (route === '/config' && method === 'GET') {
      return handleCORS(NextResponse.json(await getConfig(db)))
    }
    if (route === '/config' && method === 'PUT') {
      const body = await request.json()
      const update = { updatedAt: new Date() }
      if (typeof body.batchLabel === 'string') update.batchLabel = body.batchLabel
      if (Number.isFinite(body.batchGoal)) update.batchGoal = body.batchGoal
      if (Number.isFinite(body.reservedCount)) update.reservedCount = body.reservedCount
      await db.collection('config').updateOne({ id: 'reservation' }, { $set: update }, { upsert: true })
      return handleCORS(NextResponse.json(await getConfig(db)))
    }

    // Reservations
    if (route === '/reservations' && method === 'POST') {
      const body = await request.json()
      if (!body.email || !body.edition) {
        return handleCORS(NextResponse.json({ error: 'email and edition are required' }, { status: 400 }))
      }
      const reservation = {
        id: uuidv4(),
        edition: body.edition,
        name: body.name || '',
        email: body.email,
        shipping: body.shipping || {},
        deposit: body.deposit || 0,
        code: 'EX-' + uuidv4().slice(0, 6).toUpperCase(),
        createdAt: new Date(),
      }
      await db.collection('reservations').insertOne(reservation)
      await db.collection('config').updateOne(
        { id: 'reservation' },
        { $inc: { reservedCount: 1 }, $set: { updatedAt: new Date() } },
        { upsert: true }
      )
      const { _id, ...clean } = reservation
      return handleCORS(NextResponse.json({ reservation: clean, config: await getConfig(db) }))
    }
    if (route === '/reservations' && method === 'GET') {
      const list = await db.collection('reservations').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return handleCORS(NextResponse.json(list.map(({ _id, ...r }) => r)))
    }

    // ---- Stripe deposit checkout ----
    // Creates a real Stripe Checkout session when STRIPE_SECRET_KEY is set;
    // otherwise gracefully falls back to a no-charge reservation.
    if (route === '/checkout' && method === 'POST') {
      const body = await request.json()
      if (!body.email || !body.edition) {
        return handleCORS(NextResponse.json({ error: 'email and edition are required' }, { status: 400 }))
      }
      const deposit = DEPOSIT_ALLOWLIST.includes(Number(body.deposit)) ? Number(body.deposit) : 5
      const base = { id: uuidv4(), edition: body.edition, name: body.name || '', email: body.email, shipping: body.shipping || {}, deposit, code: 'EX-' + uuidv4().slice(0, 6).toUpperCase(), createdAt: new Date() }
      const stripe = getStripe()

      if (!stripe) {
        // Fallback: record reservation without charge (clearly labelled on UI)
        const reservation = { ...base, status: 'reserved', paid: false, counted: true }
        await db.collection('reservations').insertOne(reservation)
        await db.collection('config').updateOne({ id: 'reservation' }, { $inc: { reservedCount: 1 }, $set: { updatedAt: new Date() } }, { upsert: true })
        const { _id, ...clean } = reservation
        return handleCORS(NextResponse.json({ mode: 'prototype', reservation: clean, config: await getConfig(db) }))
      }

      // Real Stripe hosted checkout
      const reservation = { ...base, status: 'pending', paid: false, counted: false }
      await db.collection('reservations').insertOne(reservation)
      const currency = (process.env.STRIPE_DEPOSIT_CURRENCY || 'usd').toLowerCase()
      const origin = process.env.NEXT_PUBLIC_BASE_URL
      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          customer_email: body.email,
          line_items: [{
            quantity: 1,
            price_data: {
              currency,
              unit_amount: deposit * 100,
              product_data: { name: `EXIT 52 Pre-book Deposit — ${EDITION_TITLES[body.edition] || body.edition}` },
            },
          }],
          success_url: `${origin}/prebook?paid=1&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/prebook?canceled=1`,
          metadata: { reservationId: reservation.id, edition: body.edition },
        }, { idempotencyKey: `prebook-${reservation.id}` })
        await db.collection('reservations').updateOne({ id: reservation.id }, { $set: { stripeSessionId: session.id, updatedAt: new Date() } })
        return handleCORS(NextResponse.json({ mode: 'stripe', url: session.url }))
      } catch (err) {
        console.error('Stripe session error:', err?.message)
        await db.collection('reservations').updateOne({ id: reservation.id }, { $set: { status: 'checkout_error', updatedAt: new Date() } })
        return handleCORS(NextResponse.json({ error: 'Unable to start checkout' }, { status: 500 }))
      }
    }

    // Verify a completed Stripe checkout on return (server-side confirmation)
    if (route === '/checkout/verify' && method === 'GET') {
      const stripe = getStripe()
      const sessionId = new URL(request.url).searchParams.get('session_id')
      if (!stripe) return handleCORS(NextResponse.json({ error: 'Payments not configured' }, { status: 400 }))
      if (!sessionId) return handleCORS(NextResponse.json({ error: 'session_id required' }, { status: 400 }))
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const reservationId = session?.metadata?.reservationId
      const reservation = reservationId ? await db.collection('reservations').findOne({ id: reservationId }) : null
      if (!reservation) return handleCORS(NextResponse.json({ error: 'Reservation not found' }, { status: 404 }))

      if (session.payment_status === 'paid') {
        if (!reservation.counted) {
          await db.collection('reservations').updateOne({ id: reservation.id }, { $set: { status: 'paid', paid: true, counted: true, paidAt: new Date(), amountPaid: session.amount_total, updatedAt: new Date() } })
          await db.collection('config').updateOne({ id: 'reservation' }, { $inc: { reservedCount: 1 }, $set: { updatedAt: new Date() } }, { upsert: true })
        }
        const updated = await db.collection('reservations').findOne({ id: reservation.id })
        const { _id, ...clean } = updated
        return handleCORS(NextResponse.json({ paid: true, reservation: clean, config: await getConfig(db) }))
      }
      return handleCORS(NextResponse.json({ paid: false, status: session.payment_status }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
