import UmbracoFlexGrid from "../../umbraco-heartcore-grid";

export function subComponentContent(data) {
  return (
    <UmbracoFlexGrid name="Grid" mainData={data} sections={data.sections} languageSite={data?.globalData?.languageSite} />
  );
}


