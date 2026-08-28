// Lightweight analytics placeholder. Real provider (GA / Segment) can hook window.dataLayer later.
export function track(event, props = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const payload = { event, ts: Date.now(), ...props };
  window.dataLayer.push(payload);
  // eslint-disable-next-line no-console
  console.log("[analytics]", event, props);
}

export const EVENTS = {
  entryGate: "entry_gate_interaction",
  playFree: "play_free_cta",
  preBook: "prebook_cta",
  howToStep: "how_to_play_step_interaction",
  videoPlay: "video_play",
  videoComplete: "video_completion",
  editionSelect: "edition_selection",
  challengeWheel: "challenge_wheel_interaction",
  roomCode: "room_code_submission",
  reservationStart: "reservation_start",
  reservationComplete: "reservation_completion",
};
