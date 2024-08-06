"use client"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { usePathname } from "next/navigation"
import { cn } from "../../../lib/util/utils"

function setGeoRedirectedCookie() {
    setCookie('geoRedirected', 'true', 1209600); // set for 2 weeks
}

// Reusable function to set cookie
function setCookie(name, value, maxAge) {
    document.cookie = name + "=" + value + ";max-age=" + maxAge;
}

export const GeoAlert = () => {
    const router = useRouter()

    const pathname = usePathname();
    const isAustralia = pathname.startsWith("/au");
    const auBtnClass = "w-2/6";
    const usBtnClass = "w-7/12";

    const closePopup = () => {
      setGeoRedirectedCookie();

      // In this case we avoid React state as the initial code for display is handled in
      // vanilla JS within the layout and is lazy loaded. 
      document.getElementById("geo-popup").style.display = "none";
    }

    return (
      <div id="geo-popup" style={{ display: 'none' }} className="fixed sm:bottom-4 bottom-20 sm:w-full w-95-per sm:right-14 sm:left-auto left-1/2 sm:mb-0 mb-1 sm:translate-x-px -translate-x-2/4 z-100 md:hidden sm:max-w-xs max-w-full shadow-md">
        <div className="bg-white p-4 w-full mx-auto relative z-10 max-h-500">
          <button
        onClick={closePopup}
            className="absolute top-4 right-4 text-white hover:text-my-dark-blue w-5 h-5 text-lg leading-5 font-semibold rounded-full bg-my-yellow"
          >
            &times;
          </button>
            {isAustralia ? (
            <p id="geo-popup-us" className="text-base mb-6 pr-12">We think you are in the USA. Update your location?</p>
          ) : (
            <p id="geo-popup-au" className="text-base mb-6 pr-12">We think you are in Australia. Update your location?</p>
            )}

	    <button
	className={cn("mr-7-per border-2 border-solid text-my-dark-blue hover:text-white py-1.5 px-2 rounded-3xl text-base font-bold tracking-widest transition text-center bg-white hover:bg-my-dark-blue border-my-dark-blue",  isAustralia ? usBtnClass : auBtnClass)}
	onClick={() => {
	    closePopup();
	    isAustralia ? router.push("/au") : router.push("/");
	}}
	    >
	    {isAustralia ?  "Australia" : "USA"}
	</button>

	    <button
	className={cn("border-2 border-solid text-my-dark-blue hover:text-white py-1.5 px-2 rounded-3xl text-base font-bold tracking-widest transition text-center bg-my-yellow hover:bg-my-dark-blue border-my-yellow hover:border-my-dark-blue", isAustralia ? auBtnClass : usBtnClass)}
	onClick={() => {
	    closePopup();
	    isAustralia ? router.push("/") : router.push("/au");
	}}
	    >
	    {isAustralia ?  "USA" : "Australia"}
	</button>
        </div>
        <div
          className="fixed inset-0 z-0"
          onClick={closePopup}
        ></div>
      </div>
    );
};

export default GeoAlert;
