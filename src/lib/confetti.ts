export function fireConfetti() {
  if (typeof window === "undefined") return;
  import("canvas-confetti").then(({ default: confetti }) => {
    const defaults = {
      origin: { x: 0.5, y: 0.5 },
      spread: 100,
      startVelocity: 35,
    };

    confetti({
      ...defaults,
      particleCount: 100,
      colors: ["#ffc105", "#f59e0b", "#fbbf24", "#ffffff", "#e5e7eb"],
    });

    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 1.2,
    });
  });
}
