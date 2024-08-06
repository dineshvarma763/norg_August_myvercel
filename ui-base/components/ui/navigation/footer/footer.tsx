import React, { Fragment, Key, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"

import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { processURLForNavigation } from "@/ui-base/lib/services/urlService"
import { checkPrefetchAvailability } from "@/ui-base/lib/util/prefetch"
import { cn } from "@/ui-base/lib/util/utils"
import DevButton from "../../developer/devButton"

interface LinkItem {
  url?: string
  child?: JSX.Element
  text?: string
}

export type FooterProps = React.HTMLAttributes<HTMLDivElement> & {
  center?: boolean
  data?: any
  variant?: string
  isLive: boolean
  languageSite: LanguageSite
}

function renderLink(link: LinkItem, index: number) {
  if (link.child) {
    return <Fragment key={index}>{link.child}</Fragment>
  } else {
    return (
      <a key={index} className={cn({ ["link-hover link"]: link.url })}>
        {link.text}
      </a>
    )
  }
}

export type FooterTitleProps = React.HTMLAttributes<HTMLSpanElement>

export const FooterTitle = React.forwardRef<HTMLSpanElement, FooterTitleProps>(
  ({ className, ...props }, ref) => {
    const classes = cn("footer-title", className)

    return <span {...props} className={classes} ref={ref} />
  }
)

const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  (
    { data, variant, isLive, center, className, languageSite, ...props },
    ref
  ) => {
    const classes = cn("footer", className, {
      "footer-center": center,
    })

    if (data && variant === "twoLogoHorizontalLinksPlusCopyright") {
      return getTwoLogoFooter(props, ref, data, isLive, languageSite)
    } else if (data?.length) {
      return getStandardFooter(props, classes, ref, data)
    }

    return <div role="contentinfo" {...props} className={classes} ref={ref} />
  }
)

Footer.displayName = "Footer"
FooterTitle.displayName = "FooterTitle"

export default Object.assign(Footer, { Title: FooterTitle })

function getStandardFooter(
  props,
  classes,
  ref,
  data
): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
  return (
    <>
      <div role="contentinfo" {...props} className={classes} ref={ref}>
        {data.map((item, index: Key) => (
          <div key={index}>
            <FooterTitle>{item.title}</FooterTitle>
            {item.links.map(renderLink)}
          </div>
        ))}
      </div>
    </>
  )
}

function getTwoLogoFooter(
  props,
  ref,
  data,
  isLive,
  languageSite
): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
  const { leftLogo, rightLogo, bDLogo, copyrightNotice, linkSections } = data

  let metaData = {
    name: "Footer",
    variant: "Two Logo - Horizontal Links - Plus Copyright",
    query: "Look in >> @/ui-base/lib/cms/heartcore/graphql/footer/footer.ts",
    dataProvided: data,
    component: "Footer",
    queryFileLocation: "@/ui-base/lib/cms/heartcore/graphql/footer/footer.ts",

    rendering: "@/ui-base/components/ui/navigation/footer/footer.tsx",
    id: "NA",
    url: data.url,
    pathBeingUsed: "@/ui-base/components/ui/navigation/footer/footer.tsx",
    typeName: data.__typename,
    liveDocumentation: "",
    youtubeVideo: "",
    lastUpdated: "",
    devDocumentation: "",
    renderingExportFunction: "footerComponent",
    isInsideGrid: false,
    isClientSide: false,
  }

  return (
    <div role="contentinfo" {...props} ref={ref}>
      <Suspense>
        <DevButton metaData={metaData} />
      </Suspense>

      <div className="relative z-[2] w-full rounded-t-[30px] bg-my-white3 px-[50px] pb-[30px] pt-[45px] text-sm text-charcoal md:pb-[70px] md:pt-[50px]">
        <div className="flex flex-col items-center justify-center sm:flex-row lg:justify-between">
          <Link href={processURLForNavigation("/", props?.languageSite)}>
            <Image
              src={leftLogo?.url}
              alt={
                leftLogo?.media?.altText != ""
                  ? leftLogo?.media?.altText
                  : leftLogo?.media?.name != ""
                  ? leftLogo?.media?.name
                  : "Left Logo"
              }
              width={157}
              height={44}
              loading="lazy"
              className="max-w-[157px] flex-1 object-contain"
            />
          </Link>

          {rightLogo?.url ? (
            <Image
              className="object-contain md:ml-auto"
              src={rightLogo?.url}
              alt={
                rightLogo?.media?.altText != ""
                  ? rightLogo?.media?.altText
                  : rightLogo?.media?.name != ""
                  ? rightLogo?.media?.name
                  : "Right Logo"
              }
              width={202}
              height={33}
            />
          ) : null}

          {bDLogo?.url ? (
            <Image
              className="object-contain"
              src={bDLogo?.url}
              alt={
                bDLogo?.media?.altText != ""
                  ? bDLogo?.media?.altText
                  : bDLogo?.media?.name != ""
                  ? bDLogo?.media?.name
                  : "BND Logo"
              }
              width={202}
              height={33}
            />
          ) : null}

          <ul className="hidden lg:flex lg:whitespace-nowrap">
            {linkSections?.map((section, sectionIndex) => (
              <Fragment>
                {section?.content?.links?.map((link, linkIndex) => {
                  const prefetch = checkPrefetchAvailability(link?.url)
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={link.url}
                        target={link.target}
                        data-attr-prefetch={prefetch}
                        prefetch={prefetch}
                        className={cn(
                          "block px-5 py-[10.5px] text-nav font-400 capitalize leading-[20px] text-my-btntext hover:font-400",
                          {
                            "ml-[39px] px-5 py-2.5 leading-[21px] bg-my-indigo hover:bg-my-black text-nav text-my-white font-500 hover:font-500 rounded-lg":
                            section?.content?.showAsButton,
                          }
                        )}
                      >
                        {section?.content?.heading}
                      </Link>
                    </li>
                  )
                })}
              </Fragment>
            ))}
          </ul>
        </div>
        <div className="container">{copyrightNotice}</div>
      </div>
    </div>
  )
}
