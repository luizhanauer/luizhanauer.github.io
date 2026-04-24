<script setup lang="ts">
import type { Repository } from '../types';
import { computed } from 'vue';

const props = defineProps<{
  repo: Repository;
  defaultImage: string;
  username: string;
}>();

const emit = defineEmits<{
  (e: 'openSandbox', url: string): void
}>();

const formatName = (name: string) => {
  return name.split(/[-_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const displayScreenshot = computed(() => {
  const isFeatured = props.repo.topics.includes('featured');
  const filename = isFeatured ? 'screenshot_featured.png' : 'screenshot.png';
  return `https://${props.username}.github.io/${props.repo.name}/assets/${filename}`;
});

const isSandboxEnabled = computed(() => props.repo.topics.includes('iframe-sandbox'));

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = props.defaultImage;
};

const handlePreviewClick = (e: Event) => {
  e.preventDefault();
  if (!props.repo.homepage) return;
  emit('openSandbox', props.repo.homepage);
};
</script>

<template>
  <article class="group flex flex-col bg-[#161b22]/80 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5">
    
    <div class="relative h-48 w-full overflow-hidden border-b border-zinc-800 isolate bg-[#0d1117]">
      <img 
        :src="displayScreenshot" 
        :alt="repo.name"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        @error="handleImageError"
      >
      
      <div class="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-80 pointer-events-none"></div>

      <div class="absolute top-3 left-3 z-10">
        <span v-if="repo.language" class="bg-black/80 backdrop-blur-md text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-mono border border-emerald-500/30 uppercase tracking-widest font-bold shadow-lg">
          {{ repo.language }}
        </span>
      </div>

      <div class="absolute top-3 right-3 z-10">
        <span v-if="repo.topics.includes('featured')" class="bg-yellow-500/10 backdrop-blur-md text-yellow-500 px-2.5 py-1 rounded-md text-[10px] border border-yellow-500/30 uppercase tracking-widest font-bold shadow-lg flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          Featured
        </span>
      </div>

      <div 
        v-if="isSandboxEnabled && repo.homepage" 
        class="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20"
      >
        <button 
          @click="handlePreviewClick"
          class="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-lg font-bold text-xs shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          QUICK PREVIEW
        </button>
      </div>
    </div>

    <div class="flex flex-col flex-grow p-6 z-10">
      <h3 class="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
        {{ formatName(repo.name) }}
      </h3>
      
      <p class="mb-6 flex-grow text-sm text-zinc-400 line-clamp-3 leading-relaxed">
        {{ repo.description || 'Nenhuma descrição fornecida para esta aplicação ou utilitário de sistema.' }}
      </p>
      
      <div class="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-zinc-800/50">
        <a 
          :href="repo.html_url" 
          target="_blank" 
          class="flex items-center justify-center gap-2 text-xs font-bold text-zinc-300 py-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GITHUB
        </a>
        
        <a 
          :href="repo.homepage || '#'" 
          :target="repo.homepage ? '_blank' : '_self'"
          :class="!repo.homepage 
            ? 'opacity-40 cursor-not-allowed bg-transparent border-zinc-800 text-zinc-500' 
            : 'hover:bg-emerald-500/10 hover:border-emerald-500/50 text-emerald-400 bg-transparent border-zinc-700'"
          class="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg border transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          VER PROJETO
        </a>
      </div>
    </div>
  </article>
</template>