<script setup lang="ts">
import type { Repository } from '../types';
import { computed } from 'vue';

const props = defineProps<{
  repo: Repository;
  defaultImage: string;
  username: string;
}>();

const formatName = (name: string) => 
  name.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

// Lógica centralizada para a imagem
const displayScreenshot = computed(() => {
  const isFeatured = props.repo.topics.includes('featured');
  const filename = isFeatured ? 'screenshot_featured.png' : 'screenshot.png';
  
  return `https://luizhanauer.github.io/${props.repo.name}/assets/${filename}`;
});

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = props.defaultImage;
};
</script>

<template>
  <div 
    class="group relative flex flex-col rounded-2xl border border-github-border bg-github-card transition-all duration-500 hover:-translate-y-2 hover:border-github-accent hover:shadow-2xl hover:shadow-github-accent/10 overflow-hidden isolate"
    :class="{ 'md:col-span-2': repo.topics.includes('featured') }"
  >
    <div class="relative h-75 w-full overflow-hidden bg-github-bg border-b border-github-border isolate">
      <img 
        :src="displayScreenshot" 
        :alt="repo.name"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        @error="handleImageError"
      >
      
      <div class="absolute inset-0 bg-gradient-to-t from-github-card/60 to-transparent pointer-events-none"></div>

      <div class="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
        <span v-if="repo.language" class="rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-github-accent text-black shadow-xl">
          {{ repo.language }}
        </span>
        <span v-if="repo.topics.includes('featured')" class="rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-github-featured text-black shadow-xl">
          ★ Featured
        </span>
      </div>
    </div>

    <div class="flex flex-grow flex-col p-8 bg-github-card/50 backdrop-blur-sm z-10">
      <h3 class="mb-3 text-2xl font-extrabold text-github-text-main tracking-tight group-hover:text-github-accent transition-colors">
        {{ formatName(repo.name) }}
      </h3>
      <p class="mb-8 flex-grow text-sm leading-relaxed text-github-text-dim">
        {{ repo.description || 'System utility developed for specialized workflows.' }}
      </p>
      <div class="flex gap-4">
        <a :href="repo.html_url" target="_blank" class="flex-1 text-center text-xs font-bold text-white px-4 py-3 rounded-xl bg-[#21262d] border border-github-border transition-all hover:bg-github-accent hover:border-github-accent hover:text-black cursor-pointer">
          GitHub
        </a>
        <a v-if="repo.homepage" :href="repo.homepage" target="_blank" class="flex-1 text-center text-xs font-bold text-white px-4 py-3 rounded-xl bg-[#21262d] border border-github-border transition-all hover:bg-github-accent hover:border-github-accent hover:text-black cursor-pointer">
          Ver Projeto
        </a>
      </div>
    </div>
  </div>
</template>