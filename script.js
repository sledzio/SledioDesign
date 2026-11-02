
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTY STRONY
    // ========================================

    const projectsGrid = document.getElementById("projects-grid");
    const portfolioMessage = document.getElementById("portfolio-message");
    const filterButtons = document.querySelectorAll(".filter");
    const galleryTrack = document.getElementById("hero-gallery-track");

    let projects = [];
    let activeFilter = "all";


    // ========================================
    // POBIERANIE PROJEKTÓW
    // ========================================

    async function loadProjects() {

        if (!projectsGrid) return;

        try {

            const response = await fetch("projects.json");

            if (!response.ok) {
                throw new Error("Nie udało się pobrać projects.json");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Nieprawidłowy format projects.json");
            }

            projects = data.filter(project =>
                project &&
                typeof project.title === "string" &&
                typeof project.image === "string" &&
                typeof project.category === "string"
            );

            renderProjects();

            // Uruchomienie animowanego tła
            renderHeroGallery();

        } catch (error) {

            console.error("Błąd ładowania portfolio:", error);

            projectsGrid.innerHTML = `
                <p class="projects-loading">
                    Nie udało się załadować projektów.
                    Sprawdź plik projects.json.
                </p>
            `;

            if (portfolioMessage) {
                portfolioMessage.textContent =
                    "Wystąpił problem z wczytaniem galerii.";
            }

        }

    }


    // ========================================
    // GENEROWANIE KART PORTFOLIO
    // ========================================

    function renderProjects() {

        projectsGrid.innerHTML = "";

        const filteredProjects = activeFilter === "all"
            ? projects
            : projects.filter(project =>
                project.category === activeFilter
            );


        if (filteredProjects.length === 0) {

            projectsGrid.innerHTML = `
                <p class="projects-loading">
                    Brak projektów w tej kategorii.
                </p>
            `;

            if (portfolioMessage) {
                portfolioMessage.textContent =
                    "Dodaj kolejne projekty, aby rozbudować portfolio.";
            }

            return;

        }


        filteredProjects.forEach(project => {

            const card = document.createElement("article");
            card.className = "project";
            card.dataset.category = project.category;


            // Kontener zdjęcia

            const imageContainer = document.createElement("div");
            imageContainer.className = "project-image";


            const image = document.createElement("img");
            image.src = project.image;
            image.alt = project.title;
            image.loading = "lazy";
            image.decoding = "async";


            // Obsługa błędnego zdjęcia

            image.addEventListener("error", () => {

                imageContainer.innerHTML = "";

                const errorText = document.createElement("span");
                errorText.textContent = "Nie udało się wczytać grafiki.";
                errorText.style.color = "#999";
                errorText.style.fontSize = "12px";

                imageContainer.appendChild(errorText);

            }, { once: true });


            imageContainer.appendChild(image);


            // Informacje o projekcie

            const info = document.createElement("div");
            info.className = "project-info";

            const textContainer = document.createElement("div");

            const category = document.createElement("span");
            category.textContent = getCategoryName(project.category);

            const title = document.createElement("h3");
            title.textContent = project.title;

            textContainer.appendChild(category);
            textContainer.appendChild(title);


            const arrow = document.createElement("span");
            arrow.className = "project-arrow";
            arrow.textContent = "↗";


            info.appendChild(textContainer);
            info.appendChild(arrow);


            // Składanie karty

            card.appendChild(imageContainer);
            card.appendChild(info);

            projectsGrid.appendChild(card);

        });


        if (portfolioMessage) {
            portfolioMessage.textContent =
                `Wyświetlono ${filteredProjects.length} projektów.`;
        }

    }


    // ========================================
    // ANIMOWANE TŁO STRONY GŁÓWNEJ
    // ========================================

    function renderHeroGallery() {

        if (!galleryTrack || projects.length === 0) return;

        galleryTrack.innerHTML = "";

        // Wybieramy grafiki z wszystkich kategorii

        const galleryProjects = projects.filter(project =>
            project.image
        );

        if (galleryProjects.length === 0) return;


        // Funkcja tworząca pojedynczą grafikę

        function createGalleryItem(project, index) {

            const item = document.createElement("div");
            item.className = "hero-gallery-item";

            const image = document.createElement("img");

            image.src = project.image;
            image.alt = "";
            image.loading = "eager";
            image.decoding = "async";

            image.addEventListener("error", () => {
                item.remove();
            }, { once: true });

            item.appendChild(image);

            // Różne opóźnienia animacji

            item.style.animationDelay = `${-(index % 8)}s`;

            return item;

        }


        // Pierwsza połowa galerii

        galleryProjects.forEach((project, index) => {

            galleryTrack.appendChild(
                createGalleryItem(project, index)
            );

        });


        // Druga połowa - identyczna, aby uzyskać płynną pętlę

        galleryProjects.forEach((project, index) => {

            galleryTrack.appendChild(
                createGalleryItem(project, index)
            );

        });

    }


    // ========================================
    // NAZWY KATEGORII
    // ========================================

    function getCategoryName(category) {

        const categories = {
            thumbnails: "Miniaturki",
            illustration: "Grafiki i ilustracje",
            profile: "Profile i logotypy",
            design: "Inne projekty"
        };

        return categories[category] || "Projekt graficzny";

    }


    // ========================================
    // FILTROWANIE PORTFOLIO
    // ========================================

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            if (!selectedFilter) return;

            activeFilter = selectedFilter;


            // Aktualizacja przycisków

            filterButtons.forEach(filterButton => {

                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });


            // Ponowne renderowanie portfolio

            renderProjects();

        });

    });


    // ========================================
    // START
    // ========================================

    loadProjects();

});
