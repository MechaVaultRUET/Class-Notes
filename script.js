/**
 * Academic Vault | ME-C1 Core Engine
 * Handled Features: High-Contrast Light Mode, Expandable Submenus,
 * Deep-Search Engine with Text Match Highlighting, and Mobile Drawer controls.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. CANVAS BACKGROUND PARTICLE ANIMATION SYSTEM
       ========================================================================== */
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Populate standard low-overhead particle arrays
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ==========================================================================
       2. PERSISTENT ACCORDION NAVIGATION SUBMENUS
       ========================================================================== */
    const toggles = document.querySelectorAll(".submenu-toggle");

    // Restore expanded submenus states when reloading or working across content nodes
    toggles.forEach((toggle, index) => {
        const parent = toggle.closest(".submenu-container");
        const storageKey = `submenu_expanded_${index}`;

        // Check active session states mapping
        if (sessionStorage.getItem(storageKey) === "true") {
            parent.classList.add("expanded");
        }

        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = parent.classList.toggle("expanded");
            sessionStorage.setItem(storageKey, isExpanded ? "true" : "false");
        });
    });


    /* ==========================================================================
       3. ADVANCED DEEP SEARCH ENGINE & INTERACTIVE MATCH HIGHLIGHTER
       ========================================================================== */
    const searchInput = document.getElementById("searchInput");
    const noResultsMessage = document.getElementById("noResults");

    // Helper functions to inject text nodes wrapped in highlighting blocks cleanly
    function highlightText(element, matchString) {
        if (!matchString) {
            // Restore native text layout safely avoiding reference structural breaks
            if (element.hasAttribute("data-original-text")) {
                element.innerHTML = element.getAttribute("data-original-text");
            }
            return;
        }

        if (!element.hasAttribute("data-original-text")) {
            element.setAttribute("data-original-text", element.innerHTML);
        }

        const rawHTML = element.getAttribute("data-original-text");
        // Escape regex tokens safely
        const escapedTerms = matchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerms})`, "gi");

        const newHTML = rawHTML.replace(regex, `<mark class="search-match">$1</mark>`);
        element.innerHTML = newHTML;
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        let totalMatches = 0;

        // --- A. Process Content Grid Cards ---
        const cards = document.querySelectorAll(".note-card-searchable");
        cards.forEach(card => {
            const heading = card.querySelector(".searchable-title");
            const desc = card.querySelector(".searchable-desc");
            const combinedText = `${heading.textContent} ${desc.textContent}`.toLowerCase();

            if (combinedText.includes(query)) {
                card.style.display = "flex";
                totalMatches++;
                highlightText(heading, query);
                highlightText(desc, query);
            } else {
                card.style.display = "none";
                highlightText(heading, "");
                highlightText(desc, "");
            }
        });

        // --- B. Process Sidebar & Submenu Items ---
        const searchableNavItems = document.querySelectorAll(".searchable-item");
        searchableNavItems.forEach(item => {
            // Target plain spans or direct text context handles
            let targetNode = item.querySelector("span") ? item.querySelector("span") : item;
            const textContent = targetNode.textContent.toLowerCase();

            if (textContent.includes(query)) {
                item.style.opacity = "1";
                item.style.pointerEvents = "auto";
                if (query.length > 0) {
                    totalMatches++;
                    highlightText(targetNode, query);
                    
                    // Auto-expand parents if matching children are tucked away inside submenus
                    const parentSubmenu = item.closest(".submenu-container");
                    if (parentSubmenu && !parentSubmenu.classList.contains("expanded")) {
                        parentSubmenu.classList.add("expanded");
                    }
                } else {
                    highlightText(targetNode, "");
                }
            } else {
                if (query.length > 0) {
                    item.style.opacity = "0.3"; // Dim unmatched links instead of hiding to maintain system layout flow
                    highlightText(targetNode, "");
                } else {
                    item.style.opacity = "1";
                    highlightText(targetNode, "");
                }
            }
        });

        // --- C. Toggle Empty Match Intermediary Banner ---
        if (totalMatches === 0 && query.length > 0) {
            noResultsMessage.className = "no-results-visible";
        } else {
            noResultsMessage.className = "no-results-hidden";
        }
    });


    /* ==========================================================================
       4. MOBILE HEADER / SLIDING DRAWERS INTERACTIVITY CONTROLS
       ========================================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    function closeMobileSidebar() {
        menuToggle.classList.remove("active");
        sidebar.classList.remove("open");
        overlay.classList.remove("visible");
    }

    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle("active");
        sidebar.classList.toggle("open");
        overlay.classList.toggle("visible");
    });

    // Tap outside side drawer context on mobile layout close mechanics
    overlay.addEventListener("click", closeMobileSidebar);
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMobileSidebar();
        }
    });

    // Auto close drawer after selecting individual links safely
    const navLinks = document.querySelectorAll(".filter-link:not(.submenu-toggle)");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Handle Active state layout toggles
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });


    /* ==========================================================================
       5. HIGH CONTRAST THEME ENGINE UTILITIES
       ========================================================================== */
    const themeBtn = document.getElementById("themeBtn");

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        themeBtn.innerHTML = "☀️ Theme";
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");
        themeBtn.innerHTML = isLight ? "☀️ Theme" : "🌙 Theme";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });


    /* ==========================================================================
       6. DIGITAL SYSTEM CLOCK & FLOATING ACTION TRIGGER COMPLEMENTS
       ========================================================================== */
    const clockElement = document.getElementById("clock");
    
    function updateClock() {
        if (clockElement) {
            clockElement.innerHTML = new Date().toLocaleString();
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Smooth scroll structural framework implementation to control scroll behavior elements
    const topBtn = document.getElementById("topBtn");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            topBtn.classList.add("visible");
        } else {
            topBtn.classList.remove("visible");
        }
    });

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});
