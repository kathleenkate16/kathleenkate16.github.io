document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const progress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

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
    setTheme(savedTheme || preferredTheme);
    themeToggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
    });

    hamburger?.addEventListener('click', () => {
        const open = navLinks?.classList.toggle('open');
        hamburger.classList.toggle('active', Boolean(open));
        hamburger.setAttribute('aria-expanded', String(Boolean(open)));
    });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
        navLinks?.classList.remove('open');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
    }));

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
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const typed = document.getElementById('typed-text');
    const roles = ['Full-Stack Developer', 'IT Specialist', 'Problem Solver'];
    let role = 0, letter = 0, deleting = false;
    const type = () => {
        if (!typed) return;
        const value = roles[role];
        letter += deleting ? -1 : 1;
        typed.textContent = value.slice(0, letter);
        let delay = deleting ? 55 : 95;
        if (!deleting && letter === value.length) { deleting = true; delay = 1400; }
        if (deleting && letter === 0) { deleting = false; role = (role + 1) % roles.length; delay = 300; }
        window.setTimeout(type, delay);
    };
    type();

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter || 'all';
        document.querySelectorAll('.project-card').forEach(card => {
            const category = card.dataset.category || '';
            card.style.display = filter === 'all' || category.split(' ').includes(filter) ? '' : 'none';
        });
    }));

    const form = document.getElementById('contact-form');
    form?.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'flex';
        form.reset();
    });
});