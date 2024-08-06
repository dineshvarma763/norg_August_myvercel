// export const EXAMPLE_PATH = 'cms-umbraco-heartcore'
// export const CMS_NAME = 'Umbraco Heartcore'
// export const CMS_URL = 'https://umbraco.com/heartcore'

// Need to add the folowing to env.local  CMS_VARIANT=heartcore

export const HOME_OG_IMAGE_URL =
    "https://og-image.vercel.app/Next.js%20Blog%20Example%20with%20**Umbraco%20Heartcore**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg&images=https://media.umbraco.io/demo-headless/8d8a349dde73ca6/u_heartcore_heart_lockup_tagline_dark.svg"

export const SUPER_ALIAS = "SUPER-ALIAS::"

export type CmsVariant = "heartcore" | "contentful" | "kontent"

export type CountryCode = "us" | "au"

export type PageVariant = "homepage" | "home" | "subComponentsPage" | "productPage"

const CmsVariants = {
    variants: {
        heartcore: {
            cmsName: "Umbraco Heartcore",
            deliveryApiDomain: process.env.UMBRACO_GRAPHQL_ENDPOINT,
            deliveryApiUrl: "w-1/3",
            cmsUrl: "https://umbraco.com/heartcore",
            deliveryApiKey: process.env.UMBRACO_API_KEY,
            contentApiKey: "",
            previewApiKey: "",
            projectAlias: process.env.UMBRACO_PROJECT_ALIAS,
            pageTypes: {
                home: {
                    frontEndSlug: "",
                    backEndSlug: "",
                    pageVariant: "Home",
                    cmsType: "homepage",
                    isFixedLayout: true,
                    components: ["Hero", "OurClients"],
                },
                subComponentsPage: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "subComponentsPage",
                    cmsType: "subComponentsPage",
                    isFixedLayout: false,
                },
                productPage: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "productPage",
                    cmsType: "productPage",
                    isFixedLayout: true,
                }
            },
        },
        kontent: {
            cmsName: "Kentico Kontent",
            deliveryApiDomain: process.env.KONTENT_GRAPHQL_ENDPOINT,
            deliveryApiUrl: "w-1/3",
            cmsUrl: "https://umbraco.com/heartcore",
            deliveryApiKey: process.env.UMBRACO_API_KEY,
            contentApiKey: "",
            previewApiKey: process.env.KONTENT_PREVIEW_API_KEY,
            projectAlias: "",
            projectId: process.env.KONTENT_PROJECT_ID,
            pageTypes: {
                home: {
                    frontEndSlug: "/",
                    backEndSlug: "/",
                    pageVariant: "Home",
                    cmsType: "homepage",
                    isFixedLayout: true,
                },
                dynamic: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "dynamic",
                    cmsType: "navigation_item",
                    isFixedLayout: false,
                },
                landing: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "landing",
                    cmsType: "staticPage",
                    isFixedLayout: true,
                },
                productPage: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "productPage",
                    cmsType: "productPage",
                    isFixedLayout: false,
                }
            },
        },
        contentful: {
            cmsName: "Contentful",
            deliveryApiDomain: process.env.CONTENTFUL_GRAPHQL_ENDPOINT,
            deliveryApiUrl: process.env.CONTENTFUL_DELIVERY_API_URL,
            cmsUrl: "https://app.contentful.com/spaces/3j9y7hnidlox",
            deliveryApiKey: process.env.CONTENTFUL_DELIVERY_API_KEY,
            contentApiKey: "",
            previewApiKey: process.env.CONTENTFUL_PREVIEW_API_KEY,
            projectAlias: "contentful-CD",
            spaceId: process.env.CONTENTFUL_SPACE_ID,
            environmentId: process.env.CONTENTFUL_ENVIRONMENT,
            pageTypes: {
                home: {
                    frontEndSlug: "/",
                    backEndSlug: "/",
                    pageVariant: "Home",
                    cmsType: "pageCollection",
                    isFixedLayout: true,
                },
                dynamic: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "dynamic",
                    cmsType: "pageCollection",
                    isFixedLayout: false,
                },
                productPage: {
                    frontEndSlug: null,
                    backEndSlug: null,
                    pageVariant: "productPage",
                    cmsType: "productPage",
                    isFixedLayout: false,
                }
            },
        },
    },
}
export { CmsVariants }

