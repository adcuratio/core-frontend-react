import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { isAuthorized } from "./helper";
import Menu from "./Menu";
import SubMenu from "./SubMenu";

import ModalContainer from "../../components/ModalNavigation";

import "./sidebar.css";
import { inject, observer } from "mobx-react";

const Sidebar = inject("authStore")(
  observer((props) => {
    const { navigationService, $state, authStore, env, $scope } = props;
    const isSuperAdminUser = authStore.isSuperAdminUser();
    const isNetworkAdminUser = authStore.isNetworkAdminUser();
    const isOperatorAdminUser = authStore.isOperatorAdminUser();
    const portalVersion =
      "adc" || isOperatorAdminUser
        ? env?.operatorPortalVersion
        : env?.portalVersion;

    const [menuList, setMenuList] = useState([]);
    const [, setActiveRoute] = useState("");
    const [isNavigate, setIsNavigate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sidebarMenuData, setSidebarMenuData] = useState({});
    const [sidebarMenuIndex, setSidebarMenuIndex] = useState(0);
    const [navigationMessage, setNavigationMessage] = useState("");

    useEffect(() => {
      const list = isAuthorized({ navigationService, $state, authStore }) || [];
      setMenuList(list);

      // $scope.$on("$locationChangeSuccess", (...locationProps) => {
      //   const [, next] = locationProps;
      //   setTimeout(() => {
      //     setActiveRoute(next);
      //   }, 100);
      // });
    }, []);

    const navigationCheck = (menu, selectedMenuIndex) => {
      if (menu.isChildren) {
        sidebarNavigate(menu, selectedMenuIndex);
      } else if (
        $state.$current.name === "dash.ncmCreate2" ||
        $state.$current.name === "dash.createNewSegment" ||
        $state.$current.name === "dash.defineMessagingGroups"
      ) {
        setShowModal(!showModal);
      }
    };

    const handleNavigation = () => {
      setIsNavigate(!isNavigate);
      sidebarNavigate(sidebarMenuData, sidebarMenuIndex);
      setShowModal(!showModal);
    };

    const sidebarNavigate = (menu, selectedMenuIndex) => {
      if (menu.isChildren) {
        const menu_list = expandMenuByIndex(menuList, selectedMenuIndex);
        setMenuList(menu_list);
      } else {
        menu.onClick();
      }
    };

    const onHandleClick = (menu, selectedMenuIndex) => {
      if (
        $state.$current.name === "dash.ncmCreate2" ||
        $state.$current.name === "dash.createNewSegment" ||
        $state.$current.name === "dash.defineMessagingGroups"
      ) {
        if ($state.$current.name === "dash.ncmCreate2") {
          setNavigationMessage("NCM creation flow");
        }
        if ($state.$current.name === "dash.createNewSegment") {
          setNavigationMessage("Segment creation flow");
        }
        if ($state.$current.name === "dash.defineMessagingGroups") {
          setNavigationMessage("Messaging group creation flow");
        }
        setSidebarMenuData(menu);
        setSidebarMenuIndex(selectedMenuIndex);
        navigationCheck(menu, selectedMenuIndex);
      } else {
        sidebarNavigate(menu, selectedMenuIndex);
      }
    };

    const appendClass = (menu) => {
      let appendClass = "";
      if (menu.isActiveRoute()) {
        appendClass += "active-menu";
      }
      return appendClass;
    };

    const handleModalToggle = () => {
      setShowModal(!showModal);
    };

    const expandMenuByIndex = (items = menuList, menuIndex) => {
      const menu_list = items.map((item, index) => {
        if (menuIndex === index) {
          item.showChildren = !item.showChildren;
        }
        return item;
      });
      return menu_list;
    };

    return (
      <div className="main-sidebar-wrapper">
        <nav className="side-nav user-select-none">
          <ul>
            {menuList.map((menu, index) => {
              const { isChildren, showChildren, children } = menu;
              return (
                <Menu
                  key={index}
                  index={index}
                  appendClass={appendClass}
                  onHandleClick={onHandleClick}
                  menu={menu}
                >
                  {/* Sub Menu */}
                  {isChildren && showChildren && (
                    <ul className="submenu">
                      {children?.map((child, childIndex) => (
                        <SubMenu
                          key={`child-${index}${childIndex}`}
                          parentIndex={index}
                          child={child}
                          appendClass={appendClass}
                          onHandleClick={() => onHandleClick(child, childIndex)}
                        />
                      ))}
                    </ul>
                  )}
                </Menu>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!isSuperAdminUser && (
          <div
            className="sidebar-footer text-center"
            title={`Version ${portalVersion}`}
          >
            Adcuratio {isOperatorAdminUser && <span>Distributor </span>}
            {isNetworkAdminUser && <span>Network </span>}Portal {portalVersion}
          </div>
        )}
        {/* navigation check */}
        <ModalContainer
          showModal={showModal}
          toggleModal={handleModalToggle}
          handleNavigation={handleNavigation}
          navigationMessage={navigationMessage}
        />
      </div>
    );
  })
);

Sidebar.propTypes = {
  $state: PropTypes.object.isRequired,
  env: PropTypes.object.isRequired,
  authStore: PropTypes.object,
  navigationService: PropTypes.object.isRequired,
  $scope: PropTypes.object.isRequired,
};

export default Sidebar;
