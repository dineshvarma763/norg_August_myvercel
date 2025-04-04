import { variablesByName } from "../../../_base/tools/common/multiSite";

export function robotsTxt(name:String)
{
  return `
  query GetRobotsTxt($name: String!) {
      snippet_All(where: {_system_: {name: {eq: $name}}})  {
        items{
            _system_{
                name
            }
            snippetCode
            updateDate
        }
      }
  }  
  `
};

export function variables(name:String)
{
  const variables = variablesByName(name);
  return variables;
};

export default function GetRobotsTxt() {
  return robotsTxt;
}

export function mapRobotsTxtData(data) {
  return data.snippet_All?.items[0]?.snippetCode;
}