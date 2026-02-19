import { ref } from 'vue';
import type { AppConfig } from '../types';

export function useAppConfig() {
  const config = ref<AppConfig | null>(null);
  const loadingConfig = ref(true);

  const applyTheme = (theme: AppConfig['theme']) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      // Mapeia as chaves do JSON para as variáveis CSS definidas no style.css
      root.style.setProperty(`--${key}`, value);
    });
  };

  const loadConfig = async () => {
    try {
      // O arquivo config.json deve estar na pasta /public
      const response = await fetch('/config.json');
      const data = await response.json();
      config.value = data;
      if (config.value) {
        applyTheme(config.value.theme);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      loadingConfig.value = false;
    }
  };

  return {
    config,
    loadingConfig,
    loadConfig
  };
}