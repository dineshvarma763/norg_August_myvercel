import { GetCMS } from "../cmsContextService";
import { CmsVariants } from "../../cms/constants";
import { getLogger } from "../logging/LogConfig";
import { cache } from "react";
import { Underdog } from "next/font/google";

const log = getLogger("ui-base.lib.services.cmsDataQueryGateway");

export async function fetchAPIGatewayWrapper(query, { variables, preview, component } = { variables: {}, preview: false, component: "unknown" }, useCache = false) {
    
    const cmsVariant = GetCMS();

    const headers = {
        'Content-Type': 'application/json'
    };

    if(cmsVariant === 'kontent') {
        const endpoint = `${CmsVariants.variants[cmsVariant].deliveryApiDomain}/${CmsVariants.variants[cmsVariant].projectId}`;
        return await fetchAPI(query, { variables, preview, component }, endpoint, headers);
    } else if(cmsVariant === 'contentful') {
        const endpoint = `${CmsVariants.variants[cmsVariant].deliveryApiDomain}/${CmsVariants.variants[cmsVariant].deliveryApiUrl}/${CmsVariants.variants[cmsVariant].spaceId}`;
        
        headers["Authorization"] = `Bearer ${CmsVariants.variants[cmsVariant].deliveryApiKey}`;

        return await fetchAPI(query, { variables, preview, component }, endpoint, headers);
    } else if(cmsVariant === 'heartcore') {
        const endpoint = `${CmsVariants.variants[cmsVariant].deliveryApiDomain}`;

        headers["Api-Key"] = CmsVariants.variants[cmsVariant].deliveryApiKey;
        headers["Umb-Project-Alias"] = CmsVariants.variants[cmsVariant].projectAlias;

        return await fetchAPI(query, { variables, preview, component }, endpoint, headers, useCache);
    }
}

export async function fetchAPI(
    query,
    { variables, preview, component } = { variables: {}, preview: false, component: "unknown" },
    endpoint: string,
    headers: any = {},
    useCache = false
) {

    let json = { data: undefined, errors: undefined };

    const revalidate = process.env.NEXT_REVALIDATE_TIME ? parseInt(process.env.NEXT_REVALIDATE_TIME) : 100;

    const res = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            query,
            variables,
        }),
        next: { revalidate: revalidate }
    })

    json = await res.json();

  
    if (json.errors) {
      log.debug("fetchAPI in graphqlDataService - Failed to fetch API", component, query, variables, json.errors);
      log.error(json.errors);
			console.error("Error: " , JSON.stringify(json));
			return json;
    }
  
    if (json.data !== undefined && json.data !== null) {
      return json.data;
    } else {
      return json;
    }
  }