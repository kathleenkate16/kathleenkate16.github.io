document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    const themeToggle = document.getElementById('theme-toggle');

    // AOS is optional. If its CDN is unavailable, keep every section visible.
    if (window.AOS) {
        AOS.init({ once: true, duration: 700, offset: 70 });
    } else {
            document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    let savedTheme = null;
    try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const setTheme = theme => {
        root.dataset.theme = theme;
        if (themeIcon) themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };
    const onScroll = () => {
        const y = window.scrollY;
        navbar?.classList.toggle('scrolled', y > 40);
        backToTop?.classList.toggle('visible', y > 500);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

        let current = 'home';
        document.querySelectorAll('section[id]').forEach(section => {
            if (y >= section.offsetTop - 160) current = section.id;
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    setTheme(savedTheme || preferredTheme);
    themeToggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
    });

})