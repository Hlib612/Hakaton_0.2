let darkMode = false;
const themes = {
    light: {
      '--main-text-color': '#3E3E3E',
      '--second-text-color': '#7A6F63',
      '--main-bg-color': '#FFF9F0',
      '--second-bg-color': '#FDF6E3',
      '--hover-color': '#D6B87C',
      '--ui-color': '#E8D9BF',
      '--shadow-border-color': '#DDD2C4'
    },
    dark: {
      '--main-text-color': '#E1DEEA',
      '--second-text-color': '#A69BB4',
      '--main-bg-color': '#0E0B14',
      '--second-bg-color': '#1A1524',
      '--hover-color': '#A27BFF',
      '--ui-color': '#5F4B8B',
      '--shadow-border-color': '#1E1E1E'
    }
  };
  
  document.querySelector('#themeToggle').addEventListener('click', () => {
    darkMode = !darkMode;
    const selectedTheme = darkMode ? themes.dark : themes.light;
    for (let prop in selectedTheme) {
      document.documentElement.style.setProperty(prop, selectedTheme[prop]);
    }
  });
  