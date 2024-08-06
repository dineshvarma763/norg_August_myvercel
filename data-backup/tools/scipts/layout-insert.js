// Here's what the code does:

// It adds an event listener to the document that waits for the content to be fully loaded.
// Once the content is loaded, it checks for a cookie named 'firstVisit'.
// If the cookie does not exist, it sets the cookie and specifies a delay.
// After the delay (or immediately if there was no delay), it loads the Google Tag Manager script 
// with a specified ID (${GoogleTagManagerId} would likely be replaced with an actual ID in a real implementation).

document.addEventListener("DOMContentLoaded", function() {

    // Reusable function to get cookie value
    function getCookieValue(cookieName) {
        var allCookies = "; " + document.cookie;
        var parts = allCookies.split("; " + cookieName + "=");
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }

    // Reusable function to set cookie
    function setCookie(name, value, maxAge) {
        document.cookie = `${name}=${value};max-age=${maxAge}`;
    }

    // Function to determine whether or not to show geo-popup
    function geoLocationCheck() {
        if (!getCookieValue('geoRedirected')) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let userLat = position.coords.latitude;

                // Check based on latitude if the user is closer to US or AU.
                // Northern Hemisphere latitudes are positive. Southern Hemisphere latitudes are negative.
                // This is a simple way to determine the user's approximate location. 
                // More accurate results can be achieved by using an external API service.
                let closestSite = userLat > 0 ? 'US' : 'AU';

                let currentSite = window.location.href.includes("/au") ? 'AU' : 'US';

                if (closestSite !== currentSite) {
                    document.getElementById("geo-popup").style.display = "block";
                }
            }, function() {
                // This is the callback function for geolocation errors, e.g., if the user denies permission. We won't show the popup.
            });
        }
    }

    function setGeoRedirectedCookie() {
        setCookie('geoRedirected', 'true', 1209600); // set for 2 weeks
    }

    var delay = 0;
    if (!getCookieValue("firstVisit")) {
        setCookie("firstVisit", "true", 31536000); // set for 1 year
        delay = 7500;
    }

    setTimeout(function() {

        // Google Tag Manager Script
        (function(a, b, c, g, h) {
            a[g] = a[g] || [];
            a[g].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var firstScript = b.getElementsByTagName(c)[0],
                newScript = b.createElement(c),
                urlAppend = g != "dataLayer" ? "&l=" + g : "";

            newScript.async = true;
            newScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + h + urlAppend;
            firstScript.parentNode.insertBefore(newScript, firstScript);

        })(window, document, 'script', 'dataLayer', '${GoogleTagManagerId}');

        // Geo-location Check
        geoLocationCheck();

    }, delay);
});
