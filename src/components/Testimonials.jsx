import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Testimonials({ items, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i) => setIndex((i + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [paused, interval, items.length]);

  const current = items[index];

  return (
    <div
      className="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="testimonials__quote-mark">
        <Icon name="quote" size={36} />
      </div>

      <AnimatePresence mode="wait">
        <motion.figure
          key={current.name}
          className="testimonials__card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="testimonials__stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" size={15} className={i < current.rating ? 'star--filled' : 'star--empty'} />
            ))}
          </div>
          <blockquote>{current.quote}</blockquote>
          <figcaption>
            <span className="testimonials__avatar">{initials(current.name)}</span>
            <span>
              <strong>{current.name}</strong>
              <span className="testimonials__role">{current.role}</span>
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="testimonials__dots">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              className={`hero-carousel__dot ${i === index ? 'hero-carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
