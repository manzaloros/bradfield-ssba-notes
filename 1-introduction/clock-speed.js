const ITERS = 1_000_000_000;
const clockSpeed = () => {
  const start = performance.now();
  for (let i = 0; i < ITERS; i += 1) {}
  const end = performance.now();

  const seconds = (end - start) / 1_000; // ms to s
  const ops = ITERS / seconds;

  return ops / ITERS;
};

clockSpeed();

/*
  Just loop: 0.108 GHz
*/
