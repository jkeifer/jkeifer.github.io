(function() {
    const STORAGE_KEY = 'theme-preference';
    const THEME_MODES = ['system', 'light', 'dark'];
    const ICONS = {
        'system': '◐',
        'light': '☀',
        'dark': '☾'
    };

    let currentTheme = localStorage.getItem(STORAGE_KEY) || 'system';

    function applyTheme(theme) {
        // Remove all theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'light') {
            document.documentElement.classList.add('theme-light');
        } else if (theme === 'dark') {
            document.documentElement.classList.add('theme-dark');
        }
        // If theme is 'system', we don't add any class and let CSS media query handle it
        
        // Update button icon
        const button = document.getElementById('theme-toggle');
        if (button) {
            const icon = button.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = ICONS[theme];
            }
        }
    }

    function cycleTheme() {
        const currentIndex = THEME_MODES.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % THEME_MODES.length;
        currentTheme = THEME_MODES[nextIndex];
        
        localStorage.setItem(STORAGE_KEY, currentTheme);
        applyTheme(currentTheme);
    }

    // Apply theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme(currentTheme);
        
        // Add click handler to toggle button
        const button = document.getElementById('theme-toggle');
        if (button) {
            button.addEventListener('click', cycleTheme);
        }
    });

    // Apply theme immediately to prevent flash
    applyTheme(currentTheme);
})();