import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollAnimation() {
  const animatedElements = ref<Set<HTMLElement>>(new Set());
  
  const handleScroll = () => {
    const elements = Array.from(animatedElements.value);
    const windowHeight = window.innerHeight;
    
    elements.forEach((element) => {
      if (!element) return;
      
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animate-fade-in-up');
      }
    });
  };
  
  const registerElement = (element: HTMLElement | null) => {
    if (element && !animatedElements.value.has(element)) {
      animatedElements.value.add(element);
    }
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to check initial positions
    setTimeout(handleScroll, 100);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  
  return {
    registerElement
  };
}

export function useHoverAnimation() {
  const hoveredItem = ref<number | null>(null);
  
  const handleMouseEnter = (index: number) => {
    hoveredItem.value = index;
  };
  
  const handleMouseLeave = () => {
    hoveredItem.value = null;
  };
  
  return {
    hoveredItem,
    handleMouseEnter,
    handleMouseLeave
  };
}

export function useOrderAnimations() {
  const orderStatusClasses = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    delivered: 'bg-gray-100 text-gray-800 border-gray-200',
    delayed: 'bg-red-100 text-red-800 border-red-200'
  };
  
  const priorityClasses = {
    high: 'border-l-4 border-red-500',
    normal: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-blue-500'
  };
  
  const getStatusClass = (status: string) => {
    return orderStatusClasses[status as keyof typeof orderStatusClasses] || 'bg-gray-100 text-gray-800';
  };
  
  const getPriorityClass = (priority: string) => {
    return priorityClasses[priority as keyof typeof priorityClasses] || '';
  };
  
  return {
    getStatusClass,
    getPriorityClass
  };
}

export function useResponsive() {
  const isMobile = ref(window.innerWidth < 768);
  const isTablet = ref(window.innerWidth >= 640 && window.innerWidth < 1024);
  const isDesktop = ref(window.innerWidth >= 1024);
  
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
    isTablet.value = window.innerWidth >= 640 && window.innerWidth < 1024;
    isDesktop.value = window.innerWidth >= 1024;
  };
  
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
  
  return {
    isMobile,
    isTablet,
    isDesktop
  };
}
