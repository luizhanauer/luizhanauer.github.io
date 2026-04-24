<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue';
import { useAppConfig } from './composables/useAppConfig';
import { useGitHub } from './composables/useGitHub';
// import BackgroundParticles from './components/BackgroundParticles.vue';
// import BackgroundGrid from './components/BackgroundGrid.vue';
// import BackgroundAurora from './components/BackgroundAurora.vue';
import BackgroundPolygons from './components/BackgroundPolygons.vue';
import RepoCard from './components/RepoCard.vue';
import type { Repository } from './types';

const { config, loadingConfig, loadConfig } = useAppConfig();
const repos = ref<Repository[]>([]);
const loadingRepos = ref(true);

const activeFilter = ref<string>('all');
const activeSandboxUrl = ref<string | null>(null);

// Extração Dinâmica de Categorias
const categories = computed(() => {
  const cats = new Set<string>();
  
  repos.value.forEach(repo => {
    repo.topics.forEach(topic => {
      if (topic.startsWith('cat-')) {
        cats.add(topic);
      }
    });
  });
  
  return Array.from(cats).map(c => ({
    id: c,
    label: c.replace('cat-', '').replace(/-/g, ' ').toUpperCase()
  })).sort((a, b) => a.label.localeCompare(b.label));
});

const displayedRepos = computed(() => {
  if (activeFilter.value === 'all') {
    return repos.value;
  }

  return repos.value.filter(repo => repo.topics.includes(activeFilter.value));
});

onMounted(async () => {
  await loadConfig();
});

watch(config, async (newConfig) => {
  if (!newConfig) return;

  const { repos: fetchedRepos, fetchRepos, loadingRepos: loading } = useGitHub(
    newConfig.profile.username,
    newConfig.profile.tagFilter
  );
  
  await fetchRepos();
  repos.value = fetchedRepos.value;
  loadingRepos.value = loading.value;
});

const openSandbox = (url: string) => {
  activeSandboxUrl.value = url;
  document.body.style.overflow = 'hidden';
};

const closeSandbox = () => {
  activeSandboxUrl.value = null;
  document.body.style.overflow = '';
};
</script>

<template>
  <div class="min-h-screen relative bg-[#0d1117] text-slate-200 font-['Geist_Sans',_sans-serif] selection:bg-emerald-500/30 overflow-x-hidden">
    
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- <BackgroundParticles v-if="config" :config="config.theme.particles" /> -->
       <!-- <BackgroundGrid /> -->
        <!-- <BackgroundAurora /> -->
         <BackgroundPolygons v-if="config" :config="config.theme.particles" />
    </div>

    <Teleport to="body">
      <div 
        v-if="activeSandboxUrl" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 transition-opacity"
        @click.self="closeSandbox"
      >
        <div class="bg-[#0d1117] border border-zinc-800 rounded-xl w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden shadow-2xl ring-1 ring-emerald-500/20">
          
          <div class="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-black/40">
            <div class="flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span class="text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-md ml-2 flex items-center gap-2">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                {{ activeSandboxUrl }}
              </span>
            </div>
            
            <div class="flex gap-4">
              <a :href="activeSandboxUrl" target="_blank" class="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                Abrir Nova Aba ↗
              </a>
              <button @click="closeSandbox" class="text-xs font-bold text-zinc-400 hover:text-red-400 transition-colors cursor-pointer">
                FECHAR ✕
              </button>
            </div>
          </div>
          
          <div class="flex-grow bg-white relative">
            <div class="absolute inset-0 flex items-center justify-center -z-10 bg-[#0d1117]">
              <span class="text-emerald-500 font-mono animate-pulse text-sm">A carregar aplicação...</span>
            </div>
            <iframe 
              :src="activeSandboxUrl" 
              class="w-full h-full border-none" 
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
          </div>
        </div>
      </div>
    </Teleport>

    <main class="relative z-10 py-16 px-[4%] md:px-[5%] xl:px-[8%] mx-auto max-w-[1920px]">
      
      <header v-if="config" class="max-w-3xl mx-auto text-center mb-16">
        <h1 class="text-5xl font-extrabold text-white mb-4 tracking-tight">
          {{ config.profile.pageTitle }}
        </h1>
        <p class="text-zinc-400 text-lg">
          {{ config.profile.description }}
        </p>
      </header>

      <nav v-if="!loadingConfig && !loadingRepos" class="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          @click="activeFilter = 'all'"
          :class="activeFilter === 'all' 
            ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'"
          class="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 border cursor-pointer uppercase tracking-wide"
        >
          Todos os Projetos
          <span v-if="activeFilter === 'all'" class="ml-2 bg-black/20 px-2 py-0.5 rounded-md text-[10px]">
            {{ displayedRepos.length }}
          </span>
        </button>

        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeFilter = cat.id"
          :class="activeFilter === cat.id 
            ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'"
          class="px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 border cursor-pointer uppercase tracking-wide"
        >
          {{ cat.label }}
          <span v-if="activeFilter === cat.id" class="ml-2 bg-black/20 px-2 py-0.5 rounded-md text-[10px]">
            {{ displayedRepos.length }}
          </span>
        </button>
      </nav>

      <div v-if="loadingConfig || loadingRepos" class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 xl:gap-8">
        <div v-for="i in 8" :key="i" class="h-[420px] bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden backdrop-blur-sm">
          <div class="absolute inset-0 skeleton-wave"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 xl:gap-8 transition-all duration-500 relative min-h-[500px]">
        <TransitionGroup name="list">
          <RepoCard 
            v-for="repo in displayedRepos" 
            :key="repo.id" 
            :repo="repo" 
            :username="config!.profile.username"
            :default-image="config!.profile.defaultImage"
            @open-sandbox="openSandbox"
          />
        </TransitionGroup>
      </div>
      
      <div v-if="!loadingRepos && displayedRepos.length === 0" class="text-center py-20 text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-xl bg-black/20 backdrop-blur-md">
        Nenhum repositório encontrado nesta categoria.
      </div>

    </main>
  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans.css');
@import url('https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-mono.css');

body {
  font-family: 'Geist Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.font-mono {
  font-family: 'Geist Mono', monospace;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.skeleton-wave {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  animation: wave 1.5s infinite linear;
}

@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>