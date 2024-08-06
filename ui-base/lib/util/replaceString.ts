
export function replaceString(
  str: string,
  strToReplace: string,
  replacementStr: string
): string {
  // Use the String.replace() method with a regular expression to replace all occurrences of the string
  const replacedString = str.replace(
    new RegExp(strToReplace, "g"),
    replacementStr
  );
  return replacedString;
}
