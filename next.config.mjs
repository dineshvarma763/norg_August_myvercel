/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const cspDirective = [
  "default-src 'self' https://norgcdnstorage.blob.core.windows.net;",
  "script-src 'self' https://ajax.googleapis.com https://www.socialintents.com/ https://norgcdnstorage.blob.core.windows.net https://www.gstatic.com https://vercel.live https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval';", 
  "img-src 'self' data: https://norgcdnstorage.blob.core.windows.net https://media.umbraco.io https://assets.vercel.com https://www.googletagmanager.com https://www.google-analytics.com;", 
  "font-src 'self' https://netdna.bootstrapcdn.com https://fonts.gstatic.com;",
  "connect-src 'self' https://netdna.bootstrapcdn.com https://www.socialintents.com https://api.norg.ai https://norgprod-chat-cleanup-azure-function.azurewebsites.net https://functions.norg.ai https://vercel.live https://www.google.com https://maps.googleapis.com https://media.umbraco.io https://www.googletagmanager.com https://www.google-analytics.com;",
  "form-action 'self' https://bndgroup--sit.sandbox.my.salesforce.com/ https://webto.salesforce.com/;",
  "style-src 'self' https://netdna.bootstrapcdn.com https://www.socialintents.com/ 'unsafe-inline' https://fonts.googleapis.com https://norgcdnstorage.blob.core.windows.net;",
  "frame-src 'self' https://www.socialintents.com https://www.google.com https://www.youtube.com https://youtube.com;",
]

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    domains: [
      "picsum.photos",
      "media.umbraco.io",
      "images.unsplash.com",
      "daisyui.com",
      "images.ctfassets.net",
      "assets-au-01.kc-usercontent.com",
      "api.lorem.space",
    ],
  },
  experimental: {
    // fontLoaders: [
    //   {
    //     loader: "@next/font/google",
    //     options: { subsets: ["latin"] },
    //   },
    // ],
    nextScriptWorkers: true,
    // serverActions: true
  },
  async redirects() {
    if (process.env.ENABLE_URL_REDIRECTS === "true") {
      return await collectRedirectMap()
    }
    return []
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspDirective.join(" "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=()",
          },
        ],
      },
    ]
  },
}

    const restHeaders = {
	"Api-Version": "2",
	"Umb-Project-Alias": process.env.UMBRACO_PROJECT_ALIAS,
	"Api-Key": process.env.UMBRACO_API_KEY,
	"Accept-Language": "en-US",
	"Content-Type" : "application/json"
    };


export default withBundleAnalyzerConfig(nextConfig)

async function collectRedirectMap() {
  console.log("next.config.mjs sourcing redirects")
  const redirects = await fetchRedirects()

  const cmsVariant = process.env.NEXT_PUBLIC_CMS_VARIANT
  let redirectMap = []

  if (cmsVariant === "contentful") {
    redirectMap = collectContentfulRedirectMap(redirects)
  } else if (cmsVariant === "kontent") {
    redirectMap = collectKontentRedirectMap(redirects)
  } else if (cmsVariant === "heartcore") {
    redirectMap = collectUmbracoRedirectMap(redirects)
  }

  return redirectMap
}

async function fetchRedirects() {
  const query = getQuery()

  const cmsVariant = process.env.NEXT_PUBLIC_CMS_VARIANT

  const headers = {
    "Content-Type": "application/json",
  }

  if (cmsVariant === "kontent") {
    const endpoint = `${process.env.KONTENT_GRAPHQL_ENDPOINT}/${process.env.KONTENT_PROJECT_ID}`
    return await fetchAPI(query, endpoint, headers, "redirects kontent")
  } else if (cmsVariant === "contentful") {
    const endpoint = `${process.env.CONTENTFUL_GRAPHQL_ENDPOINT}/${process.env.CONTENTFUL_DELIVERY_API_URL}/${process.env.CONTENTFUL_SPACE_ID}`

    headers[
      "Authorization"
    ] = `Bearer ${process.env.CONTENTFUL_DELIVERY_API_KEY}`

    return await fetchAPI(query, endpoint, headers, "redirects contentful")
  } else if (cmsVariant === "heartcore") {
    const endpoint = `${process.env.UMBRACO_GRAPHQL_ENDPOINT}`

    headers["Api-Key"] = process.env.UMBRACO_API_KEY
    headers["Umb-Project-Alias"] = process.env.UMBRACO_PROJECT_ALIAS

    return await fetchAPI(query, endpoint, headers, "redirects heartcore")
  }

  const data = await response.json()
  return data.data.allRedirect.edges.map((x) => x.node)
}

