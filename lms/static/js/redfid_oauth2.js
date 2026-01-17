(function () {
    // Helper function to get cookie by name
    function getCookie(name) {
        if (!document.cookie) {
            return null;
        }
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                var value = c.substring(nameEQ.length, c.length);
                try {
                    return decodeURIComponent(value);
                } catch (e) {
                    return value;
                }
            }
        }
        return null;
    }

    // Helper function to delete cookie by name and domain
    function deleteCookie(name, domain) {
        // Delete for the specific domain
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + domain;
        // Also try without domain (for current domain)
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }

    var currentPath = window.location.pathname;
    var accessTokenCookie = getCookie('access_token');

    // SSO CASE 1: edX logout -> UI logout
    // Intercept logout link clicks and call the logout API endpoint
    // This works even if /logout doesn't render HTML (e.g., redirects immediately)
    (function () {
        function interceptLogoutClick(event) {
            var target = event.target;
            // Find the closest anchor tag if the click was on a child element
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            if (target && target.href && (target.href.indexOf('/logout') !== -1 || target.getAttribute('href') === '/logout')) {
                event.preventDefault();
                event.stopPropagation();

                // Prepare headers
                var headers = {
                    'Content-Type': 'application/json'
                };

                // If we have the access token from cookie, send it as Bearer token
                // (Note: If cookie is HttpOnly, this will be null, but cookie will still be sent)
                var token = getCookie('access_token');
                if (token) {
                    headers['Authorization'] = 'Bearer ' + token;
                }

                // Call the logout API endpoint
                // The cookie will be sent automatically if accessible
                fetch(window.api_url + '/logout', {
                    method: 'POST',
                    credentials: 'include', // Include cookies in the request
                    headers: headers
                })
                    .then(response => {
                        // If API call succeeds, also try to delete the cookie locally as fallback
                        deleteCookie('access_token', window.cookie_domain);
                        // Navigate to logout after API call completes
                        window.location.href = '/logout';
                    })
                    .catch(error => {
                        console.error('Error calling logout API:', error);
                        // On error, still try to delete the cookie locally as fallback
                        deleteCookie('access_token', window.cookie_domain);
                        // Navigate to logout even if API call fails
                        window.location.href = '/logout';
                    });

                return false;
            }
        }

        // Use event delegation to catch clicks on logout links
        if (document.addEventListener) {
            document.addEventListener('click', interceptLogoutClick, true);
        } else if (document.attachEvent) {
            document.attachEvent('onclick', interceptLogoutClick);
        }
    })();

    // SSO CASE 2: edX login -> UI login
    // Handled by API

    // SSO CASE 3: UI login -> edX login
    // If we are not authenticated, and cookie access_token from .redfid.cl exists, redirect
    // Exclude /logout from this check to avoid redirect loop
    if (!window.isAuthenticated && (currentPath === '/dashboard' || currentPath === "/")) {
        if (accessTokenCookie && window.redfidLoginEnabled && window.api_url) {
            var currentPathEncoded = window.currentPathEncoded;
            var redfidLoginUrl = "/auth/login/redfid/?auth_entry=login&next=" + currentPathEncoded;
            window.location.href = redfidLoginUrl;
        }
    }

    // SSO CASE 4: UI logout -> edX logout
    // TODO
})();