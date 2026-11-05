<template>
  <div class="backdrop" aria-hidden="true">
    <div class="backdrop__grid"></div>
    <div class="backdrop__orb backdrop__orb--a"></div>
    <div class="backdrop__orb backdrop__orb--b"></div>
    <div class="backdrop__orb backdrop__orb--c"></div>
    <div class="backdrop__noise"></div>
    <div class="backdrop__vignette"></div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: var(--bg);
}

.backdrop__grid {
  position: absolute;
  inset: -1px;
  background-image:
    linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, #000 20%, transparent 75%);
}

.backdrop__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: var(--orb-opacity);
  will-change: transform;
}

.backdrop__orb--a {
  top: -18vmax;
  left: 50%;
  width: 46vmax;
  height: 46vmax;
  margin-left: -30vmax;
  background: radial-gradient(circle, var(--orb-a), transparent 68%);
  animation: drift-a 26s var(--ease-in-out) infinite alternate;
}

.backdrop__orb--b {
  top: 38%;
  right: -22vmax;
  width: 42vmax;
  height: 42vmax;
  background: radial-gradient(circle, var(--orb-b), transparent 68%);
  animation: drift-b 32s var(--ease-in-out) infinite alternate;
}

.backdrop__orb--c {
  bottom: -26vmax;
  left: -14vmax;
  width: 44vmax;
  height: 44vmax;
  background: radial-gradient(circle, var(--orb-c), transparent 70%);
  animation: drift-c 38s var(--ease-in-out) infinite alternate;
}

.backdrop__noise {
  position: absolute;
  inset: 0;
  opacity: var(--noise-opacity);
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
}

.backdrop__vignette {
  position: absolute;
  inset: 0;
  background: var(--vignette);
}

@keyframes drift-a {
  from {
    transform: translate3d(-4%, -3%, 0) scale(1);
  }
  to {
    transform: translate3d(6%, 5%, 0) scale(1.12);
  }
}

@keyframes drift-b {
  from {
    transform: translate3d(0, 0, 0) scale(1.05);
  }
  to {
    transform: translate3d(-7%, -6%, 0) scale(0.95);
  }
}

@keyframes drift-c {
  from {
    transform: translate3d(0, 2%, 0) scale(1);
  }
  to {
    transform: translate3d(8%, -4%, 0) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .backdrop__orb {
    animation: none;
  }
}
</style>
