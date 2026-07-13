// --- Replace your old Search input block with this safe version ---
if (searchInput && noResults) {
    searchInput.addEventListener("input", () => {
        const val = searchInput.value.trim().toLowerCase();
        let matchedElements = 0;

        // --- Grid Cards Search Core ---
        const searchableCards = document.querySelectorAll(".note-card-searchable");
        searchableCards.forEach(card => {
            const titleNode = card.querySelector(".searchable-title");
            const descNode = card.querySelector(".searchable-desc");
            if (!titleNode || !descNode) return; // Guard clause
            
            const plainString = `${titleNode.textContent} ${descNode.textContent}`.toLowerCase();

            if (plainString.includes(val)) {
                card.style.display = "flex";
                matchedElements++;
                processHighlight(titleNode, val);
                processHighlight(descNode, val);
            } else {
                card.style.display = "none";
                processHighlight(titleNode, "");
                processHighlight(descNode, "");
            }
        });

        // --- Sidebar List Elements Search Core ---
        const interactiveNavItems = document.querySelectorAll(".searchable-item");
        interactiveNavItems.forEach(item => {
            const innerTextElement = item.querySelector(".menu-title") || item.querySelector("span") || item;
            const matchStringText = innerTextElement.textContent.toLowerCase();

            if (matchStringText.includes(val)) {
                item.style.opacity = "1";
                item.style.pointerEvents = "auto";
                if (val.length > 0) {
                    matchedElements++;
                    processHighlight(innerTextElement, val);

                    const subBlock = item.closest(".submenu-container");
                    if (subBlock && !subBlock.classList.contains("expanded")) {
                        subBlock.classList.add("expanded");
                        const toggleBtn = subBlock.querySelector(".submenu-toggle");
                        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
                    }
                } else {
                    processHighlight(innerTextElement, "");
                }
            } else {
                if (val.length > 0) {
                    item.style.opacity = "0.25";
                    processHighlight(innerTextElement, "");
                } else {
                    item.style.opacity = "1";
                    processHighlight(innerTextElement, "");
                }
            }
        });

        if (matchedElements === 0 && val.length > 0) {
            noResults.className = "no-results-visible";
        } else {
            noResults.className = "no-results-hidden";
        }
    });
}
