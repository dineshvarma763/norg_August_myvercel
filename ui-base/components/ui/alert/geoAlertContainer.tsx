'use client';
import { Suspense } from 'react';
import GeoAlertLoader from './geoAlertLoader';

const GeoAlertPopup = () => {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <GeoAlertLoader />
      </Suspense>
    </>
  );
};

export default GeoAlertPopup;
