import { cn } from "@/ui-base/lib/util/utils";
import { NavItem } from "./NavItemServer";
import { NavItemInterface } from "./NavItemInterface";

export function renderChildOf(_level: number,
  navItemChilds: NavItemInterface[],
  // isHovering: boolean,
  self: any) {
  if (_level === 1 
    // && isHovering
    ) { 
    return (
      <div className="outer level1 absolute inset-x-4 top-1/2 pt-[50px]">
        <div className="absolute z-50 w-full pt-0.5">
          <ul
            tabIndex={0}
            style={{ minHeight: navItemChilds.length ? "398px" : "0px" }}
            className="relative flex flex-1 flex-col bg-white p-2 shadow-md"
          >
            {navItemChilds.map((item, idx) => (
              <>
                <NavItem
                  {...item}
                  key={`${item.id}-${idx}`}
                  _level={_level + 1}
                  className={cn("justify-start p-4 font-normal", {
                    "[&>a]:flex [&>a]:flex-col [&>a]:items-center [&>a:hover>img]:scale-105": item?.productPhoto,
                  })} />
              </>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (_level === 2 
    // && isHovering
    ) {
    return (
      <div
        className={"z-[1] level2 absolute left-[29%] top-0 h-full w-[71%] border-l border-gray-400 bg-gray-200"}
      >
        <ul tabIndex={0} className="w-full h-full overflow-hidden">
          <NavItem
            name={`View all ${self.name}`}
            url={self.url}
            showInNavigation
            className={`${self?.className} hover:!bg-gray-300`}
            key={`self-${self.id}`}
            _level={_level + 1} />
          {navItemChilds.slice(0, 3).map((item, idx) => (
            <NavItem
              {...item}
              key={`${item.id}-${idx}`}
              _level={_level + 1}
              className={cn("!justify-start p-4 inline-block w-[33%]", {
                "[&>a]:flex [&>a]:flex-col [&>a]:items-center [&>a:hover>img]:scale-105": item?.productPhoto,
              })} />
          ))}
        </ul>
      </div>
    );
  }

  return <></>;
}
