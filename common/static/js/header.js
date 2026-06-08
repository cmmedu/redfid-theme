function toggleLinksMenu() {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');
    if (!navContainer || !userContainer) return;
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
    if (!navContainer || !userContainer) return;
    if (userContainer.style.display === 'none' || userContainer.style.display === '') {
        navContainer.style.display = 'none';
        userContainer.style.display = 'block';
    } else {
        userContainer.style.display = 'none';
    }
}

window.onclick = function(event) {
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');
    if (!navContainer || !userContainer) return;
    if (navContainer.style.display !== "none") {
        if (!event.target.matches('.header-navigation-container-mobile')) {
            navContainer.style.display = 'none';
        }
    } else {
        if (event.target.matches('.header-trigger')) {
            toggleLinksMenu();
        }
    }
    if (userContainer.style.display !== "none") {
        if (!event.target.matches('.header-user-container-mobile')) {
            userContainer.style.display = 'none';
        }
    } else {
        if (event.target.matches('.toggle-user-menu')) {
            toggleUserMenu();
        }
    }
};

// Replace OpenEdX default profile image with the redfid profile image
(function () {
    if (!window.api_url || !window.static_url) return;

    fetch(window.api_url + '/users/current', {
        credentials: 'include'
    })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (user) {
        if (user && user.profile_image && user.id) {
            var imgUrl = window.static_url + '/users/' + user.id + '/' + user.profile_image;
            document.querySelectorAll('.header-usericon').forEach(function (img) {
                img.src = imgUrl;
            });
        }
    })
    .catch(function () {});
})();

window.onresize = function(event) {
    var screenWidth = window.innerWidth;
    var navContainer = document.querySelector('.header-navigation-container-mobile');
    var userContainer = document.querySelector('.header-user-container-mobile');
    if (!navContainer || !userContainer) return;
    if (screenWidth > 940) {
        navContainer.style.display = 'none';
        userContainer.style.display = 'none';
    }
};
