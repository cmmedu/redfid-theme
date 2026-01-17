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
        var navContainer = document.querySelector('.header-navigation-container-mobile');
        if (window.matchMedia("(min-width: 940px)").matches) {
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

(function() {
    var username = window.username;
    var api_url = window.api_url;
    var static_url = window.static_url;
    var user_icon_url = window.user_icon_url;

    function appendUserIconFallback(parent) {
        if (!parent || !user_icon_url) return;
        var img = document.createElement('img');
        img.setAttribute('class', 'toggle-user-menu');
        img.setAttribute('src', user_icon_url);
        img.setAttribute('alt', '');
        img.setAttribute('width', '16');
        img.setAttribute('height', '16');
        img.setAttribute('style', 'padding-left: 1px;');
        img.setAttribute('aria-hidden', 'true');
        if (parent.style) {
            parent.style.backgroundColor = '#bdbdbd';
            parent.style.width = '40px';
            parent.style.height = '40px';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.borderRadius = '50%';
        }
        parent.appendChild(img);
    }

    function loadUserImages() {
        var userIcons = document.querySelectorAll('.header-usericon');
        
        if (userIcons.length === 0) {
            // Elements not ready yet, try again after a short delay
            setTimeout(loadUserImages, 100);
            return;
        }
    
        // Fetch user image from API
        fetch(api_url + '/user-image/' + username)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            var imageUrl = data.url;
            
            if (!imageUrl || imageUrl === '' || imageUrl === null) {
                // If no URL, show the same as when not logged in, but with #bdbdbd background
                userIcons.forEach(function(icon) {
                    var parent = icon.parentElement;
                    if (parent) {
                        icon.style.display = 'none';
                        appendUserIconFallback(parent);
                    }
                });
            } else {
                // If URL exists, load the image
                var fullImageUrl = static_url + '/api/users' + imageUrl;
                userIcons.forEach(function(icon) {
                    var parent = icon.parentElement;
                    // Ensure parent has proper styling for image display
                    if (parent && parent.style) {
                        parent.style.width = '40px';
                        parent.style.height = '40px';
                        parent.style.borderRadius = '50%';
                        parent.style.overflow = 'hidden';
                        parent.style.display = 'flex';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        // Remove the default background color
                        parent.style.backgroundColor = '';
                    }
                    icon.src = fullImageUrl;
                    icon.style.display = '';
                    icon.style.width = '40px';
                    icon.style.height = '40px';
                    icon.style.objectFit = 'cover';
                    icon.onerror = function() {
                        // Fallback to default icon if image fails to load
                        this.style.display = 'none';
                        appendUserIconFallback(this.parentElement);
                    };
                });
            }
        })
        .catch(function(error) {
            console.error('Error fetching user image:', error);
            // On error, show default icon with #bdbdbd background
            userIcons.forEach(function(icon) {
                icon.style.display = 'none';
                appendUserIconFallback(icon.parentElement);
            });
        });
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadUserImages);
    } else {
        // DOM is already ready
        if (!api_url) {
            console.error('API URL is not set');
            return;
        }
        else if (!static_url) {
            console.error('Static URL is not set');
            return;
        }
        else if (!username) {
            return;
        }
        else {
            loadUserImages();
        }
    }
})();