import Image from "next/image"
import Link from "next/link"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { cn } from "@/ui-base/lib/util/utils"
import { renderChildOf } from "./renderChildOf";
import NavChildrenIndicator from "./NavChildrenIndicator";

interface NavItemContentProps {
  url: string,
  name: string,
  productPhoto: any, 
  _level: number,
  hasChildren: boolean,
  childItems: any,
  navItem: any
}

export const NavItemContent = ({
  url,
  name,
  productPhoto,
  _level,
  hasChildren,
  childItems,
  navItem
}: NavItemContentProps) => {
  
  const childrenspanClass = cn( _level > 2 && "lg:[&:nth-child(2)]:text-base");

  return (
        <>
      <Link href={url} className="z-10 flex cursor-pointer space-x-2">
        {productPhoto && (
      <Image
          src={productPhoto?.url}
          // sizes="(max-width: 600px) 90vw, (min-width: 601px) 100vw,(max-height: 325px) 90vw, (min-height: 325px) 100vw"
          width={245}
          height={245}
          className="object-cover lg:h-61 lg:w-61 w-full h-32 mb-4"
          alt={productPhoto?.media?.altText != "" ?  productPhoto?.media?.altText :  productPhoto?.media?.name != "" ?  productPhoto?.media?.name : name}
          quality={75}
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority={false}
        />
        )}
        <span className={cn(
          "flex items-center gap-x-2",
          childrenspanClass
        )}>
          {name}
          <NavChildrenIndicator hasChildren={hasChildren} />
        </span>
      </Link>
      {hasChildren && renderChildOf(_level, childItems, navItem)}
    </>
  );
};

export default NavItemContent;


export const NavItemDropnDown = ({
  _level,
  hasChildren,
  childItems,
  navItem
}: NavItemContentProps) => {
  
  return (
        <>
      {hasChildren && renderChildOf(_level, childItems, navItem)}
    </>
  );
};
