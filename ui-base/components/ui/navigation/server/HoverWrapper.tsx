'use client';
import { cn } from "@/ui-base/lib/util/utils";
import { Suspense, useState } from "react";

import styles from "@/ui-base/styles/megamenu.module.css";

export const HoverWrapper = ({ children, className, _level }) => {
    const [isHovered, setIsHovered] = useState(false);
    const childrenClass = cn(className, _level > 1 && "hover:bg-gray-200");
    const navkids = "font-extrabold " + styles.showNavChildren;
    const hideNavKids = styles.hideNavChildren;
    return (
        <>        
        <Suspense>
            <li
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "flex items-center justify-center transition duration-100 ease-in-out text-sm",
                    childrenClass,
                    { navkids : isHovered },
                    { hideNavKids : !isHovered }
                )}
            >
                {children}
            </li>            
        </Suspense>
        </>
    );
};

export default HoverWrapper;
