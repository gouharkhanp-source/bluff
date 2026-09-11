'use client'

// Renders an official EXIT 52 sabotage card image.
export default function SpecialCard({ card }) {
  return (
    <div className="jiggle-pop relative w-full aspect-[676/1050]">
      <img
        src={card.img}
        alt={`${card.script} ${card.bold} card`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover rounded-[10%] drop-shadow-[0_18px_42px_rgba(0,0,0,0.45)]"
      />
    </div>
  )
}
