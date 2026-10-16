document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

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

})