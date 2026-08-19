export default function Marquee({ items, speed = 28 }) {
  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
        {loop.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
