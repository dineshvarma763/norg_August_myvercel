"use client";

import { useEffect } from "react";
import Meteors from "@/ui-base/components/ui/loaders/meteor";
import { GetComponentsByTypeName } from "@/ui-base/lib/services/contentRendererServiceTSX";
import { ComponentDataProps } from "@/ui-base/lib/services/data/componentMetaDataService";
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig";
import { getSectionBackgroundColour } from "@/ui-base/lib/util/getSectionBackgroundColour";

const log = getLogger("ui-base.cms.heartcore.content.norgassistantchatComponent");

export default function norgassistantchatComponent(data: ComponentDataProps) {

  return (
    <><NorgAssistantChatComponent componentData={data.componentData} componentMetaData={data.componentMetaData}/></>
  );
}

const NorgChatSpecialRender = ({data}) => {
  const subComponentsChat = GetComponentsByTypeName(data, 'NorgAssistantChat');
  let compoentsRendered = (<></>);
  let firstChat = (<></>);
  if(subComponentsChat && subComponentsChat.length > 0){
    compoentsRendered = subComponentsChat.map((element, index) => {
      let sortOrder = element.sortOrder ? element.sortOrder : 0;
      const id = element.__typename.toLowerCase() + "-" + sortOrder;
      const subComponentRelatedData = data?.data?.pageComponentData[id] as ComponentDataProps;
      if (subComponentRelatedData == undefined || subComponentRelatedData == null){
        return (<></>);        
      } else {
        firstChat = <NorgAssistantChatComponent key={index} id={id} componentData={subComponentRelatedData.componentData} componentMetaData={subComponentRelatedData.componentData} />;
        return firstChat;
      }
    });
  } 
  return (
    <>
      {compoentsRendered}
    </>
  );
}

