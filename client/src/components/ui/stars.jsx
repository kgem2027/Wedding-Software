import * as React from 'react';
import { motion } from 'motion/react';

function generateStars(count, starColor) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    // Use vw-relative spread so stars cover the full width regardless of screen size
    const x = Math.floor(Math.random() * window.innerWidth * 2) - window.innerWidth;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(', ');
}

function StarLayer({ count = 1000, size = 1, duration = 50, starColor = '#fff' }) {
  const [boxShadow, setBoxShadow] = React.useState('');

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  const dotStyle = {
    position: 'absolute',
    borderRadius: '50%',
    width: `${size}px`,
    height: `${size}px`,
    left: '50%',
    boxShadow: boxShadow,
  };

  return (
    <motion.div
      animate={{ y: [0, -2000] }}
      transition={{ repeat: Infinity, duration: duration, ease: 'linear' }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '2000px',
      }}
    >
      <div style={{ ...dotStyle, top: 0 }} />
      <div style={{ ...dotStyle, top: '2000px' }} />
    </motion.div>
  );
}

function StarsBackground({ children, speed = 50, starColor = '#fff' }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #000000 0%, #020111 40%, #191621 100%)',
      }}
    >
      <StarLayer count={3000} size={1} duration={speed} starColor={starColor} />
      <StarLayer count={1200} size={2} duration={speed * 2} starColor={starColor} />
      <StarLayer count={600} size={3} duration={speed * 3} starColor={starColor} />
      {children}
    </div>
  );
}

export { StarLayer, StarsBackground };
