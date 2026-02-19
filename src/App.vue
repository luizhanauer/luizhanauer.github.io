<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useAppConfig } from './composables/useAppConfig';
import { useGitHub } from './composables/useGitHub';
import BackgroundParticles from './components/BackgroundParticles.vue';
import RepoCard from './components/RepoCard.vue';

// Inicialização dos Composables
const { config, loadingConfig, loadConfig } = useAppConfig();

import { ref } from 'vue';
import type { Repository } from './types';

const repos = ref<Repository[]>([]);
const loadingRepos = ref(true);

onMounted(async () => {
  await loadConfig();
});

// Assim que o config carregar, buscamos os repositórios
watch(config, async (newConfig) => {
  if (newConfig) {
    const { repos: fetchedRepos, fetchRepos, loadingRepos: loading } = useGitHub(
      newConfig.profile.username,
      newConfig.profile.tagFilter
    );
    
    // Sincronizar estado local com o composable
    // Nota: Em uma refatoração mais profunda, o useGitHub poderia ser reativo globalmente ou aceitar refs
    await fetchRepos();
    repos.value = fetchedRepos.value;
    loadingRepos.value = loading.value;
  }
});
</script>

<template>
  <div class="min-h-screen relative font-sans text-github-text-main selection:bg-github-accent/30">
    <BackgroundParticles v-if="config" :config="config.theme.particles" />

    <main class="relative py-16 px-[2.5%] mx-auto">
      
      <header v-if="config" class="max-w-3xl mx-auto text-center mb-16">
        <h1 class="text-5xl font-extrabold text-white mb-4 tracking-tight">
          {{ config.profile.pageTitle }}
        </h1>
        <p class="text-github-text-dim text-lg">
          {{ config.profile.description }}
        </p>
      </header>

      <div v-if="loadingConfig || loadingRepos" class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8">
        <div v-for="i in 6" :key="i" class="h-[480px] bg-github-card border border-github-border rounded-2xl relative overflow-hidden">
          <div class="absolute inset-0 skeleton-wave"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8">
        <RepoCard 
          v-for="repo in repos" 
          :key="repo.id" 
          :repo="repo" 
          :username="config!.profile.username"
          :default-image="config!.profile.defaultImage"
        />
      </div>

    </main>
  </div>
</template>