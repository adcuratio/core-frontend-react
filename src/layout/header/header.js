import React, { useState } from "react";
import PropTypes from "prop-types";
import { DropdownButton, MenuItem } from "react-bootstrap";
import { observer, inject } from "mobx-react";
import { useNavigate } from "react-router-dom";

import Logo from "../../images/logo.png";
import NotificationImg from "../../images/notification.png";

import {
  ProfileDropdownWrapper,
  RoleWrapper,
  MenuItemWrapper,
  HeaderWrapper,
  LogoWrapper,
  SelectWrapper,
  UserImg,
} from "./components/StyledComponents";

const Header = inject("authStore")(
  observer((props) => {
    const { isLogin, navigationService } = props;
    const { authStore } = props;
    const navigate = useNavigate();

    const [fullName] = useState(
      authStore.getUser()
        ? `${authStore.getUser().userFirstName} ${
            authStore.getUser().userLastName
          }`
        : ""
    );
    const [userRole] = useState(
      authStore.getUser() ? authStore.getUser().userRole : ""
    );

    const logOut = () => {
      console.log("am i here?");
      authStore.deleteSession().then(() => {
        navigate("/");
      });
    };
    const goToUpdatePwd = () => {
      navigationService.goToUpdatePwd();
    };

    return (
      <HeaderWrapper className="flex-container2">
        <LogoWrapper src={Logo} alt="" />
        {!isLogin ? (
          <div className=" mr-4 flex-container1">
            <ProfileDropdownWrapper>
              <DropdownButton
                id="header_notification"
                title={
                  <span>
                    <img src={NotificationImg} alt="" />
                  </span>
                }
              >
                <MenuItem>
                  <MenuItemWrapper>No notifications available.</MenuItemWrapper>
                </MenuItem>
              </DropdownButton>
            </ProfileDropdownWrapper>

            <ProfileDropdownWrapper>
              <SelectWrapper>
                <select>
                  <option>
                    <span>
                      <UserImg className="user-img far fa-user-circle" />
                      {fullName}
                    </span>
                  </option>

                  <option>
                    <MenuItemWrapper onClick={logOut}>
                      <i className="glyphicon glyphicon-log-out mr10">
                        {" "}
                        Profile
                      </i>
                    </MenuItemWrapper>
                  </option>
                  <option>
                    <MenuItemWrapper onClick={logOut}>
                      <i className="glyphicon glyphicon-log-out mr10">Logout</i>
                    </MenuItemWrapper>
                  </option>
                  <option disabled={true}>
                    <RoleWrapper>Role: {userRole}</RoleWrapper>
                  </option>
                </select>
              </SelectWrapper>
              {/* <DropdownButton
                id="header_user_nav"
                title={
                  <span>
                    <UserImg className="user-img far fa-user-circle" />{" "}
                    {fullName}
                  </span>
                }
              >
                <MenuItem>
                  <MenuItemWrapper onClick={goToUpdatePwd}>
                    <i className="glyphicon glyphicon-user mr10"></i>Profile
                  </MenuItemWrapper>
                </MenuItem>
                <MenuItem>
                  <MenuItemWrapper onClick={logOut}>
                    <i className="glyphicon glyphicon-log-out mr10"></i>Logout
                  </MenuItemWrapper>
                </MenuItem>
                <MenuItem>
                  <RoleWrapper>Role: {userRole}</RoleWrapper>
                </MenuItem>
              </DropdownButton> */}
            </ProfileDropdownWrapper>
          </div>
        ) : null}
      </HeaderWrapper>
    );
  })
);

Header.propTypes = {
  isLogin: PropTypes.bool,
  navigationService: PropTypes.object,
};

export default Header;
