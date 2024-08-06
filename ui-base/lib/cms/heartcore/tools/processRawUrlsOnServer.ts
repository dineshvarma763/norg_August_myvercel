import { LanguageSite } from "@/ui-base/lib/interfaces/LanguageSite";
import { processURLForNavigationServer } from "@/ui-base/lib/services/urlServiceServer";

export async function processRawUrlsOnServer(object: any, languageSite: LanguageSite, fieldKey:string = 'url') {
  const promises = [];

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (typeof object[key] === 'object' && object[key] !== null) {
        // if the value is another object, we recursively process it
        promises.push(processRawUrlsOnServer(object[key], languageSite, fieldKey));
      } else if (key === fieldKey) {
        const existingValue = object[key] as string;

        if(existingValue && existingValue.length > 0 && !existingValue.startsWith('https')){
          // If the key is 'url', we process it with findAliasMatch function
          const promise = processURLForNavigationServer(existingValue, languageSite).then(friendlyUrl => {
            object[key] = friendlyUrl;
          });

          promises.push(promise);
        }
      }
    }
  }

  // wait for all promises to resolve
  await Promise.all(promises);
}