const NorgAssistantChatComponent = (data?: ComponentDataProps) => {
  log.trace("NorgAssistantChatComponent data passed in:", JSON.stringify(data?.componentData));

  const htmlEncode = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  let variation_style = data?.componentData?.variation_style;
  let primary_color = data?.componentData?.primary_color;
  let secondary_color = data?.componentData?.secondary_color;
  let chatbot_position = data?.componentData?.chatbot_position;
  let chatbot_mode = data?.componentData?.chatbot_mode;
  let visible_on_page = data?.componentData?.visible_on_page;
  let chatbot_element_ids = data?.componentData?.chatbot_element_ids;
  let chatbot_location = data?.componentData?.chatbot_location;
  let text = data?.componentData?.text;
  let user_label = data?.componentData?.user_label;
  let assistant_label = data?.componentData?.assistant_label;
  let client_match = data?.componentData?.client_match;
  let family = data?.componentData?.family;
  let src = data?.componentData?.src;
  let height = data?.componentData?.height || "100%";
  let width = data?.componentData?.width || "100%";

  let meteorClass = 'invisible h-0';
  if(chatbot_position == 'blocks')
  {
    meteorClass = '';
  }

  let default_template_questions = [];

  if (data?.componentData?.question_1 && data?.componentData?.question_1.length > 0) {
    default_template_questions.push(htmlEncode(data?.componentData?.question_1));  
  }
  if (data?.componentData?.question_2 && data?.componentData?.question_2.length > 0) {
    default_template_questions.push(htmlEncode(data?.componentData?.question_2));  
  }
  if (data?.componentData?.question_3 && data?.componentData?.question_3.length > 0) {
    default_template_questions.push(htmlEncode(data?.componentData?.question_3));  
  }

  const scriptContent = `
    window.norgai = window.norgai || {};
    window.norgai = {
      chatboost: {
        environment: "${data?.componentData?.environment || "prod"}",
        secret_key: 'domain-token',
        jwt_endpoint: 'domain-token',
        client_match: "${client_match || "883fc75a-af7f-45e0-be78-8d70f52f7362"}",
        mode: '${data?.componentData?.mode || "chat"}',
        introduction: {
          text: "${text || "Hi, I'm here to help you. How can I assist you today?"}",
          user_label: "${user_label || "You"}",
          assistant_label: "${assistant_label || "Assistant"}",
          default_template_questions: ${JSON.stringify(default_template_questions)},
          assistant_avatar_url: "${data?.componentData?.assistant_avatar_url?.url || ""}",
          user_avatar_url: "${data?.componentData?.user_avatar_url?.url || ""}",
        },
        images: {
          imageEndpoint: "${data?.componentData?.imageEndpoint || ""}"
        },
        layout: {
          chatbot_element_ids: "${chatbot_element_ids || ""}",
          chatbot_location: "${chatbot_location || "bottom-right"}",
          chatbot_mode: '${chatbot_mode || "light"}',
          chatbot_position: "${chatbot_position || "popup"}",
          primary_color:'${primary_color || "#4a90e2"}',
          secondary_color:'${secondary_color || "#4a90e2"}',
          variation_style: "${variation_style || "default"}",
          visible_on_page: "${visible_on_page || "all"}",
          layout_preset: "default",
          widgetchatbotwidget0: {
            width: "${width}",
            height: "${height}",
          },
        },
        fonts: {
          family: "${family || "Roboto"}",
          src: "${src || ""}",
        },
	      followUp: {
            enabled: ${data?.componentData?.followup},
            followUpPrompt: '${data?.componentData?.followup_prompt || "the user has been idle for some time, generate a follow up message" }',
            idleTime: ${data?.componentData?.followup_idle},
            maxFollowUps: ${data?.componentData?.followup_max}
        },
        contactOptions: ${data?.componentData?.email && data?.componentData?.phone ? JSON.stringify([
          { label: 'Email us', url: `${data?.componentData?.email}` },
          { label: 'Call us', url: `${data?.componentData?.phone}` }
      ]) : '[]'}
      },
    };


      function getCookieValue(cookieName) {
        var allCookies = '; ' + document.cookie;
        var parts = allCookies.split('; ' + cookieName + '=');
        if (parts.length === 2) {
          return parts.pop().split(';').shift();
        }
      }

      function setCookie(name, value, maxAge) {
        document.cookie = name + '=' + value + ';max-age=' + maxAge;
      }

      function lazyLoadResources() {
        console.log('chat bootup - lazy loading resources');
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        var remoteCss = 'https://norgcdnstorage.blob.core.windows.net/norgcdn-container/plugin-${data?.componentData?.environment || "prod"}/css/main.min.css';
        link.href = remoteCss;
        document.head.appendChild(link);

        var script = document.createElement('script');
        var remoteJs = 'https://norgcdnstorage.blob.core.windows.net/norgcdn-container/plugin-${data?.componentData?.environment || "prod"}/js/main.min.js';
        script.src = remoteJs;
        script.async = true;
        document.body.appendChild(script);

        // Look up the 'meteor-loader' div and remove the 'invisible' class
        var loaderDiv = document.getElementById('meteor-loader');
        if (loaderDiv) {
          loaderDiv.classList.add('invisible');
          loaderDiv.classList.add('h-0');
        }
      }

      if (!getCookieValue('firstVisit')) {
        setCookie('firstVisit', 'true', 31536000);
        setTimeout(lazyLoadResources, 10000);
      } else {
        setTimeout(lazyLoadResources, 500);
      }

  `
  
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = scriptContent;
    document.body.appendChild(script);
  
    const addStyles = () => {
      const element = document.querySelector("#react-root-magento");
      if (element) {
        const target = element?.firstElementChild?.shadowRoot?.querySelector("div.relative");
        if (target) {
          target.classList.add("rounded-lg", "md:rounded-xl", "p-2", "md:p-5");
          clearInterval(counter);
        }
      }
    };
  
    let counter = setInterval(() => {
      addStyles();
    }, 1000);
  
    return () => {
      clearInterval(counter);
      document.body.removeChild(script);
    };
  }, [scriptContent]);
  

  return (
    <>
        <div className={`${getSectionBackgroundColour(data?.componentData?.backgroundColour, "")} chat-norg-window container`} id="react-root-magento"></div>
        <div id="meteor-loader" className={meteorClass}><MeteorDemo /></div>
    </>
  )
}


function MeteorDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="bg-background relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border p-20 md:shadow-xl">
        <Meteors number={30} />
        <p className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white dark:text-white">
          Loading ...
        </p>
      </div>
    </div>
  );
}


export { NorgAssistantChatComponent, NorgChatSpecialRender, MeteorDemo };