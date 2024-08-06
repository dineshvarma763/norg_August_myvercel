import { cn } from "@/ui-base/lib/util/utils"
import { filterNavItem } from "../navMegaMenuV1"
import { NavItemInterface } from "./NavItemInterface";
import HoverWrapper from "./HoverWrapper"
import NavItemContent from "./NavItemContent"

interface NavItemProps extends NavItemInterface {
  _level?: number
}

export const NavItem = (navItem: NavItemProps) => {
  const { url, name, productPhoto, className, _level = 1 } = navItem;

  const { visible, children } = filterNavItem(navItem);

  const hasChildren = children && children.length > 0;

  const childrenClass = cn(className, _level > 1 && "hover:bg-gray-200");

  const childrenspanClass = cn( _level > 2 && "lg:[&:nth-child(2)]:text-base");

  const newLavel = _level;

  if (!visible) return null;

  return (
    <HoverWrapper className={childrenClass} _level={_level}>   
        <NavItemContent
          url={url}
          name={name}
          productPhoto={productPhoto}
          _level={newLavel}
          hasChildren={hasChildren}
          navItem={navItem}           
          childItems={children} 
        />
 
    </HoverWrapper>
  );
};

export default NavItem
