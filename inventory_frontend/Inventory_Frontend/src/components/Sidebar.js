// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import MenuItems from "./Menuitem";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeSubItem, setActiveSubItem] = useState(null);

//   const toggleMenu = (index, item) => {
//     if (item.item) {
//       setActiveIndex(activeIndex === index ? null : index);

//       if (activeIndex !== index) {
//         router.push(item.href);
//         const firstSub = item.item[0]?.href;
//         if (firstSub) setActiveSubItem(firstSub);
//       }
//     } else {
//       router.push(item.href);
//     }
//   };

//   return (
//     <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
//       <ul>
//         {MenuItems.map((item, index) => {
//           const isActive = activeIndex === index;

//           return (
//             <li key={index} className="mb-2">
//               {/* Main menu item */}
//               <div
//                 onClick={() => toggleMenu(index, item)}
//                 className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md 
//                   ${pathname.startsWith(item.href) ? "bg-gray-700" : "hover:bg-gray-800"}`}
//               >
//                 {/* Icon (you are using static png for now) */}
//                 {item.icon || item.icons ? (
//                   <img
//                     src={item.icon || item.icons}
//                     alt={item.label}
//                     className="w-5 h-5"
//                   />
//                 ) : null}
//                 <span>{item.label}</span>
//               </div>

//               {/* Submenu */}
//               {item.item && isActive && (
//                 <ul className="ml-6 mt-1">
//                   {item.item.map((subItem, subIndex) => (
//                     <li key={subIndex}>
//                       <Link
//                         href={subItem.href}
//                         className={`block px-3 py-1 rounded-md text-sm
//                           ${
//                             activeSubItem === subItem.href ||
//                             pathname === subItem.href
//                               ? "bg-gray-700"
//                               : "hover:bg-gray-800"
//                           }`}
//                         onClick={() => setActiveSubItem(subItem.href)}
//                       >
//                         {subItem.label}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// };

// export default Sidebar;
    
// 'use client';

// import { KeyboardArrowDown } from "@mui/icons-material";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Menuitems from "./MenuItems";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeSubItem, setActiveSubItem] = useState(null);

//   useEffect(() => {
//     const firstPath = "/" + pathname.split("/")[1];

//     let activeModuleIndex = null;
//     let activeSubModule = null;

//     Menuitems.forEach((item, index) => {
//       if (item.href.startsWith(firstPath)) {
//         activeModuleIndex = index;
//         if (item.item) {
//           const matchedSub = item.item.find(sub => sub.href === pathname);
//           if (matchedSub) {
//             activeSubModule = matchedSub.href;
//           }
//         }
//       }
//     });

//     setActiveIndex(activeModuleIndex);
//     setActiveSubItem(activeSubModule);
//   }, [pathname]);

//   const toggleMenu = (index, item) => {
//     if (item.item) {
//       const isSameIndex = activeIndex === index;
//       setActiveIndex(isSameIndex ? null : index);
//       if (!isSameIndex) {
//         router.push(item.href);
//         const firstSub = item.item?.[0]?.href;
//         if (firstSub) setActiveSubItem(firstSub);
//       }
//     } else {
//       setActiveIndex(index);
//       setActiveSubItem(null);
//     }
//   };

//   return (
//     <aside className="sidebar">
//       {/* <div className="sidebar-header">
//         <div className="logo">
//           <Image
//             src="public/warehouse.png"
//             alt="VED VENTURING DIGITALLY"
//             width={180}
//             height={40}
//             style={{ width: '120px', height: 'auto' }}
//           />
          
//         </div>
//       </div> */}

//       <nav className="menu-container">
//         {Menuitems.map((item, index) => {
//           const isActive = activeIndex === index;

