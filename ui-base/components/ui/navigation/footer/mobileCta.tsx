// components/MobileCTA.tsx

import { LanguageSite } from '@/ui-base/lib/interfaces/LanguageSite';
import Link from 'next/link';
import React from 'react';
import GeoAlertPopup from '../../alert/geoAlertContainer';

export interface StickyFooterProps {
  button: any
  phoneNumber?: string,
  languageSite: LanguageSite
}

const MobileCTA = (props:StickyFooterProps) => {
  return (
  <>
    <GeoAlertPopup />
    <div className="w-full h-18 fixed bottom-0 left-0 right-0 z-50 py-4 px-8 md:hidden shadow-md bg-my-yellow">
      <ul className="mobile_cta flex items-center justify-between space-x-4">
        {/* Add your CTA list items here */}
        <li>
          <a href={`tel:${props.phoneNumber}`} className="text-blue-500 text-my-white flex items-center">
            <span className="mr-1.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.1251 11.5152C15.2285 12.1283 16.3324 12.7415 17.4356 13.3547C17.9105 13.6184 18.1188 14.1779 17.9319 14.6881C16.9826 17.2814 14.2026 18.6502 11.5867 17.6955C6.23024 15.7404 2.25984 11.7698 0.304534 6.41333C-0.650234 3.79749 0.718642 1.01734 3.31188 0.0681332C3.82216 -0.118828 4.38165 0.0894787 4.64597 0.56437C5.25847 1.66767 5.87171 2.77162 6.48482 3.87486C6.77223 4.39244 6.70468 5.00681 6.3113 5.44879C5.79613 6.0285 5.28106 6.60809 4.76589 7.18719C5.86556 9.86506 8.13488 12.1344 10.8128 13.2341C11.3919 12.7189 11.9715 12.2038 12.5512 11.6887C12.9938 11.2953 13.6077 11.2277 14.1251 11.5152L14.1251 11.5152Z" fill="white"/>
              </svg>
            </span>
            {props.phoneNumber}
          </a>
        </li>
        {props.button && (
          <li
            className={
              "leading-nav mr-4 inline-block font-urbanist text-nav font-semibold uppercase tracking-0.1em text-my-white bg-my-blue rounded-full px-6 py-3"
            }
          >
            <Link href={props?.button?.url} className="hover:font-800">{props.button.name}</Link>
          </li>
        )}
      </ul>
    </div>
    </>
  );
};

export default MobileCTA;
