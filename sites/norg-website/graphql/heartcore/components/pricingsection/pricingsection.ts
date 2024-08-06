import {
  variablesMultiSiteByIdentifier,
  variablesMultiSiteSlug,
} from "@/ui-base/lib/cms/_base/tools/common/multiSite"
import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite"
import { PageIdentifier } from "@/ui-base/lib/interfaces/PageIdentifier"
import { getLogger } from "@/ui-base/lib/services/logging/LogConfig"
import { getMatchingResultBySortOrder } from "@/ui-base/lib/util/filterTools"

const log = getLogger("ata.headless.graphql.heartcore.components.pricingsection")

export function pricingsection(slug: string) {
 return `query GetPricingSectionContents($slug: String!) {
  content(url: $slug) {
    url
    contentTypeAlias
    name
    id
    updateDate
    sortOrder
    children {
      edges {
        node {
          __typename
          name
          level
          updateDate
          sortOrder
          children {
            edges {
              node {
                __typename
                name
                level
                url
                updateDate
                sortOrder
                ... on PricingSection {
                  contentTypeAlias
                  name
                  backgroundColour
                  align
                  colReverse
                  updateDate
                  selectableVariant
                  sortOrder
                  topRounded
                  bottomRounded
                  apiURL
                  apiToken
                }
              }
            }
          }
        }
      }
    }
  }
 }`
}

export function variables(
  pageIdentifierOrSlug: PageIdentifier | string,
  languageSite: LanguageSite
) {
  let variables = {};

  if (typeof pageIdentifierOrSlug === "string") {
    variables = variablesMultiSiteSlug(pageIdentifierOrSlug, languageSite)
  } else {
    variables = variablesMultiSiteByIdentifier(pageIdentifierOrSlug, languageSite)
  }

  log.trace("variables heartcore productList > ", variables)
  return variables;
}

type pricingCategories = {
	title: string,
	description: string,
	price: number,
	features: string[],
	restrictions: string[],
	}

type pricingData = {
	title: string,
	description: string,
	pricing: pricingCategories[],
}

type pricingResponse = {
	status: "Success" | "Error",
	pricing: pricingData
}

async function fetchPricing(url: string) {
	var resp: pricingResponse = null;
  try {
    const res = await fetch((url), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
		if (res.status != 200)
			throw new Error("Fetch failed!");
		const data = await res.json();
    resp =  { status: "Success", pricing: data };
  } catch (error) {
    console.error('Error fetching pricing:', error);
    resp = {
      status: "Error",
      pricing: { title: '', description: '', pricing: [] }
    };
  }

	return resp;
}

export async function mapPricingSectionData(data, pageIdentifier: PageIdentifier, languageSite: LanguageSite, sortOrder: number) {
  log.trace("data.content.children.edges > ", data?.content?.children?.edges);

  if (!data?.content?.children?.edges) {
    return null;
  }

  let matchingData:any = getMatchingResultBySortOrder(data.content.children.edges, "PricingSection", sortOrder);

  if (!matchingData) {
    matchingData = {}
  }

	// console.log("Maching result: " , matchingResult);
	if (matchingData.apiURL) {
		const url = matchingData.apiURL;
		try {
			const resp = await fetchPricing(url)
			if (resp.status === "Success"){
				// console.log("Pricing data: ", pricingData);
				matchingData.pricingdata = resp.pricing;
			}
		} catch(err) {
			log.error("Fetch from ", url, " failed");
		}
	}

  matchingData.componentDocumentation = getComponentDocumentation();
  matchingData.youtubeVideo = getYoutubeDocumentation();

  return matchingData;
}

function getComponentDocumentation() {
  return "/library/24-pricing-section";
}

function getYoutubeDocumentation() {
  return "https://youtu.be/KfJ2zzdEgTA";
}