//           return (
//             <div key={index} className="menu-item">
//               {item.item ? (
//                 <div
//                   className={`menu-link ${isActive ? 'active' : ''}`}
//                   onClick={() => toggleMenu(index, item)}
//                   role="button"
//                   tabIndex={0}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     {item.icon && (
//                       <Image
//                         src={item.icon}
//                         alt={item.label}
//                         width={20}
//                         height={20}
//                         className="menu-icon"
//                       />
//                     )}
//                     <span className="menu-label">{item.label}</span>
//                   </div>
//                   <ChevronDown className={`menu-arrow ${isActive ? 'active' : ''}`} />
//                 </div>
//               ) : (
//                 <Link href={item.href} className={`menu-link ${isActive ? 'active' : ''}`}>
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     {item.icon && (
//                       <Image
//                         src={item.icon}
//                         alt={item.label}
//                         width={20}
//                         height={20}
//                         className="menu-icon"
//                       />
//                     )}
//                     <span className="menu-label">{item.label}</span>
//                   </div>
//                 </Link>
//               )}

//               {item.item && isActive && (
//                 <div className="submenu">
//                   {item.item.map((subItem, subIndex) => (
//                     <Link
//                       key={subIndex}
//                       href={subItem.href}
//                       className={`submenu-link ${activeSubItem === subItem.href ? 'active' : ''}`}
//                       onClick={() => setActiveSubItem(subItem.href)}
//                     >
//                       <span>{subItem.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;




// 'use client';

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
// import { KeyboardArrowDown } from "@mui/icons-material";
// import Menuitems from "./MenuItems";

// const Sidebar = () => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [activeIndex, setActiveIndex] = useState(null);
//   const [activeSubItem, setActiveSubItem] = useState(null);

//   // Detect active menu & submenu on route change
//   useEffect(() => {
//     const firstPath = "/" + pathname.split("/")[1];

//     let activeModuleIndex = null;
//     let activeSubModule = null;

//     Menuitems.forEach((item, index) => {
//       if (item.href.startsWith(firstPath)) {
//         activeModuleIndex = index;
//         if (item.item) {
//           const matchedSub = item.item.find(sub => sub.href === pathname);
//           if (matchedSub) {
//             activeSubModule = matchedSub.href;
//           }
//         }
//       }
//     });

//     setActiveIndex(activeModuleIndex);
//     setActiveSubItem(activeSubModule);
//   }, [pathname]);

//   // Handle menu toggle
//   const toggleMenu = (index, item) => {
//     if (item.item) {
//       // toggle expand/collapse
//       setActiveIndex(activeIndex === index ? null : index);

//       // ✅ Fix: don't force navigation automatically when expanding
//       // If you want it to navigate, uncomment the next lines
//       /*
//       if (activeIndex !== index) {
//         router.push(item.href);
//         const firstSub = item.item[0].href;
//         setActiveSubItem(firstSub);
//       }
//       */
//     } else {
//       setActiveIndex(index);
//       setActiveSubItem(null);
//       router.push(item.href); // navigate directly for single links
//     }
//   };

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo">
//           <Image
//             src="/logo.png"
//             alt="VED VENTURING DIGITALLY"
//             width={120}
//             height={40}
//             className="h-auto w-[120px]"
//           />
//         </div>
//       </div>

//       <nav className="menu-container">
//         {Menuitems.map((item, index) => {
//           const isActive = activeIndex === index;

//           return (
//             <div
//              key={index} className="menu-item">
//               {item.item ? (
//                 <div
//                   className={menu-link ${isActive ? "active" : ""}}
//                   onClick={() => toggleMenu(index, item)}
//                 >
//                   <div className="flex items-center">
//                     {item.icon && (
//                       <Image
//                         src={item.icon}
//                         alt={item.label}
//                         width={20}
//                         height={20}
//                         className="menu-icon"
//                       />
//                     )}
//                     <span className="menu-label">{item.label}</span>
//                   </div>
//                   <ChevronDown
//                     className={menu-arrow ${isActive ? "active" : ""}}
//                   />
//                 </div>
//               ) : (
//                 <Link
//                   href={item.href}
//                   className={menu-link ${isActive ? "active" : ""}}
//                   onClick={() => toggleMenu(index, item)}
//                 >
//                   <div className="flex items-center">
//                     {item.icon && (
//                       <Image
//                         src={item.icon}
//                         alt={item.label}
//                         width={20}
//                         height={20}
//                         className="menu-icon"
//                       />
//                     )}
//                     <span className="menu-label">{item.label}</span>
//                   </div>
//                 </Link>
//               )}

//               {/* Submenu */}
//               {item.item && isActive && (
//                 <div className="submenu">
//                   {item.item.map((subItem, subIndex) => (
//                     <Link
//                       key={subIndex}
//                       href={subItem.href}
//                       className={`submenu-link ${
//                         activeSubItem === subItem.href ? "active" : ""
//                       }`}
//                       onClick={() => setActiveSubItem(subItem.href)}
//                     >
//                       <span>{subItem.label}</span>
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
'use client';

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { KeyboardArrowDown, Menu as MenuIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import MenuItems from "./Menuitem";

const Sidebar = ({ collapsed = false, onToggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!pathname) return;
    const firstPath = "/" + pathname.split("/")[1];

    let activeModuleIndex = null;
    let activeSubModule = null;

    MenuItems.forEach((item, index) => {
      if (item.href && item.href === "/" && firstPath === "/") activeModuleIndex = 0;
      if (item.href && item.href.startsWith(firstPath) && item.href !== "/") activeModuleIndex = index;
      if (item.item) {
        const matched = item.item.find((sub) => sub.href === pathname);
        if (matched) {
          activeModuleIndex = index;
          activeSubModule = matched.href;
        }
      }
    });

    setOpenIndex(activeModuleIndex);
    setActiveSubItem(activeSubModule);
  }, [pathname]);

  const toggleMenu = useCallback((index, item) => {
    if (collapsed) return;

    // If clicking same menu, just toggle close
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    // Open the menu
    setOpenIndex(index);

    // Navigate to first sub-item if available
    if (item.item && item.item.length > 0) {
      const firstSub = item.item[0];
      router.push(firstSub.href);
      setActiveSubItem(firstSub.href);
    }
  }, [collapsed, openIndex, router]);

  // Handle main icon click when sidebar is collapsed
  const handleCollapsedMainClick = useCallback((item) => {
    if (!collapsed) return;

    if (item.item && item.item.length > 0) {
      // Has submenus - navigate to first submenu
      const firstSub = item.item[0];
      router.push(firstSub.href);
      setActiveSubItem(firstSub.href);
    } else if (item.href) {
      // Direct route - navigate to main page
      router.push(item.href);
    }
  }, [collapsed, router]);

  // Handle mouse enter on menu item (for collapsed sidebar flyout)
  const handleMouseEnter = useCallback((index) => {
    setHoveredIndex(index);
  }, []);

  // Handle mouse leave on menu item
  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Handle submenu item click
  const handleSubmenuClick = useCallback((href) => {
    setActiveSubItem(href);
    setHoveredIndex(null);
  }, []);

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>

      {/* ── Logo ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-full">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
        </div>
        <div className="sidebar-logo-mini">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-mini-img" />
        </div>
        <IconButton
          onClick={onToggleSidebar}
          size="small"
          className="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* ── Nav ── */}
      <nav className="menu-container">
        {MenuItems.map((item, index) => {
          const isOpen = openIndex === index && !collapsed;
          const isActive = item.href && pathname
            ? pathname === item.href || pathname.startsWith(item.href + '/')
            : item.item?.some((sub) => pathname === sub.href);
          const isHovered = hoveredIndex === index;
          const showFlyout = collapsed && item.item && isHovered;

          return (
            <div
              key={index}
              className={`menu-item${isActive ? " menu-item--active" : ""}${isHovered ? " menu-item--hovered" : ""}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >

              {item.item ? (
                <div
                  className={`menu-link${isActive ? " active" : ""}`}
                  onClick={() => collapsed ? handleCollapsedMainClick(item) : toggleMenu(index, item)}
                  title={collapsed ? item.label : undefined}
                  role="button"
                  tabIndex={0}
                >
                  <div className="menu-left">
                    {item.icon && (
                      <span className="menu-icon-wrap">
                        <item.icon className="menu-icon" />
                      </span>
                    )}
                    <span className="menu-label">{item.label}</span>
                  </div>
                  <KeyboardArrowDown className={`menu-arrow${isOpen ? " open" : ""}`} />
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`menu-link${isActive ? " active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="menu-left">
                    {item.icon && (
                      <span className="menu-icon-wrap">
                        <item.icon className="menu-icon" />
                      </span>
                    )}
                    <span className="menu-label">{item.label}</span>
                  </div>
                </Link>
              )}

              {/* Expanded sidebar submenu */}
              {item.item && (
                <div className={`submenu${isOpen ? " submenu--open" : ""}`}>
                  {item.item.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={`submenu-link${activeSubItem === subItem.href ? " active" : ""}`}
                    >
                      <span className="submenu-dot" />
                      <span className="submenu-text">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Collapsed sidebar flyout popup */}
              {showFlyout && (
                <div
                  className="submenu-flyout"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="submenu-flyout-header">{item.label}</div>
                  <div className="submenu-flyout-content">
                    {item.item.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`submenu-flyout-link${activeSubItem === subItem.href ? " active" : ""}`}
                        onClick={() => handleSubmenuClick(subItem.href)}
                      >
                        <span className="submenu-flyout-dot" />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;