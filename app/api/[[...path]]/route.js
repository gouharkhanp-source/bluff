import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client
let db

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
