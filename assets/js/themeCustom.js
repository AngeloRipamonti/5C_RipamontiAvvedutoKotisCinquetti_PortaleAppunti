export function themeComponent(html, button) {
    button.onclick = () => {
        const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        button.innerHTML = newTheme === 'dark' ? `<i id="theme-moon-img" class="fas fa-moon"></i>` : `<i id="theme-sun-img" class="fa-solid fa-sun"></i>`;

        localStorage.setItem('theme', newTheme);
    }

    return {
        initialize: () => {
            const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');
            const themeToApply = savedTheme || (userPrefersDark ? 'dark' : 'light');

            html.setAttribute('data-theme', themeToApply);
            button.innerHTML = themeToApply === 'dark' ? `<i id="theme-moon-img" class="fas fa-moon"></i>` : `<i id="theme-sun-img" class="fa-solid fa-sun"></i>`;
        }
    }
}