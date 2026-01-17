function toggleLinksMenu() {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');

    if (navContainer.style.display === 'none' || navContainer.style.display === '') {
        userContainer.style.display = 'none';
        navContainer.style.display = 'block';
    } else {
        navContainer.style.display = 'none';
    }
}

function toggleUserMenu() {
    var userContainer = document.querySelector('.header-user-container-mobile');
    var navContainer = document.querySelector('.header-navigation-container-mobile');

    if (!userContainer) {
        return;
    }

    var currentDisplay = window.getComputedStyle(userContainer).display;
    if (currentDisplay === 'none' || userContainer.style.display === 'none' || userContainer.style.display === '') {
        if (navContainer) {
            navContainer.style.display = 'none';
        }
        userContainer.style.display = 'block';
    } else {
        userContainer.style.display = 'none';
    }
}

// Use addEventListener to avoid overriding other click handlers (like OAuth completion)
(function() {
    function handleClick(event) {
        var navContainer = document.querySelector('.header-navigation-container-mobile');
        var userContainer = document.querySelector('.header-user-container-mobile');
        var target = event.target;
        
        // Check if clicked element or its parent has the toggle-user-menu class
        var toggleUserMenuElement = target.closest ? target.closest('.toggle-user-menu') : null;
        if (!toggleUserMenuElement) {
            // Fallback for older browsers
            var parent = target.parentElement;
            while (parent) {
                if (parent.classList && parent.classList.contains('toggle-user-menu')) {
                    toggleUserMenuElement = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        
        // Check if clicked element or its parent has the header-trigger class
        var headerTriggerElement = target.closest ? target.closest('.header-trigger') : null;
        if (!headerTriggerElement && target.classList && target.classList.contains('header-trigger')) {
            headerTriggerElement = target;
        }
        
        // Check if clicked element or its parent is inside header-user-container-mobile
        var userContainerElement = target.closest ? target.closest('.header-user-container-mobile') : null;
        if (!userContainerElement) {
            var parent = target.parentElement;
            while (parent) {
                if (parent.classList && parent.classList.contains('header-user-container-mobile')) {
                    userContainerElement = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        
        // Check if clicked element or its parent is inside header-navigation-container-mobile
        var navContainerElement = target.closest ? target.closest('.header-navigation-container-mobile') : null;
        if (!navContainerElement) {
            var parent = target.parentElement;
            while (parent) {
                if (parent.classList && parent.classList.contains('header-navigation-container-mobile')) {
                    navContainerElement = parent;
                    break;
                }
                parent = parent.parentElement;
            }
        }
        
        // Handle navigation container
        if (navContainer && navContainer.style.display !== "none") {
            if (!navContainerElement) {
                navContainer.style.display = 'none';
            }
        } else {
            if (headerTriggerElement) {
                event.preventDefault();
                event.stopPropagation();
                toggleLinksMenu();
                return false;
            }
        }
        
        // Handle user container
        if (userContainer && userContainer.style.display !== "none") {
            if (!userContainerElement) {
                userContainer.style.display = 'none';
            }
        } else {
            if (toggleUserMenuElement) {
                event.preventDefault();
                event.stopPropagation();
                toggleUserMenu();
                return false;
            }
        }
    }
    
    if (window.addEventListener) {
        window.addEventListener('click', handleClick, false);
    } else if (window.attachEvent) {
        window.attachEvent('onclick', handleClick);
    } else {
        var oldOnClick = window.onclick;
        window.onclick = function(event) {
            if (oldOnClick) oldOnClick(event);
            handleClick(event);
        };
    }
})();

// Use addEventListener to avoid overriding other resize handlers
(function() {
    function handleResize(event) {
        var screenWidth = window.innerWidth;
        var navContainer = document.querySelector('.header-navigation-container-mobile');
        if (screenWidth > 940) {
            navContainer.style.display = 'none';
            document.querySelector('.header-navigation-container-mobile').style.display = 'none';
            document.querySelector('.header-user-container-mobile').style.display = 'none';
        }
    }
    
    if (window.addEventListener) {
        window.addEventListener('resize', handleResize, false);
    } else if (window.attachEvent) {
        window.attachEvent('onresize', handleResize);
    } else {
        var oldOnResize = window.onresize;
        window.onresize = function(event) {
            if (oldOnResize) oldOnResize(event);
            handleResize(event);
        };
    }
})();