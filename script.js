
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // ELEMENTY STRONY
    // ========================================

    const projectsGrid = document.getElementById("projects-grid");
    const portfolioMessage = document.getElementById("portfolio-message");
    const filterButtons = document.querySelectorAll(".filter");

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
    // GENEROWANIE KART
    // ========================================

    function renderProjects() {

        projectsGrid.innerHTML = "";

        const filteredProjects = activeFilter === "all"
            ? projects
            : projects.filter(project =>
                project.category === activeFilter
            );


        // Brak projektów

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


        // Tworzenie kart

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

                imageContainer.style.display = "flex";
                imageContainer.style.alignItems = "center";
                imageContainer.style.justifyContent = "center";

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


            // Złożenie karty

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
    // FILTROWANIE PROJEKTÓW
    // ========================================

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            if (!selectedFilter) return;

            activeFilter = selectedFilter;


            // Aktualizacja wyglądu przycisków

            filterButtons.forEach(filterButton => {

                const isActive =
                    filterButton === button;

                filterButton.classList.toggle("active", isActive);

                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });


            // Ponowne wyświetlenie galerii

            renderProjects();

        });

    });


    // ========================================
    // START
    // ========================================

    loadProjects();

});