const DynamicCmsDataLocations: DynamicDataCmsProperties[] = [
    {
        identifier: "navigation",
        snippetLocation: "navigation",
        snippetFileName: "navigation",
        snippetExport: "navigation",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapNavigationData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "navigationchildren",
        snippetLocation: "navigationChildren",
        snippetFileName: "navigationChildren",
        snippetExport: "navigationChildren",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapNavigationData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "sitemap",
        snippetLocation: "sitemap",
        snippetFileName: "sitemap",
        snippetExport: "sitemap",
        queryIsFunction: false,
        queryHasVariables: false,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSitemapData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "seo",
        snippetLocation: "seo",
        snippetFileName: "seo",
        snippetExport: "seo",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSeoData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "breadcrumb",
        snippetLocation: "breadcrumb",
        snippetFileName: "breadcrumb",
        snippetExport: "breadcrumb",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapBreadcrumbData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "model",
        snippetLocation: "model",
        snippetFileName: "model",
        snippetExport: "model",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapModelData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "subcomponentcontent",
        snippetLocation: "structures",
        snippetFileName: "subComponentContent",
        snippetExport: "subComponentContent",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSubComponentContentData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "redirects",
        snippetLocation: "redirects",
        snippetFileName: "redirects",
        snippetExport: "redirects",
        queryIsFunction: false,
        queryHasVariables: false,
        variableFunction: "variables",
        dataFunctionMapperName: "mapRedirectsData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "robotstxt",
        snippetLocation: "robotsTxt",
        snippetFileName: "robotsTxt",
        snippetExport: "robotsTxt",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapRobotsTxtData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "sitesearch", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "sitesearch",
        snippetFileName: "sitesearch",
        snippetExport: "sitesearch",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSiteSearchData",
        queryUsingSlug: false,
        isClientSide: true
    },
    {
        identifier: "gallery", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/gallery",
        snippetFileName: "gallery",
        snippetExport: "gallery",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapGalleryData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "gridcontent",  // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/grid",
        snippetFileName: "grid",
        snippetExport: "grid",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapGridData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "richtext",  // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/richtext",
        snippetFileName: "richtext",
        snippetExport: "richtext",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapRichTextData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "footer",
        snippetLocation: "footer",
        snippetFileName: "footer",
        snippetExport: "footer",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapFooterData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "stickynavigation",
        snippetLocation: "stickynavigation",
        snippetFileName: "stickynavigation",
        snippetExport: "stickynavigation",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapStickyNavigationData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "testimonials", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/testimonial",
        snippetFileName: "testimonial",
        snippetExport: "testimonial",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapTestimonialData",
        queryUsingSlug: true,
        isClientSide: false        
    },
    {
        identifier: "accordion", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/accordion",
        snippetFileName: "accordion",
        snippetExport: "accordion",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapAccordionData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "featurethreeimagessection", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/featurethreeImages",
        snippetFileName: "featurethreeImages",
        snippetExport: "featurethreeImages",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapFeaturethreeImagesData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "form", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/form",
        snippetFileName: "form",
        snippetExport: "form",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapFormData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "faq", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/faq",
        snippetFileName: "faq",
        snippetExport: "faq",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapFaqData",
        queryUsingSlug: true,
        isClientSide: true
    },
    {
        identifier: "videosection", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/videosection",
        snippetFileName: "videosection",
        snippetExport: "videosection",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapVideoSectionData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "googlemaps", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/googlemaps",
        snippetFileName: "googlemaps",
        snippetExport: "googlemaps",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapGooglemapsData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "alias",
        snippetLocation: "alias",
        snippetFileName: "alias",
        snippetExport: "alias",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapAliasData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "sitemapclient",
        snippetLocation: "sitemapClient",
        snippetFileName: "sitemapClient",
        snippetExport: "sitemapClient",
        queryIsFunction: false,
        queryHasVariables: false,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSitemapClientData",
        queryUsingSlug: true,
        isClientSide: false
    },
];

export { DynamicCmsDataLocations }

export type DynamicCmsDataVariant = "navigation" | "page"

export interface DynamicDataCmsProperties {
    identifier: string
    snippetLocation: string
    snippetFileName: string
    snippetExport: string
    variableFunction: string
    dataFunctionMapperName: string
    queryIsFunction: boolean
    queryHasVariables: boolean
    queryUsingSlug: boolean,
    isClientSide: boolean
}

export const COMPONENT_PRODUCT_DETAILS: string = "productDetails"
export const SUBCOMPONENT_CONTENT: string = "subComponentContent"
