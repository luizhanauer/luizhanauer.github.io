import { ref } from 'vue';
import type { Repository } from '../types';

export function useGitHub(username: string, tagFilter: string) {
  const repos = ref<Repository[]>([]);
  const loadingRepos = ref(true);
  const error = ref<string | null>(null);

  const fetchRepos = async () => {
    loadingRepos.value = true;
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`);
      if (!response.ok) throw new Error('GitHub API Error');
      
      const data: Repository[] = await response.json();
      
      repos.value = data
        .filter(repo => repo.topics.includes(tagFilter))
        .sort((a, b) => Number(b.topics.includes('featured')) - Number(a.topics.includes('featured')));
        
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loadingRepos.value = false;
    }
  };

  return {
    repos,
    loadingRepos,
    error,
    fetchRepos
  };
}