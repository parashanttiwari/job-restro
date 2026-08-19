import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  duration = 0.7,
  className = '',
  once = true,
  ...rest
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  );
}
