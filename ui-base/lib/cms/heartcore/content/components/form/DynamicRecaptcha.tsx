'use client'
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

const Recaptcha = dynamic(() => import("./ReCaptcha"), {
    ssr: false, // Render the component only on the client-side
})

const DynamicRecaptcha = ({ formSpec, formik }) => {
  const recaptchaRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleIntersection = (entries) => {
    const [entry] = entries;

    if (entry.isIntersecting && !scriptLoaded) {
      const script = document.createElement("script");
      script.src = "/norg-website/forms/loader.js";
      console.log("backup loader.js injector");
      script.async = true;
      document.body.appendChild(script);
      setScriptLoaded(true);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    if (recaptchaRef.current) {
      observer.observe(recaptchaRef.current);
    }

    return () => {
      if (recaptchaRef.current) {
        observer.unobserve(recaptchaRef.current);
      }
    }
  }, []);

  return (
    <div ref={recaptchaRef}>
      {generateRecaptch(formSpec, formik)}
    </div>
  )
}

export default DynamicRecaptcha;

export function generateRecaptch(formSpec: any, formik) {
    return <Recaptcha
      recaptcha={formSpec.recaptcha}
      error={formik.errors["captcha"] as string}
      clearError={() => formik.setFieldError("captcha", "")} />;
}
