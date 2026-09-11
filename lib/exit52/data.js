// EXIT 52 — Central content/config (CMS-ready).
// All marketing/game content lives here so a CMS or backend can replace it later.

import { ASSETS } from './images'

export const BRAND = {
  name: "EXIT 52",
  tm: "™",
  tagline1: "PLAY YOUR CARDS.",
  tagline2: "FIND YOUR EXIT.",
  description:
    "EXIT 52™ is a fast-paced card game combining strategy, bluffing and optional digital gameplay. Play online, connect your physical deck and find your EXIT.",
};

export const NAV_LINKS = [
  { label: "KNOW YOUR GAME", href: "/know-your-game" },
  { label: "EXPLORE", href: "/explainer" },
  { label: "SHOP", href: "/editions" },
  { label: "PRE-BOOK", href: "/prebook" },
];

export const CARD_TYPES = [
  {
    key: "selector",
    title: "GAME SELECTOR",
    tag: "MODE",
    color: "#e8232b",
    blurb: "Determines the game mode.",
    desc: "Placed face down at setup. One is chosen at random to decide the formation you must build to escape.",
    glyph: "◈",
  },
  {
    key: "sabotage",
    title: "SABOTAGE",
    tag: "ATTACK",
    color: "#3a30b8",
    blurb: "Disrupt another player's progress.",
    desc: "Force an opponent to break their formation, draw extra, or lose momentum right before their EXIT.",
    glyph: "☠",
  },
  {
    key: "accelerator",
    title: "ACCELERATOR",
    tag: "BOOST",
    color: "#4b3fd6",
    blurb: "Speed up the game.",
    desc: "Fast-track your turn, draw more, or chain plays. Speed is a weapon — and a risk.",
    glyph: "⚡",
  },
  {
    key: "challenge",
    title: "CHALLENGE",
    tag: "EVENT",
    color: "#e8232b",
    blurb: "Triggers the digital Challenge experience.",
    desc: "Spin the wheel. Fate decides. The Challenge is where losers become legends — or lose it all.",
    glyph: "✦",
  },
  {
    key: "standard",
    title: "STANDARD CARDS",
    tag: "BUILD",
    color: "#0f1e3d",
    blurb: "Used to create the required formation.",
    desc: "Your bread and butter. Combine, sequence and bluff your way to a complete formation.",
    glyph: "♠",
  },
];

export const GAME_MODES = [
  {
    key: "tabletop",
    title: "TABLETOP SYNC",
    short: "Physical deck + shared screen.",
    desc: "Deal a physical deck, then mirror the action on one shared screen for live events, timers and the Challenge Wheel.",
  },
  {
    key: "remote",
    title: "REMOTE PLAY",
    short: "Players in different locations connect through the browser.",
    desc: "Everyone joins the same browser room from anywhere. Turns, bluffs and Challenges sync live — no app required.",
  },
  {
    key: "digital",
    title: "100% DIGITAL",
    short: "Play entirely in-browser.",
    desc: "No deck needed. The full EXIT 52 experience runs in your browser with a virtual table and digital cards.",
  },
];

export const HOW_TO_STEPS = [
  {
    no: "01",
    title: "DEAL",
    body: "Place the 4 Game Selector Cards face down and randomly select one game mode. Deal the required cards.",
  },
  {
    no: "02",
    title: "DRAW & PLAY",
    body: "Draw from the Draw Pile or Discard Pile, then play or discard according to your selected mode.",
  },
  {
    no: "03",
    title: "COMPLETE & EXIT",
    body: "Complete the required formation and reveal your EXIT to win.",
  },
];

export const EDITIONS = [
  {
    id: "digital-founders",
    no: "01",
    title: "DIGITAL FOUNDERS PASS",
    badge: "DIGITAL",
    price: 12,
    tagline: "Online-only browser access.",
    cta: "GET DIGITAL",
    includes: [
      "Digital game access",
      "Custom lobby avatar",
      "Early server access",
      "Founder status",
    ],
  },
  {
    id: "core-starter",
    no: "02",
    title: "CORE STARTER DECK",
    badge: "BEST VALUE",
    price: 29,
    tagline: "The standard EXIT 52 physical experience.",
    cta: "CHOOSE CORE",
    includes: [
      "52-card physical deck",
      "QR/NFC browser room access",
      "Digital game access",
    ],
  },
  {
    id: "highway-hazard",
    no: "03",
    title: "HIGHWAY HAZARD EXPANSION",
    badge: "MOST CHAOS",
    price: 44,
    tagline: "For players who want more chaos.",
    cta: "ADD THE HAZARD",
    includes: ["Core physical deck", "28 expansion cards", "Digital pass"],
  },
  {
    id: "collectors-vault",
    no: "04",
    title: "COLLECTOR'S VAULT",
    badge: "COLLECTOR",
    price: 99,
    tagline: "The premium collector experience.",
    cta: "ENTER THE VAULT",
    includes: [
      "Embossed metallic deck",
      "Physical playmat",
      "Acrylic tokens",
      "Limited serialized card",
      "Lifetime VIP digital pass",
    ],
  },
];

