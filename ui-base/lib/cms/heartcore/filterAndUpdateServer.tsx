
import cheerio from "cheerio";
import { LanguageSite } from "../../interfaces/LanguageSite";
import { filterAndUpdateTags, removeHeadBodyTag } from "./filterAndUpdateClass";
import { processURLForNavigationServer } from "../../services/urlServiceServer";


export async function filterAndUpdateClassServer(html: string,
  languageSite: LanguageSite, processRichText: boolean = false) {
  const passOne = filterAndUpdateTags(html, languageSite);
  const passTwo = await filterAndUpdateHrefServer(passOne,
  languageSite, processRichText);
  const finamHtml = removeHeadBodyTag(passTwo);
  return finamHtml;
}

export async function filterAndUpdateHrefServer(html: string, languageSite: LanguageSite, processRichText: boolean = false) {
  if (!html && typeof (html) !== 'string') {
    return "";
  }

  const $ = cheerio.load(html);

  // Process anchor tags' href attribute
  await processAnchorTagsServer($, languageSite, processRichText);

  return $.html();
}

export async function processAnchorTagsServer($: any, languageSite: LanguageSite, processRichText: boolean = false) {
  const anchorElements = Array.from($("a"));

  await Promise.all(anchorElements.map(async (element) => {
    const href = $(element).attr("href");
    if (href) {
      const processedHref = await processURLForNavigationServer(href, languageSite, processRichText);
      $(element).attr('href', processedHref);
      $(element).addClass("underline text-my-darkerIndigo font-medium pb-2 inline-block");
    }
  }));
}