export async function fetchAPI(
  query,
  endpoint,
  headers = {},
  componentId = "unknown"
) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      query,
    }),
  })
  const json = await res.json()

  if (json.errors) {
    console.error(json.errors)
    throw new Error(
      "fetchAPI in graphqlDataService - Failed to fetch API component: ",
      component
    )
  }

  if (json.data !== undefined && json.data !== null) {
    return json.data
  } else {
    return json
  }
}

function getQuery() {
  let query = `
  {
    allRedirect{
        edges{
            node{
                source
                destination {
                    url
                    level
                    name
                    ... on Homepage {
                      superAlias
                    }
                    ... on SubComponentsPage {
                      superAlias
                    }
                }
                name
                isPermanent
            }
        }
    }
  }
  `

  const cmsVariant = process.env.NEXT_PUBLIC_CMS_VARIANT

  if (cmsVariant === "kontent") {
    query = `
    {
      redirect_All{
          items{
              destination {
                  items{
                      __typename
                      ... on NavigationItem{
                          _seo{
                                urlPath
                            }
                      }
                      _system_{
                          id
                      }
                  }
              }
              source
              settings{
                  items{
                      _system_{
                          codename
                          name
                      }
                  }
              }
          }
      }
    }
    `
  } else if (cmsVariant === "contentful") {
    query = `
      query{
        redirectCollection{
            items{
                isPermanent
                source
                destination{
                    __typename
                    ... on Page{
                        slug
                        urlPath
                    }
                }
            }
        }
    }
    `
  }
  return query
}

/**
 * Filters the redirects of JSON data to exclude specific paths.
 *
 * @param {object} json - The JSON data with redirects.
 * @returns {object} An object containing filtered redirects
 */
function filterJSON(json) {
    // If json or json.redirects is undefined, return an empty object
    if (!json || !json.redirects) {
        console.error('JSON data or redirects property is missing');
        return {};
    }

    let filteredData = {};
    for (let path in json.redirects) {
        if (!path.includes('_components') && !path.startsWith('/settings') && !path.startsWith('/global-components')) {
            filteredData[path] = json.redirects[path];
        }
    }
    return Object.entries(filteredData)
    .filter(([key, value]) => value.length > 0) // Filter out empty arrays
    .reduce((accum, [key, value]) => {
        accum[key] = value; // Add filtered data to new object
        return accum;
    }, {});

}


/**
 * Cleans a path by replacing unnecessary or redundant parts and removing trailing slash.
 *
 * @param {string} path - The path to be cleaned.
 * @returns {string} Cleaned path.
 */
function cleanPath(path) {
    // replace patterns - Note: the order matters here
    const replaceRules = [{from: "/us-homepage", to: "/"}, {from: "/au-homepage", to: "/au"}, {from: "\\(", to: "\\("}, {from: "\\)", to: "\\)"}, {from: "\/$", to: ""}, {from: "//", to: "/"}];

    return replaceRules.reduce((cleanedPath, {from, to}) => {
        return cleanedPath.replace(new RegExp(from, "g"), to);
    }, path);
}

/**
 * Fetches and filters content from Umbraco API, and add redirects into redirectMap.
 *
 * @param {number} pageSize - The number of redirects to retrieve per page from the API request.
 * @param {number} page - The page number of the API request.
 * @param {object[]} redirectMap - The existing redirects map to which new redirects will be added.
 * @returns {Promise<object[]>} Updated redirect map.
 */
