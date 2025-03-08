document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const profileImage = document.getElementById('profileImage');
    const spacerImage = document.getElementById('spacerImage');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 800);
    });

    function createErrorMessage(imgElement, fallbackText) {
        const existingError = imgElement.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = `Failed to load ${fallbackText}`;
        imgElement.parentNode.insertBefore(errorDiv, imgElement.nextSibling);
        errorDiv.style.display = 'block';
        
        console.error(`Image load failed: ${fallbackText}`);
    }

    if (profileImage) {
        profileImage.onerror = () => createErrorMessage(profileImage, 'profile image');
    }
    
    if (spacerImage) {
        spacerImage.onerror = () => createErrorMessage(spacerImage, 'spacer image');
    }

    function openTab(tabName, button = null) {
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
            content.setAttribute('aria-hidden', 'true');
        });

        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
            selectedTab.style.display = 'block';
            selectedTab.setAttribute('aria-hidden', 'false');
            
            setTimeout(() => {
                selectedTab.classList.add('active');
            }, 10);
            
            if (button) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            } else {
                const correspondingButton = document.querySelector(`.tab-button[onclick*="${tabName}"]`);
                if (correspondingButton) {
                    correspondingButton.classList.add('active');
                    correspondingButton.setAttribute('aria-selected', 'true');
                }
            }
            
            history.pushState(null, null, `#${tabName}`);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase().replace(/\s+/g, '');
            openTab(tabName === 'aboutme' ? 'about' : tabName, this);
        });
    });

    const hash = window.location.hash.slice(1);
    if (hash && ['about', 'skills'].includes(hash)) {
        openTab(hash);
    }

    window.openTab = function(tabName) {
        openTab(tabName);
    };

    function updateTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    updateTheme(savedDarkMode);

    themeToggle.addEventListener('click', () => {
        const isDarkMode = !document.body.classList.contains('dark-mode');
        updateTheme(isDarkMode);
        
        localStorage.setItem('darkMode', isDarkMode);
    });

    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});