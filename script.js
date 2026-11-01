// Prosty efekt pojawiania się elementów podczas przewijania

const elements = document.querySelectorAll(
    ".section, .project-card, .skill"
);

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }

        });
    },
    {
        threshold: 0.15
    }
);

elements.forEach((element) => {
    observer.observe(element);
});