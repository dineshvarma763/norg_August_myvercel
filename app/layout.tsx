// New: App Router ✨
// app/layout.js
//

import { AlertContainer } from "@/context/AlertContainer"

import "@/ui-base/styles/globals.css"
import { Comfortaa, Inter, Urbanist } from "next/font/google"

import ThemeProvider from "./ThemeProvider"
import { CookiesProvider } from 'next-client-cookies/server';


// export const fetchCache = "force-no-store"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const fontUrbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
})

const fontComfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_CMS_MAIN_DOMAIN),
}

// The root layout is shared for the entire application
export default function RootLayout({ children }) {
  const GoogleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID // This is your variable for Google Tag Manager ID

  return (
    <html lang="en">
      <head>
        {/* <link
          rel="preload"
          as="image"
          href="/_next/image?url=https%3A%2F%2Fmedia.umbraco.io%2Fdev-ata-automation%2Fn3dnfvwm%2Fjpd1714_rawson_chifley_hero_413.jpg&w=640&q=75"
          type="image/webp"
        /> */}

        {/* The script below is stored in data-backup/tools/scipts/layout-insert.js  -- Minify and insert the startup script below
          1) Script 1 - Lazy load the Google Tag Manager script for new users. Loads after 7.5 seconds on first visit only, otherwise instant on load.
          2) Script 2 - Geo location popup script.
                        The US site is here: https://www.automatictechnology.com/
                        The AU Site is here: https://www.automatictechnology.com/au
                        Requirement a) Loads after 7.5 seconds on first visit only, otherwise instant on load.
                        Requirement b) Asks the user to share the location information with the site.
                        Requirement c) If they do and the site they are in (US or AU) does not match the location information then show the geo pop-up
                        that is identified by html attribute id of "geo-popup".
                        Requirement d) If the user does not share the location information then do not show the geo pop-up.
                        Requirement e) One the user is redirected to another geo-graphic site, a cookie is set and they will not see the geo popup for 2 weeks.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
                    document.cookie = name + "=" + value + ";max-age=" + maxAge;
                  }

                  // Function to determine whether or not to show geo-popup
                  function geoLocationCheck(delay) {

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
                                  if(delay > 0){
                                    document.getElementById("geo-popup").style.display = "block";
                                  }else {
                                    setTimeout(function() {
                                      document.getElementById("geo-popup").style.display = "block";
                                    }, 7500);
                                  }
                              }
                          }, function(error) {
                              console.log('Geolocation error',error);
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
                      //geoLocationCheck(delay);

                  }, delay);
              });


                `,
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/norg-website/favicon_norg/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/norg-website/favicon_norg/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/norg-website/favicon_norg/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/norg-website/favicon_norg/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/norg-website/favicon_norg/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/norg-website/favicon_norg/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/norg-website/favicon_norg/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/norg-website/favicon_norg/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/norg-website/favicon_norg/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="36x36"
          href="/norg-website/favicon_norg/android-icon-36x36.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/norg-website/favicon_norg/android-icon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/norg-website/favicon_norg/android-icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/norg-website/favicon_norg/android-icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/norg-website/favicon_norg/android-icon-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/norg-website/favicon_norg/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/norg-website/favicon_norg/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/norg-website/favicon_norg/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/norg-website/favicon_norg/favicon-96x96.png"
        />
        <link rel="manifest" href="/norg-website/favicon_norg/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/norg-website/favicon_norg/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body
        className={`min-h-screen !overflow-x-hidden font-inter antialiased ${inter.variable} ${fontUrbanist.variable} ${fontComfortaa.variable}`}
      >
         <CookiesProvider>
          <ThemeProvider>
            <AlertContainer>{children}</AlertContainer>
            <div id="portal-root"></div>
          </ThemeProvider>
        </CookiesProvider>    
      </body>
    </html>
  )
}
