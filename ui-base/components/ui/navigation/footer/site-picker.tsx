"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"

import Dropdown from "../../dropdown/DropDown"

const menuItems = [
  {
    value: "AUS",
    label: "AUSTRALIA",
  },
  {
    value: "US",
    label: "USA",
  },
  // Add more items as needed
]

export const SitePicker = ({}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && pathname.startsWith("/au")) {
      setSelectedIndex(0) // index of Australia in menuItems array
    } else {
      setSelectedIndex(1) // index of US in menuItems array
    }
  }, [pathname]) // Dependency updated to router.asPath

  const handleMenuItemClick = (item) => {
    const index = menuItems.findIndex(
      (menuItem) => menuItem.value === item.value
    )
    setSelectedIndex(index)

    if (menuItems[index].value === "AUS") {
      router.push("/au")
    } else if (menuItems[index].value === "US") {
      router.push("/")
    }
  }

  return (
    <Dropdown
      align="left"
      options={menuItems}
      closeOnOptionClick={true}
      closeOnClickOutside={true}
      onClick={handleMenuItemClick}
      triggerRenderer={(props) => (
        <div className="mr-6 flex items-center">
          <span className="text-my-blue">{props.label}</span>
          <ChevronDownIcon className="text-my-blue p-0.5" />
        </div>
      )}
      triggerLabel={menuItems[selectedIndex].label}
    />
  )
}
