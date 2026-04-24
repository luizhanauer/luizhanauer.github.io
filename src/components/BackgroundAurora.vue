<script setup lang="ts">
</script>

<template>
  <div class="absolute inset-0 w-full h-full bg-[#0d1117] overflow-hidden z-0 isolate">
    
    <div class="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10 pointer-events-none" 
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');">
    </div>

    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-emerald-600/15 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob pointer-events-none"></div>
    
    <div class="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-teal-700/15 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
    
    <div class="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-emerald-900/20 rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none"></div>

  </div>
</template>

<style scoped>
/* Animação suave e contínua das manchas de luz */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 15s infinite alternate ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>