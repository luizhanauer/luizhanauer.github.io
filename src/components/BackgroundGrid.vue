<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Estado para rastrear o mouse. Começa fora da tela para não piscar no carregamento.
const mouseX = ref(-1000);
const mouseY = ref(-1000);
const isVisible = ref(false);

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  
  if (!isVisible.value) {
    isVisible.value = true;
  }
};

const handleMouseLeave = () => {
  isVisible.value = false;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  document.body.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  document.body.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<template>
  <div class="absolute inset-0 w-full h-full bg-[#0d1117] overflow-hidden z-0">
    
    <div 
      class="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:24px_24px]"
    ></div>

    <div 
      class="absolute inset-0 bg-[#0d1117]"
      style="mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, black 100%); -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, transparent 40%, black 100%);"
    ></div>

    <div 
      class="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
      :class="isVisible ? 'opacity-100' : 'opacity-0'"
      :style="{
        background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(16, 185, 129, 0.08), transparent 40%)`
      }"
    ></div>

  </div>
</template>