async function fetchFilteredContent(pageSize=1000, page=1, redirectMap={}){
    const url = `https://cdn.umbraco.io/redirect?page=${page}&pageSize=${pageSize}`;
    const data = await fetch(url, {method: 'GET', headers: restHeaders});
    const json = await data.json();
    const filteredData = filterJSON(json);
    const totalPages = json?._totalPages;
    const currentPage = json?._page;

    Object.entries(filteredData).forEach(([destination, sources]) => {
	sources.forEach(source => {
            const cleanedDestination = cleanPath(destination);
            const cleanedSource = cleanPath(source);
            if(cleanedSource !== cleanedDestination) {
		console.log(
	      "Umbraco redirects redirecting > ",
		    cleanedSource,
		    " to > ",
		    cleanedDestination,
		    " isPermanent > true");
		redirectMap.push({
                    source: cleanedSource,
                    destination: cleanedDestination,
                    permanent: true
		});
	    }
	});
    });
    if (currentPage < totalPages){
	return await fetchFilteredContent(pageSize, page +1, redirectMap);
    }
    return redirectMap;
}

/**
 * Fetches and adds redirects from the page rename redirects data to the selected map. Also cleans and formats the source and destination urls.
 *
 * @param {object} redirects - The source redirects data.
 * @returns {Promise<object[]>} Redirect map with page rename redirects added to the map
 */
async function collectUmbracoRedirectMap(redirects) {
    let redirectMap = [];
    const page = 1;
    const pageSize = 1000;
    redirects.allRedirect.edges.forEach((redirect) => {
	if (redirect?.node?.source && redirect?.node?.destination?.url) {
	    let source = cleanPath(redirect.node.source);
	    let destination = redirect?.node?.destination?.url;
	    if (destination) {
                destination = cleanPath(destination);
	    }

	    if (redirect?.node?.destination?.superAlias &&
		    redirect?.node?.destination?.superAlias !== ""
	    ) {
		destination = redirect?.node?.destination?.superAlias
	    }
	    console.log(
	      "Manual redirects redirecting    > ",
	      redirect.node.source,
	      " to > ",
	      destination,
	      " isPermanent > ",
	      redirect.node.isPermanent
	    )

	    redirectMap.push({
		source: source,
		destination: destination,
		permanent: redirect.node.isPermanent,
	    })
	}
    });
    redirectMap  =  await fetchFilteredContent(pageSize, page , redirectMap);
    // console.log("Finishsed with redirect Map calls --> redirectMap is: \n", JSON.stringify(redirectMap))
    return redirectMap;
}

function collectContentfulRedirectMap(redirects) {
  const redirectMap = []
  redirects.redirectCollection.items.forEach((redirect) => {
    if (redirect?.source && redirect?.destination?.slug) {
      let destination = redirect?.destination?.urlPath

      console.log(
        "next.config.mjs redirecting > ",
        redirect.source,
        " to > ",
        destination,
        " isPermanent > ",
        redirect.isPermanent
      )
      redirectMap.push({
        source: redirect.source,
        destination: destination,
        permanent: redirect.isPermanent,
      })
    }
  })
  return redirectMap
}

function collectKontentRedirectMap(redirects) {
  const redirectMap = []
  redirects.redirect_All.items.forEach((redirect) => {
    if (redirect?.source && redirect?.destination?.items?.length > 0) {
      let destination = redirect?.destination?.items[0]._seo.urlPath

      const isPermanent =
        redirect?.settings?.items?.find(
          (x) => x._system_.codename === "is_permanent"
        ) !== undefined

      console.log(
        "next.config.mjs redirecting > ",
        redirect.source,
        " to > ",
        destination,
        " isPermanent > ",
        isPermanent
      )
      redirectMap.push({
        source: redirect.source,
        destination: destination,
        permanent: isPermanent,
      })
    }
  })
  return redirectMap
}