export const COMPARISON_ROWS = [
  { label: "Digital Access", values: [true, true, true, true] },
  { label: "Physical Deck", values: [false, true, true, true] },
  { label: "Expansion Cards", values: [false, false, true, false] },
  { label: "Playmat", values: [false, false, false, true] },
  { label: "Acrylic Tokens", values: [false, false, false, true] },
  { label: "Serialized Card", values: [false, false, false, true] },
  { label: "VIP Access", values: [false, false, false, true] },
];

export const PERKS = [
  {
    title: "DAY-1 DIGITAL BADGE",
    desc: "Exclusive founder badge worn in every lobby you enter.",
    glyph: "★",
  },
  {
    title: "LIMITED BONUS CARDS",
    desc: "Early reservation members receive special cards you can't get later.",
    glyph: "✦",
  },
  {
    title: "EARLY ACCESS",
    desc: "Get into the digital lobby before general release.",
    glyph: "⚡",
  },
];

export const CHALLENGES = [
  { label: "DRAW 2", color: "#e8232b" },
  { label: "SKIP TURN", color: "#0a1a3f" },
  { label: "SWAP A CARD", color: "#3a30b8" },
  { label: "REVEAL A CARD", color: "#0a1a3f" },
  { label: "LOSE A TURN", color: "#e8232b" },
  { label: "CHOOSE OPPONENT", color: "#0a1a3f" },
  { label: "DRAW 2", color: "#3a30b8" },
  { label: "SAFE — PASS", color: "#4b3fd6" },
];

export const CHAPTERS = [
  { time: "00:00", label: "SETUP", seconds: 0 },
  { time: "00:20", label: "DRAW & PLAY", seconds: 20 },
  { time: "00:50", label: "BLUFF", seconds: 50 },
  { time: "01:20", label: "MAKE YOUR EXIT", seconds: 80 },
  { time: "01:45", label: "THE CHALLENGE", seconds: 105 },
];

export const FAQS = [
  { q: "How many players can play?", a: "2–6 players." },
  { q: "What age is EXIT 52 for?", a: "16+." },
  {
    q: "Do I need the physical deck?",
    a: "Not necessarily. EXIT 52 supports digital play, physical play and hybrid play depending on the edition.",
  },
  {
    q: "Do I need an app?",
    a: "No. The digital experience runs entirely through the browser.",
  },
  {
    q: "Can I play remotely?",
    a: "Yes, the concept supports remote play through a shared browser room.",
  },
  {
    q: "How long does a game take?",
    a: "Game length varies by mode and player count. Exact durations will be confirmed closer to launch.",
  },
];

export const AVATARS = ["♠", "♥", "♦", "♣", "★", "✦", "⚡", "☠"];

// The official EXIT 52 special / action cards.
export const SPECIAL_CARDS = [
  { id: "game-changer", script: "game", bold: "CHANGER", img: ASSETS.s1 },
  { id: "virus-attacker", script: "virus", bold: "ATTACKER", img: ASSETS.s2 },
  { id: "game-twister", script: "game", bold: "TWISTER", img: ASSETS.s3 },
  { id: "card-stealer", script: "card", bold: "STEALER", img: ASSETS.s4 },
  { id: "exit-hacker", script: "exit", bold: "HACKER", img: ASSETS.s5 },
];

export const POWER_CARDS = [
  { id: "lucky-joker", script: "lucky", bold: "JOKER", img: ASSETS.a1 },
  { id: "virus-healer", script: "virus", bold: "HEALER", img: ASSETS.a2 },
  { id: "ultimate-victor", script: "ultimate", bold: "VICTOR", img: ASSETS.a3 },
  { id: "side-show-dealer", script: "side show", bold: "DEALER", img: ASSETS.a4 },
  { id: "exit-phantom", script: "exit", bold: "PHANTOM", img: ASSETS.a5 },
];

export const WIN_RULES = [
  {
    id: "power-pair",
    script: "its a",
    bold: "POWER PAIR",
    arc: "ALL PLAYERS MAKE A PAIR",
    lines: [
      "1. Deal 5 Cards to Each Player.",
      "2. Create a Separate Draw Pile of Power Cards.",
      "3. Play with Regular Rules.",
      "4. Complete a Red or Blue pair to draw 1 card from Power pile.",
    ],
  },
  {
    id: "trio",
    script: "its a",
    bold: "TRIO",
    arc: "ALL PLAYERS MAKE A TRIO",
    lines: ["Deal 4 Cards to Each Player", "Trio = 3 Same Nos. Cards", "Any Nos. 1 to 9 (Red OR Blue)"],
  },
  {
    id: "sequence",
    script: "its a",
    bold: "SEQUENCE",
    arc: "ALL PLAYERS MAKE A SEQUENCE",
    lines: ["Deal 4 Cards to Each Player", "Sequence = 3 Nos. in Red OR Blue", "Ex: 123, 234, 345, 456, 567, 678, 789"],
  },
  {
    id: "pair",
    script: "its a",
    bold: "PAIR",
    arc: "ALL PLAYERS MAKE A PAIR",
    lines: ["Deal 5 Cards to Each Player", "Pair = 2 Red + 2 Blue", "Any 2 Same Nos. (1-9)"],
  },
];
