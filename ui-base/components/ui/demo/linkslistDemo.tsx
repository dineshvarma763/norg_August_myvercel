import { twMerge } from "tailwind-merge"

import LinksList from "../links/LinksList"
import dynamic from "next/dynamic";
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";

export default function LinksListDemo({ demoData }) {
  const SimpleAnchorLists = dynamic(() => import('@/ui-base/components/ui/links/simpleAnchorListsClientLoader'));
  return (
    <>
      <h1 className="my-4 text-2xl font-bold"> Variant : ButtonLinksList</h1>
      <div className="max-w-screen-sm overflow-x-auto py-4">
        <LinksList
          className="p-6"
          heading="In the meantime,  why not take a look at some our resources below."
          headingClassName="font-urbanist text-h4 font-800 leading-h4 text-black"
        >
          <LinksList.ButtonLinksList
            links={demoData}
            className="p-2 md:p-4"
            linkClassName="text-button leading-button bg-my-yellow text-center font-urbanist font-800 uppercase tracking-0.1em text-my-blue"
            useNextLink
            languageSite={({  } as LanguageSite)}
          />
        </LinksList>
      </div>
      <h1 className=" my-4 text-2xl font-bold"> Variant : DownloadLinks</h1>
      <div className="max-w-md overflow-x-auto py-4 ">
        <LinksList
          heading="Warranty Certificates:"
          headingClassName="mb-2 text-h4 font-bold capitalize text-my-blue"
          className="bg-black20 p-4"
        >
          <LinksList.DownloadLinks
            links={demoData}
            className=""
            linkClassName="text-button leading-button text-center font-urbanist font-500 uppercase text-my-blue underline"
            useNextLink
            languageSite={({  } as LanguageSite)}
          />
        </LinksList>
      </div>
      <h1 className="my-4 text-2xl font-bold"> Variant : SimpleAnchorLists</h1>
      <LinksList
        heading="On this page:"
        className="max-w-screen-md py-4 capitalize text-my-blue"
        headingClassName={
          "mb-2 text-body1 font-800 capitalize leading-body1 text-my-blue"
        }
      >
        <SimpleAnchorLists
          links={demoData}
          className="gap-1"
          linkClassName=""
          useNextLink
          languageSite={({  } as LanguageSite)}
        />
      </LinksList>
    </>
  )
}
