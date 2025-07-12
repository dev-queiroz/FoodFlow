import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark';

const THEME_KEY = 'app_theme';

export function useTheme() {
  const isDark = ref<boolean>(false);

  // Verificar tema preferido do sistema
  const getSystemTheme = (): Theme => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  // Carregar tema salvo ou usar o tema do sistema
  const loadTheme = (): void => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const systemTheme = getSystemTheme();
    
    // Se não houver tema salvo, usar o tema do sistema
    const themeToUse = savedTheme || systemTheme;
    
    isDark.value = themeToUse === 'dark';
    applyTheme(themeToUse);
  };

  // Aplicar tema ao documento
  const applyTheme = (theme: Theme): void => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  };

  // Alternar entre temas claro/escuro
  const toggleTheme = (): void => {
    isDark.value = !isDark.value;
    const theme: Theme = isDark.value ? 'dark' : 'light';
    
    // Salvar preferência
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  };

  // Inicializar o tema
  onMounted(() => {
    loadTheme();
    
    // Observar mudanças no tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Só aplicar se o usuário não tiver uma preferência salva
      if (!localStorage.getItem(THEME_KEY)) {
        isDark.value = e.matches;
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Limpar listener quando o componente for desmontado
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  return {
    isDark,
    toggleTheme,
  };
}
