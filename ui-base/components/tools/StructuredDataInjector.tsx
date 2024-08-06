"use client";
import { useEffect } from 'react';

export function StructuredDataInjector({scriptStr}) {
      // Parse the script string as a JSON string
      const unescapedScriptStr = unescapeString(scriptStr);
      useEffect(() => {
        const scriptElement = document.getElementById("structuredData");
      
        if (scriptElement) {
          // Get all child nodes of the script element
          const childNodes = Array.from(scriptElement.childNodes);
      
          // Move each child node to the head of the document
          childNodes.forEach((child) => {
            // Remove the child node from its current parent
            scriptElement.removeChild(child);
      
            // Append the child node to the head of the document
            document.head.appendChild(child);
          });
        }
      }, []);

  return (        
  <div
    id="structuredData"
    dangerouslySetInnerHTML={{
      __html: `${unescapedScriptStr}`,
    }}
  />); // This component doesn't render anything
}

function unescapeString(s) {
  return s.replace(/\\n/g, '\n')
    .replace(/\\'/g, '\'')
    .replace(/\\"/g, '"')
    .replace(/\\&/g, '&')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f');
}
