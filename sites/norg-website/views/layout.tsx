import React from "react"
import Footer from "@/ui-base/components/ui/navigation/footer/footer"
import { SiteHeader } from "@/ui-base/components/site-header"
import Script from "next/script"

interface NorgLayoutProps {
  children: React.ReactNode
  className?: string
  data: any
  isMegamenu?: boolean
  megaMenuMenu?: any
}

export function NorgLayout({
  children,
  className,
  data,
  isMegamenu,
  megaMenuMenu,
}: NorgLayoutProps) {

  const GoogleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

  const noScriptString = `
  <noscript>
    <iframe 
      src="https://www.googletagmanager.com/ns.html?id=${GoogleTagManagerId}" 
      height="0" 
      width="0" 
      style="display:none;visibility:hidden">
    </iframe>
  </noscript>
`;

  let structuredData:any = {};

  try {
    // Direct from the CMS but it may contain malformed JSON
    structuredData = JSON.parse(data?.data?.seoItems?.structuredData);
  }catch(e) {
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: noScriptString }} />
      <div className={className}>
        <SiteHeader
          data={data}
          isMegamenu={isMegamenu}
          megaMenuMenu={megaMenuMenu}
        />
      </div>
      <main>{children}</main>
      <div className="w-full">
        
        {data?.data?.footerItems && (
          <Footer
            variant="twoLogoHorizontalLinksPlusCopyright"
            className="bg-primary p-10 text-secondary-content"
            center={false}
            data={data.data.footerItems}
            isLive={true}
            languageSite={data?.data?.languageSite}
          />
        )} 
      </div>
    </>
  )
}
