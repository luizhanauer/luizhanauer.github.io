<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { ParticlesConfig } from '../types';

const props = defineProps<{
  config: ParticlesConfig
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;

class Particle {
  x = 0; y = 0; vx = 0; vy = 0; size = 0;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 0.2;
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 1.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const initParticles = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Particle[] = [];
  
  const setSize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  setSize();
  
  for (let i = 0; i < props.config.count; i++) {
    particles.push(new Particle(canvas));
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Aplicando princípios de Object Calisthenics: evite encadeamento excessivo e garanta segurança
    particles.forEach((p, i) => {
      p.update();
      p.draw(ctx, props.config.color);
      
      for (let j = i + 1; j < particles.length; j++) {
        const target = particles[j];
        if (!target) continue; // Resolve o erro TS2532: Object is possibly 'undefined'

        const dx = p.x - target.x;
        const dy = p.y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const opacity = (props.config.lineOpacity * (1 - dist / 150)).toFixed(2);
          const baseColor = props.config.color.replace(/[^,]+(?=\))/, opacity);
          
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }
    });
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
  
  window.addEventListener('resize', setSize);
  return () => window.removeEventListener('resize', setSize);
};

onMounted(() => {
  if (props.config) initParticles();
});

watch(() => props.config, () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  initParticles();
}, { deep: true });

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    id="bg-canvas"
    class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-transparent"
  ></canvas>
</template>