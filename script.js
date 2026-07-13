/**
 * Academic Vault | ME-C1 Core Optimization Engine
 * Comprehensive Feature Handling: High-contrast toggles, active routing state highlights, 
 * performant layout memory preservation, and multi-node text highlights.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. SUBTLE PAGE LOADER LAYER INTERFACE REFINEMENTS
       ========================================================================== */
    const pageLoader = document.getElementById("pageLoader");
    
    // Ensure smooth frame appearance transitions
    window.addEventListener("load", () => {
        if (pageLoader) {
            pageLoader.classList.add("fade-out");
            document.body.classList.add("page-loaded");
            // Allow transitions to clear before pruning interactive contexts
            setTimeout(() => {
                pageLoader.style.display = "none";
            }, 350);
        }
    });

    // Fallback gate execution pattern if asset processing lags behind window loops
    setTimeout(() => {
        if (pageLoader && !pageLoader.classList.contains("fade-out")) {
            pageLoader.classList.add("fade-out");
            document.body.classList.add("page-loaded");
        }
    }, 1200);


    /* ==========================================================================
       2. REFINED OPTIMIZED PARTICLE BACKGROUND LOOP ANIMATION
       ========================================================================== */
    const canvas = document.getElementById("bg-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;
        
        // Use a lightweight debounce routine to optimize runtime layout rendering
        let resizeTimeout;
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 150);
        });

        class Particle {
            constructor() {
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.size = Math.random() * 1.8 + 0.4;
                this.speedX = Math.random() * 0.25 - 0.125;
                this.speedY = Math.random() * 0.25 - 0.125;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }
            }

            draw() {
                ctx.fillStyle = "rgba(217, 70, 239, 0.15)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Reduced count layout targets to improve rendering pipelines on mobile screens
        const particleCount = window.innerWidth <= 768 ? 35 : 70;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    /* ==========================================================================
       3. PERSISTENT SUBMENU STATE PRESERVATION ENGINE
       ========================================================================== */
    const toggles = document.querySelectorAll(".submenu-toggle");

    toggles.forEach((toggle, idx) => {
        const parent = toggle.closest(".submenu-container");
        const cacheKey = `vault_menu_expanded_${idx}`;

        // Restore verified expansion indexes across current page loops
        if (sessionStorage.getItem(cacheKey) === "true") {
            parent.classList.add("expanded");
            toggle.setAttribute("aria-expanded", "true");
        }

        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const isOpen = parent.classList.toggle("expanded");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            sessionStorage.setItem(cacheKey, isOpen ? "true" : "false");
        });
    });


    /* ==========================================================================
       4. PERFORMANT LIVE SEARCH & DEEP TEXT SELECTION HIGHLIGHTER
       ========================================================================== */
    const searchInput = document.getElementById("searchInput");
    const noResults = document.getElementById("noResults");

    function processHighlight(element, queryText) {
        if (!element) return;
        if (!queryText) {
            if (element.hasAttribute("data-raw-content")) {
                element.innerHTML = element.getAttribute("data-raw-content");
            }
            return;
        }

        if (!element.hasAttribute("data-raw-content")) {
            element.setAttribute("data-raw-content", element.innerHTML);
        }

        const standardHTML = element.getAttribute("data-raw-content");
        const safeQuery = queryText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const expression = new RegExp(`(${safeQuery})`, "gi");

        element.innerHTML = standardHTML.replace(expression, `<mark class="search-match">$1</mark>`);
    }

    // Guard clause protects pages lacking search structures (like notice.html) from crashing
    if (searchInput && noResults) {
        searchInput.addEventListener("input", () => {
            const val = searchInput.value.trim().toLowerCase();
            let matchedElements = 0;

            // --- Grid Cards Search Core ---
            const searchableCards = document.querySelectorAll(".note-card-searchable");
            searchableCards.forEach(card => {
                const titleNode = card.querySelector(".searchable-title");
                const descNode = card.querySelector(".searchable-desc");
                if (!titleNode || !descNode) return;
                
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

                        // Auto-expand parents if items match within closed dropdown paths
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
                        item.style.opacity = "0.25"; // Visual filtering feedback
                        processHighlight(innerTextElement, "");
                    } else {
                        item.style.opacity = "1";
                        processHighlight(innerTextElement, "");
                    }
                }
            });

            // --- Handle Blank Fallback States ---
            if (matchedElements === 0 && val.length > 0) {
                noResults.className = "no-results-visible";
            } else {
                noResults.className = "no-results-hidden";
            }
        });
    }


    /* ==========================================================================
       5. INTERACTIVE MOBILE DRAWER LAYOUT CONTROLS
       ========================================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function shutMobileSidebar() {
        if (menuToggle) {
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
        if (sidebar) sidebar.classList.remove("open");
        if (sidebarOverlay) sidebarOverlay.classList.remove("visible");
    }

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const sideActive = menuToggle.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", sideActive ? "true" : "false");
            sidebar.classList.toggle("open");
            sidebarOverlay.classList.toggle("visible");
        });

        // Click tracking layers to intercept tap-outside operations safely
        sidebarOverlay.addEventListener("click", shutMobileSidebar);
        
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                shutMobileSidebar();
            }
        });
    }

    // Capture links to activate visual status tracking anchors
    const primaryNavLinks = document.querySelectorAll(".filter-link:not(.submenu-toggle)");
    primaryNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            primaryNavLinks.forEach(node => node.classList.remove("active"));
            link.classList.add("active");

            if (window.innerWidth <= 768) {
                // Instantly shut mobile menus upon selection
                setTimeout(shutMobileSidebar, 150);
            }
        });
    });


    /* ==========================================================================
       6. HIGH-CONTRAST ACCESSIBILITY BRIGHTNESS ENGINE (REVERTED)
       ========================================================================== */
    const themeBtn = document.getElementById("themeBtn");

    if (themeBtn) {
        if (localStorage.getItem("vault_theme") === "light") {
            document.body.classList.add("light");
            themeBtn.innerHTML = "☀️ Theme";
        }

        themeBtn.addEventListener("click", () => {
            const activeState = document.body.classList.toggle("light");
            themeBtn.innerHTML = activeState ? "☀️ Theme" : "🌙 Theme";
            localStorage.setItem("vault_theme", activeState ? "light" : "dark");
        });
    }


    /* ==========================================================================
       7. CLEAN DIGITAL CORE CLOCK & VIEWPORT UTILITY HANDLERS
       ========================================================================== */
    const clock = document.getElementById("clock");

    function cycleClock() {
        if (clock) {
            const current = new Date();
            clock.innerHTML = current.toLocaleDateString(undefined, { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }) + " | " + current.toLocaleTimeString(undefined, { hour12: true });
        }
    }
    if (clock) {
        setInterval(cycleClock, 1000);
        cycleClock();
    }

    // Scroll offset mechanics for top floating triggers
    const topBtn = document.getElementById("topBtn");
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 350) {
                topBtn.classList.add("visible");
            } else {
                topBtn.classList.remove("visible");
            }
        }, { passive: true }); // Performance modification for scrolling layout tracking

        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

});
