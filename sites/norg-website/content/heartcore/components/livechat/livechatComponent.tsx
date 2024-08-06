'use client'
import DevButton from "@/ui-base/components/ui/developer/devButton";
import Hero from "@/ui-base/components/ui/hero/Hero";
import { formatHeading } from "@/ui-base/lib/cms/heartcore/filterAndUpdateClass";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import { alignmentClasses } from "@/ui-base/lib/util/utils";
import { getSectionTextColour } from "@/ui-base/lib/util/getSectionTextColour";
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour";

const log = getLogger("ui-base.cms.heartcore.content.livechatComponent");

export default function livechatComponent(data: ComponentDataProps) {
  // log.info("livechatComponent data passed in:", data);
  return (
    <NorgLiveChatComponent componentData={data.componentData} componentMetaData={data.componentMetaData} />
  );
}

const NorgLiveChatComponent = ({ componentData, componentMetaData }: ComponentDataProps) => {
  const [chatLoaded, setChatLoaded] = useState(false);

  const { justifyClass } = alignmentClasses(componentData);

  const handleLaunchChat = () => {
    setChatLoaded(true);
    liveChatResources();
  };

  const liveChatResources = () => {
    console.log('live chat bootup - lazy loading resources');

    const script = document.createElement('script');
    const remoteJs = componentData.src;
    script.src = remoteJs;
    script.async = true;
    script.onload = () => console.log('Live chat script loaded successfully');
    script.onerror = (error) => console.log('Error loading live chat script:', error);
    document.body.appendChild(script);
    console.log('live chat bootup - inserting', remoteJs);
  };

  return (
    <>
      <Suspense>
        <DevButton metaData={componentMetaData} />
      </Suspense>
      <Hero className="relative z-10 max-h-max min-h-[calc(100vh-75px)] overflow-hidden bg-charcoal bg-blend-multiply md:min-h-[calc(100vh-175px)]">
        {componentData?.image?.url && (
          <div className="absolute size-full object-scale-down">
            <Image
              src={componentData.image.url}
              sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw"
              loading="eager"
              alt={
                componentData?.image?.media?.altText !== ""
                  ? componentData?.image?.media?.altText
                  : componentData?.image?.media?.name !== ""
                  ? componentData?.image?.media?.name
                  : componentData?.name
              }
              fill={true}
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={true}
            />
            <div
              style={{ background: "rgba(0,0,0,0.5)" }}
              className="absolute size-full"
            ></div>
          </div>
        )}

        <Hero.Content className={`!container row-start-2 self-start`}>
          <div
            className={`relative z-100 flex size-full items-center ${justifyClass} flex-col`}
          >
            <h1
              className={`w-full font-comfortaa text-strap font-600 leading-strap`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(componentData.heading),
              }}
            />
            <div
              className={`mt-8 w-full font-comfortaa text-body2 font-800 leading-body2`}
              dangerouslySetInnerHTML={{
                __html: formatHeading(componentData.description),
              }}
            />


              <div>
                {!chatLoaded ?
                <button
                  className={`mt-[22px] box-border inline-block w-full rounded-[8px] px-5 py-2.5 text-center text-[12px] font-500 capitalize leading-[18px] text-my-black-33 transition hover:bg-my-black hover:text-my-white md:mt-[46px] md:text-body3 md:leading-nav ${getSectionBackgroundColour(
                    "#5850ec",
                    "bg-my-black"
                  )} ${getSectionTextColour("#FFFFFF", "bg-my-white")}`}
                  onClick={handleLaunchChat}
                >
                  Launch live chat
                </button> :
                  <div
                    style={{
                      fontSize: `16px`,
                      lineHeight: `26px`
                    }}
                    className={`mt-8 w-full font-comfortaa text-h3 font-800 leading-h3 md:text-h1 md:leading-h1`}
                  >Chat loaded! Click on &#34;Chat with us!&#34; at the bottom-right of your screen to begin</div>
                  }
              </div>

          </div>
        </Hero.Content>
      </Hero>
    </>
  );
};

export { NorgLiveChatComponent };
