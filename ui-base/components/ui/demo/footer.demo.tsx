import { Fragment } from "react"

import Footer from "../navigation/footer/footer"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"

const footerLinks = [
  {
    title: "Services",
    links: [
      { url: "#", text: "Branding" },
      { url: "#", text: "Design" },
      { url: "#", text: "Marketing" },
      { url: "#", text: "Advertisement" },
    ],
  },
  {
    title: "Company",
    links: [
      { url: "#", text: "About us" },
      { url: "#", text: "Contact" },
      { url: "#", text: "Jobs" },
      { url: "#", text: "Press kit" },
    ],
  },
  {
    title: "Legal",
    links: [
      { url: "#", text: "Terms of use" },
      { url: "#", text: "Privacy policy" },
      { url: "#", text: "Cookie policy" },
    ],
  },
]

const dataWithLogo = [
  {
    title: "",
    links: [
      {
        child: (
          <>
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current"
            >
              <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
            </p>
          </>
        ),
      },
    ],
  },
  ...footerLinks,
]

const twoLogoData = {
  "url": "/global-components/us/us-footer/",
  "contentTypeAlias": "footer",
  "name": "US Footer",
  "leftLogo": {
      "url": "https://media.umbraco.io/norg-website/30xlejfe/logo_clear_ata.png"
  },
  "rightLogo": {
      "url": "https://media.umbraco.io/norg-website/zw2c32zt/dulux_logo.png"
  },
  "copyrightNotice": "© Company 2006-2023 Automatic Technology Pty Ltd, ABN 11 007 125 368. All rights reserved.",
  "linkSections": [
      {
          "content": {
              "__typename": "MultipleLinkComponentCOMP",
              "contentTypeAlias": "multipleLinkComponentCOMP",
              "heading": "OUR RANGE",
              "uRLs": [
                  {
                      "name": "Door Openers",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/019d0a0e24fb4b3a973c55932bf73917",
                      "url": "/us-homepage/door-openers/"
                  },
                  {
                      "name": "Remotes & Accessories",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/caa2f24bc39540f29104781f8acbc525",
                      "url": "/us-homepage/remotes-accessories/"
                  },
                  {
                      "name": "Gate Openers",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/073e0f5924394469b07355fbceb18633",
                      "url": "/us-homepage/gate-openers/"
                  },
                  {
                      "name": "About Us",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/0e625277159443408504fdc05ce1e5a1",
                      "url": "/us-homepage/contact/about-us/"
                  }
              ]
          }
      },
      {
          "content": {
              "__typename": "MultipleLinkComponentCOMP",
              "contentTypeAlias": "multipleLinkComponentCOMP",
              "heading": "OUR NETWORK",
              "uRLs": [
                  {
                      "name": "Contact",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/22273ad79fb943bfb04a3600346f10e2",
                      "url": "/us-homepage/contact/"
                  },
                  {
                      "name": "Australia",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/e58b4d2ec1494d5092107132b75e7939",
                      "url": "/au-homepage/"
                  }
              ]
          }
      },
      {
          "content": {
              "__typename": "MultipleLinkComponentCOMP",
              "contentTypeAlias": "multipleLinkComponentCOMP",
              "heading": "SUPPORT",
              "uRLs": [
                  {
                      "name": "Safety & Access System",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/a7a6896d1b1543b2942222b152f210c1",
                      "url": "/us-homepage/remotes-accessories/safety-access-system/"
                  },
                  {
                      "name": "Warranty Registration",
                      "target": null,
                      "type": "CONTENT",
                      "udi": "umb://document/1d26393e703b4bcf913f911525b7e63f",
                      "url": "/us-homepage/resources/warranty-registration/"
                  }
              ]
          }
      }
  ]
}

const FooterDemoData = [
  {
    heading: "Footer : Default",
    className: "bg-neutral p-10 text-neutral-content",
    data: footerLinks,
    center: false,
    variant: "default",
  },
  {
    heading: "Footer : Centered",
    className: "bg-neutral p-10 text-neutral-content",
    data: footerLinks,
    center: true,
    variant: "centered",
  },
  {
    heading: "Footer : With Logo",
    className: "bg-neutral p-10 text-neutral-content",
    data: dataWithLogo,
    variant: "singlelogo",
  },
  {
    heading: "Footer : Light Background",
    className: "bg-primary p-10 text-secondary-content",
    data: dataWithLogo,
    variant: "lightbackground",
  },
  {
    heading: "Footer : Two Logo - Horizontal Links - Copyright",
    className: "bg-primary p-10 text-secondary-content",
    data: twoLogoData,
    variant: "twoLogoHorizontalLinksPlusCopyright",
  }
]

export function FooterDemo() {
  return (
    <>
      {FooterDemoData.map((item, index) => (
        <Fragment key={index}>
          <h1 className="my-4 text-2xl font-bold ">{item.heading}</h1>
          <Footer
            variant={item.variant}
            className={item.className}
            center={item.center}
            data={item.data}
            isLive={false}
            languageSite={({} as LanguageSite)}
          />
        </Fragment>
      ))}
    </>
  )
}
