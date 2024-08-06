"use client"
import { ChevronDownIcon } from "@radix-ui/react-icons"

interface NavChildrenIndicatorProps {
  hasChildren: boolean,
}

export const NavChildrenIndicator = ({ hasChildren }: NavChildrenIndicatorProps) => {
  if (!hasChildren) return null;

  return <ChevronDownIcon fontSize={18} />;
};

export default NavChildrenIndicator;
