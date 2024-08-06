import { COMPONENT_PRODUCT_DETAILS } from "@/ui-base/lib/cms/constants"
import {SiteComponents,} from "@/ui-base/lib/interfaces/SiteComponentsInterface"
import { SiteSettings } from "@/ui-base/lib/interfaces/SiteSettings"

const NorgSiteComponentDataLocations = [
    {
        identifier: "hero", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/hero",
        snippetFileName: "hero",
        snippetExport: "hero",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapHeroData",
        queryUsingSlug: true,
        isClientSide: false
    }, {
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
    }, {
        identifier: "richtext", // This identifier must match the __typename in the GraphQL query for the component to work
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
        identifier: "motto", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/motto",
        snippetFileName: "motto",
        snippetExport: "motto",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapMottoData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "ctalist", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/ctalist",
        snippetFileName: "ctalist",
        snippetExport: "ctalist",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapCtaListData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productDetails",
        snippetLocation: "ecommerce",
        snippetFileName: "productDetails",
        snippetExport: "productDetails",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productlist", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "ecommerce",
        snippetFileName: "productList",
        snippetExport: "productList",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductListData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productcategorylist", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "ecommerce",
        snippetFileName: "productCategoryList",
        snippetExport: "productCategoryList",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductCategoryListData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "exploretherange", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "ecommerce",
        snippetFileName: "exploreTheRange",
        snippetExport: "exploreTheRange",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapExploreTheRangeData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "keyfeatures", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/keyfeatures",
        snippetFileName: "keyfeatures",
        snippetExport: "keyfeatures",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapKeyFeaturesData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "testimonial", // This identifier must match the __typename in the GraphQL query for the component to work
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
        identifier: "linkslistings",
        snippetLocation: "components/linklist",
        snippetFileName: "linklist",
        snippetExport: "linklist",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapLinkSectionData",
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
        identifier: "norgassistantchat", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/norgassistantchat",
        snippetFileName: "norgassistantchat",
        snippetExport: "norgassistantchat",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapNorgAssistantChatData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "norgdemocreation", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/norgdemocreation",
        snippetFileName: "norgdemocreation",
        snippetExport: "norgdemocreation",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapNorgDemoCreationData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "livechat", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/livechat",
        snippetFileName: "livechat",
        snippetExport: "livechat",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapLiveChatData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "phoneblock", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/phoneblock",
        snippetFileName: "phoneblock",
        snippetExport: "phoneblock",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapPhoneblockData",
        queryUsingSlug: true,
        isClientSide: false
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
        dataFunctionMapperName: "mapGooglmapsData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "specificationtable", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/specificationtable",
        snippetFileName: "specificationtable",
        snippetExport: "specificationtable",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapSpecificationTableData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "advancedspecificationtable", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/advancedspecificationtable",
        snippetFileName: "advancedspecificationtable",
        snippetExport: "advancedspecificationtable",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapAdvancedSpecificationTableData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productdownloads", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "ecommerce",
        snippetFileName: "productdownloads",
        snippetExport: "productdownloads",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductDownloadsData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productvideos", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "ecommerce",
        snippetFileName: "productvideos",
        snippetExport: "productvideos",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductVideosData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "casestudy", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/casestudy",
        snippetFileName: "casestudy",
        snippetExport: "casestudy",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapCaseStudyData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "showcase", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/showcase",
        snippetFileName: "showcase",
        snippetExport: "showcase",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapShowcaseData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "promonav", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/promonav",
        snippetFileName: "promonav",
        snippetExport: "promonav",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapPromoNavData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "productslist", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/productslist",
        snippetFileName: "productslist",
        snippetExport: "productslist",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapProductListData",
        queryUsingSlug: true,
        isClientSide: false
    },
    {
        identifier: "pricingsection", // This identifier must match the __typename in the GraphQL query for the component to work
        snippetLocation: "components/pricingsection",
        snippetFileName: "pricingsection",
        snippetExport: "pricingsection",
        queryIsFunction: true,
        queryHasVariables: true,
        variableFunction: "variables",
        dataFunctionMapperName: "mapPricingSectionData",
        queryUsingSlug: true,
        isClientSide: false
    },
]

export { NorgSiteComponentDataLocations }



// This NorgFixedLayouts is redundant for the Norg site and note being used
export const NorgFixedLayouts: SiteComponents = {
    layouts: [
        {
            identifier: "productPage",
            components: [COMPONENT_PRODUCT_DETAILS],
        },
    ],
}

export const NorgSiteSettings: SiteSettings = {
    mainSiteLanguage: "au",
    languageSites: [
        {
            countryCode: "au",
            homepageSlugPrefix: "/homepage",
            shouldLanguageCodeBeAddedToNav: false,
        },
    ],
    extraPageTypes: [
        {
            identifier: "homepage",
            frontEndSlug: "",
            backEndSlug: "",
            pageVariant: "homepage",
            cmsType: "homepage",
            isFixedLayout: true,
        },
    ],
    hideStoreButtons: true,
    siteConfig: {
        siteTemplate: "norg-website", // This matched the folder within the /sites folder
        name: "Norg AI Technology",
        description: "Get up and running with a basic site quick. Blazingly fast headless.",
        mainNav: [
            {
                title: "Home",
                href: "/",
            },
        ],
        links: {
            twitter: "https://twitter.com/shadcn",
            github: "https://github.com/shadcn/ui",
            docs: "https://ui.shadcn.com",
            accordion: "/components/accordion",
            alert: "/components/alert-dialog",
            subMenu: "/components/subMenu",
            linksList: "/components/linkslist2",
            globalNavigation: "/components/globalNavigation",
            avatar: "/components/avatar",
            button: "/components/button",
            checkbox: "/components/checkbox",
            collapsible: "/components/collapsible",
            code: "/components/code",
            contextMenu: "/components/contextMenu",
            dialog: "/components/dialog",
            dropDown: "/components/dropDown",
            hoverCard: "/components/hoverCard",
            input: "/components/input",
            label: "/components/label",
            menuBar: "/components/menuBar",
            popover: "/components/popover",
            progress: "/components/progress",
            radioGroup: "/components/radioGroup",
            scrollArea: "/components/scrollArea",
            select: "/components/select",
            separator: "/components/separator",
            slider: "/components/slider",
            tabs: "/components/tabs",
            textarea: "/components/textarea",
            carousel: "/components/carousel",
            promotion: "/components/contentBlocks/promotion",
            breadcrumb: "/components/breadcrumb",
            cards: "/components/cards",
            badge: "/components/badge",
            chatBubble: "/components/chatBubble",
            countdown: "/components/countdown",
            kbd: "/components/kbd",
            radialProgress: "/components/radialProgress",
            stats: "/components/stats",
            ctaSectionTwoColumn: "/components/contentBlocks/ctaSectionTwoColumn",
            ctaSectionThreeColumn: "/components/contentBlocks/ctaSectionThreeColumn",
            range: "/components/range",
            rating: "/components/rating",
            footer: "/components/footer",
            table: "/components/table",
            mask: "/components/mask",
            hero: "/components/hero",
            mediaLogos: "/components/mediaLogos",
            featureSection: "/components/contentBlocks/featureSection",
        },
        logo: {
            description: "Next.js",
            image: "/landify/static/playground_assets/logotype-dark.svg",
            width: 100,
            height: 100,
            title: "Next.js",
        },
        footerLocation: `/global-components/footer`,
    },
    ecommerceSettings: {
        hasProducts: true,
    },
    deepSearchNavigation: true,
}
