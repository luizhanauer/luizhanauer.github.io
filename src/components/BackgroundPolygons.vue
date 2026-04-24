<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

// Reaproveitamos a interface de partículas da sua configuração existente
interface ParticlesConfig {
  color: string;
  lineOpacity: number;
  count: number;
}

const props = defineProps<{
  config: ParticlesConfig
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;

let width = 0;
let height = 0;
let polygons: Polygon[] = [];

// Configurações internas de comportamento (baseadas no seu script original)
const polyConfig = {
  baseSize: 50,
  sizeVariation: 30,
  baseSpeed: 0.2
};

class Polygon {
  size = 0;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  rotation = 0;
  rotationSpeed = 0;
  sides = 0;

  constructor() {
    this.init();
  }

  init() {
    this.size = polyConfig.baseSize + Math.random() * polyConfig.sizeVariation;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * polyConfig.baseSpeed;
    this.vy = (Math.random() - 0.5) * polyConfig.baseSpeed;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.005;
    this.sides = Math.floor(Math.random() * 3) + 3; // Entre 3 e 5 lados
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Reposiciona se sair da tela (efeito wrap-around)
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    
    const angleStep = (Math.PI * 2) / this.sides;
    ctx.moveTo(this.size, 0);
    
    for (let i = 1; i < this.sides; i++) {
      ctx.lineTo(
        this.size * Math.cos(angleStep * i),
        this.size * Math.sin(angleStep * i)
      );
    }
    
    ctx.closePath();
    
    // Substitui a opacidade da cor configurada para manter o efeito sutil do seu original
    // Caso a cor venha no formato rgb(x, y, z) ou rgba(x, y, z, a)
    const fadeColor = color.replace(/[\d.]+\)$/g, '0.08)');
    
    ctx.fillStyle = fadeColor;
    ctx.fill();
    ctx.restore();
  }
}

const initPolygons = () => {
  polygons = [];
  // Usa o count do config.json, ou fallback para 30
  const count = props.config?.count || 30;
  for (let i = 0; i < count; i++) {
    polygons.push(new Polygon());
  }
};

const setSize = () => {
  if (!canvasRef.value) return;
  width = canvasRef.value.width = window.innerWidth;
  height = canvasRef.value.height = window.innerHeight;
  initPolygons();
};

const animate = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  polygons.forEach(polygon => {
    polygon.update();
    polygon.draw(ctx, props.config.color);
  });

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  if (props.config) {
    window.addEventListener('resize', setSize);
    setSize();
    animate();
  }
});

watch(() => props.config, () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  setSize();
  animate();
}, { deep: true });

onUnmounted(() => {
  window.removeEventListener('resize', setSize);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas 
    ref="canvasRef" 
    class="absolute inset-0 w-full h-full block"
  ></canvas>
</template>