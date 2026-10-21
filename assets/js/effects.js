/* Local progressive enhancement: content remains visible without JavaScript. */
(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let framePending = false;

    function updateProgress() {
        const scrollable = root.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        root.style.setProperty("--scroll-progress", Math.max(0, Math.min(1, progress)));
        framePending = false;
    }

    function scheduleProgress() {
        if (!framePending) {
            framePending = true;
            window.requestAnimationFrame(updateProgress);
        }
    }

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    window.addEventListener("load", scheduleProgress);
    scheduleProgress();

    if (motionPreference.matches || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll([
        ".home__social", ".home__img", ".home__data",
        ".about__img", ".about__data", ".skills__header",
        ".qualification__data", ".services__content > div:not(.services__modal)",
        ".portfolio__container", ".contact__information", ".project__data"
    ].join(","));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    targets.forEach((target, index) => {
        target.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
        observer.observe(target);
        target.classList.add("reveal-item");
    });

    motionPreference.addEventListener("change", (event) => {
        if (event.matches) {
            observer.disconnect();
            targets.forEach((target) => target.classList.add("is-visible"));
        }
    });
})();
