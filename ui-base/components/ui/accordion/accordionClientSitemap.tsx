import Link from 'next/link';
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui-base/components/ui/accordion";
import { processURLForNavigation } from "@/ui-base/lib/services/urlService";

// Mapping of levels to Tailwind margin classes
const levelMarginClasses = {
  1: 'ml-4',
  2: 'ml-6',
  3: 'ml-8',
  4: 'ml-12',
  5: 'ml-16',
};

// Main Accordion component to display sitemap items
export default function AccordionSitemapClient({ sitemapList, languageSite }) {
  return (
    <Accordion
      className="AccordionRoot border-my-blue w-full mt-6 [&>*:first-child>h3>button>div>a]:text-2xl [&>*:first-child>h3]:pb-5 [&>*:first-child>h3>button>div>a]:underline [&>*:first-child>h3>button>div>a]:text-my-yellow"
      type="single"
      defaultValue="item-1"
      collapsible>
      {sitemapList.map((item, index) => generateAccordionItem(item, languageSite))}
    </Accordion>
  );
}

// Function to generate an accordion item for each sitemap entry
function generateAccordionItem({ id, url, name, level, children, haschildren }, languageSite) {
  return (
    <AccordionItem className="AccordionItem border-b border-my-blue pr-1" key={id} value={`feature-${id}`}>
      <AccordionTrigger
        className="text-base tracking-0.1em uppercase hover:no-underline pt-5 pb-5 font-[800] [&>div>a]:no-underline [&>div>a]:font-extrabold"
        hasChild={haschildren}
        collapsedIcon={<PlusIcon className="text-my-yellow shrink-0" />}
        expandedIcon={<MinusIcon className="text-my-yellow shrink-0" />}>
        {haschildren?generateLink({ url, name, id, level }, languageSite,false):generateLink({ url, name, id, level }, languageSite,true)}
      </AccordionTrigger>
      {haschildren ?
        <AccordionContent>         
          <div className="ml-6">{generateLink({ url, name, id, level }, languageSite,true)}{generateChildLinks(languageSite, children)}</div>
        </AccordionContent>
        : null}
    </AccordionItem>
  );
}

// Function to generate a Link component with proper margin
function generateLink({ url, name, id, level }, languageSite,isLink) {
  const className = `${levelMarginClasses[level] || 'ml-4'} mr-2`;
  return (
    <div className={className}>
    {(isLink) ? <Link key={id} href={processURLForNavigation(url, languageSite)} className="text-base font-semibold underline inline-block py-1">{name}</Link> : <label>{name}</label>}
    </div>
  );
}

// Function to generate child links from the given data
function generateChildLinks(languageSite, children) {
  const linkList = [];

  // Process each child and their descendants
  children.forEach(child => {
    processChildNodes(child, linkList, languageSite);
  });

  return linkList.map(item => generateLink(item, languageSite,true));
}

// Recursive function to process child nodes and their descendants
function processChildNodes(item, list, languageSite) {
  if (item.node && item.node.children && item.node.showInSitemap) {
     list.push({
        url: item.node.url,
        languageSite,
        name: item.node.name,
        id: item.node.id,
        level: item.node.level
      });
     
    // Process all descendants
    item.node.children.edges.forEach(child => {
      processChildNodes(child, list, languageSite);
    });
  }
}