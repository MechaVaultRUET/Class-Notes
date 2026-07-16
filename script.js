/**
 * Academic Vault | ME-C1
 * Main JavaScript Controller (Part 1)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Core Layout Elements
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    const themeBtn = document.getElementById("themeBtn");
    const topBtn = document.getElementById("topBtn");
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");
    const overlay = document.getElementById("sidebar-overlay");
    const clockElement = document.getElementById("clock");

    // State preservation for open submenus
    const openMenus = JSON.parse(sessionStorage.getItem("openSubmenus")) || [];

    /* ==========================================================================
       1. PARTICLE BACKGROUND ANIMATION
       ========================================================================== */
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

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
            ctx.fillStyle = document.body.classList.contains("light") 
                ? "rgba(124, 58, 237, 0.1)" 
                : "rgba(168, 85, 247, 0.2)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });

    resizeCanvas();
    initParticles();
    animateParticles();

    /* ==========================================================================
       2. REAL-TIME CLOCK
       ========================================================================== */
    function updateClock() {
        if (clockElement) {
            clockElement.textContent = new Date().toLocaleString();
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ==========================================================================
       3. EXPANDABLE SUBMENUS WITH STATE RETENTION
       ========================================================================== */
    const submenuContainers = document.querySelectorAll('.submenu-container');

    // Restore submenu states from session storage
    submenuContainers.forEach(container => {
        const menuId = container.getAttribute('data-menu');
        if (openMenus.includes(menuId)) {
            container.classList.add('open');
            const trigger = container.querySelector('.submenu-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
        }
    });

    submenuContainers.forEach(container => {
        const trigger = container.querySelector('.submenu-trigger');
        const menuId = container.getAttribute('data-menu');

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = container.classList.contains('open');

            // Close other sibling submenus
            submenuContainers.forEach(other => {
                if (other !== container) {
                    other.classList.remove('open');
                    other.querySelector('.submenu-trigger').setAttribute('aria-expanded', 'false');
                    const otherId = other.getAttribute('data-menu');
                    const idx = openMenus.indexOf(otherId);
                    if (idx > -1) openMenus.splice(idx, 1);
                }
            });

            // Toggle state
            if (isOpen) {
                container.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                const idx = openMenus.indexOf(menuId);
                if (idx > -1) openMenus.splice(idx, 1);
            } else {
                container.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                if (!openMenus.includes(menuId)) openMenus.push(menuId);
            }

            // Update session storage
            sessionStorage.setItem("openSubmenus", JSON.stringify(openMenus));
        });
    });

    /* ==========================================================================
       4. ACTIVE SIDEBAR NAVIGATION HIGHLIGHTING
       ========================================================================== */
    const allLinks = document.querySelectorAll('.filter-link, .submenu-link');
    
    // Read the current active link from session storage to keep it active across interactions
    const activeLinkHref = sessionStorage.getItem('activeSidebarLink');
    if (activeLinkHref) {
        allLinks.forEach(link => {
            if (link.getAttribute('href') === activeLinkHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active style from everything
            allLinks.forEach(item => item.classList.remove('active'));
            // Highlight clicked item
            this.classList.add('active');
            // Save selection
            if (this.getAttribute('href') !== '#') {
                sessionStorage.setItem('activeSidebarLink', this.getAttribute('href'));
            }
        });
    }); 



        /* ==========================================================================
       5. MOBILE RESPONSIVE SIDEBAR LOGIC
       ========================================================================== */
    function closeMobileSidebar() {
        if (sidebar && menuToggle && overlay) {
            sidebar.classList.remove('active');
            menuToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore page scrolling
        }
    }

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = sidebar.classList.contains('active');
            
            sidebar.classList.toggle('active', !isActive);
            menuToggle.classList.toggle('active', !isActive);
            overlay.classList.toggle('active', !isActive);
            
            // Prevent body scroll when mobile sidebar is open
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        // Close sidebar when clicking outside on overlay
        overlay.addEventListener('click', closeMobileSidebar);

        // Auto-close sidebar after clicking any link inside it
        const sidebarLinks = sidebar.querySelectorAll('a, .submenu-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Perform quick fade animation for navigation link click
                link.style.opacity = '0.5';
                setTimeout(() => { link.style.opacity = ''; }, 200);
                
                // Close sidebar after minor delay to ensure visual feedback
                setTimeout(closeMobileSidebar, 250);
            });
        });
    }

    /* ==========================================================================
       6. POWERFUL UNIVERSAL SEARCH ENGINE (WITH TEXT HIGHLIGHTING)
       ========================================================================== */
    const searchInput = document.getElementById("searchInput");
    const noResults = document.getElementById("no-results");

    /**
     * Highlights search queries inside elements matching input.
     * Preserves original inner HTML structures while highlighting search parameters.
     */
    function highlightSearch(element, text) {
        if (!text) {
            // Restore clean text from stored raw attribute if present
            if (element.hasAttribute('data-original-text')) {
                element.innerHTML = element.getAttribute('data-original-text');
                element.removeAttribute('data-original-text');
            }
            return;
        }

        // Store original text state if not already saved
        if (!element.hasAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.innerHTML);
        }

        const rawText = element.getAttribute('data-original-text');
        const regex = new RegExp(`(${escapeRegExp(text)})`, 'gi');
        
        // Highlight terms while skipping internal HTML tag structures
        const highlighted = rawText.replace(regex, '<mark class="highlight">$1</mark>');
        element.innerHTML = highlighted;
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            let hasMatches = false;

            // 1. Process and filter Subject Cards
            const cards = document.querySelectorAll(".note-card");
            cards.forEach(card => {
                const titleEl = card.querySelector(".searchable-title");
                const descEl = card.querySelector(".searchable-desc");
                const cardTitle = titleEl ? titleEl.textContent : "";
                const cardDesc = descEl ? descEl.textContent : "";

                const matchesTitle = cardTitle.toLowerCase().includes(query);
                const matchesDesc = cardDesc.toLowerCase().includes(query);

                if (matchesTitle || matchesDesc) {
                    card.style.display = "flex";
                    hasMatches = true;

                    // Apply highlights if query exists
                    if (titleEl) highlightSearch(titleEl, query);
                    if (descEl) highlightSearch(descEl, query);
                } else {
                    card.style.display = "none";
                    if (titleEl) highlightSearch(titleEl, "");
                    if (descEl) highlightSearch(descEl, "");
                }
            });

            // 2. Process and highlight Sidebar Navigation Links
            const menuLinks = document.querySelectorAll(".filter-link, .submenu-link");
            menuLinks.forEach(link => {
                const text = link.textContent.trim().toLowerCase();
                if (query && text.includes(query)) {
                    hasMatches = true;
                    highlightSearch(link, query);
                    
                    // If a sublink matches, automatically expand parent submenu
                    const parentContainer = link.closest('.submenu-container');
                    if (parentContainer && !parentContainer.classList.contains('open')) {
                        parentContainer.classList.add('open');
                        const trigger = parentContainer.querySelector('.submenu-trigger');
                        if (trigger) trigger.setAttribute('aria-expanded', 'true');
                    }
                } else {
                    highlightSearch(link, "");
                }
            });

            // 3. Display or Hide "No results found" notification card
            if (noResults) {
                noResults.style.display = (!hasMatches && query !== "") ? "block" : "none";
            }
        });
    }

    /* ==========================================================================
       7. BACK TO TOP CONFIGURATION
       ========================================================================== */
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.classList.add("show");
            } else {
                topBtn.classList.remove("show");
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ==========================================================================
       8. THEME TOGGLE & STATE PRESERVATION
       ========================================================================== */
    // Apply saved theme state on initialization
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        if (themeBtn) themeBtn.textContent = "☀️ Theme";
    } else {
        document.body.classList.remove("light");
        if (themeBtn) themeBtn.textContent = "🌙 Theme";
    }

    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle("light");
            const isLight = document.body.classList.contains("light");
            
            localStorage.setItem("theme", isLight ? "light" : "dark");
            themeBtn.textContent = isLight ? "☀️ Theme" : "🌙 Theme";
        };
    }
});
