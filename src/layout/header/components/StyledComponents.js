import styled from 'styled-components';

export const ProfileDropdownWrapper = styled.div`
  button#header_user_nav,
  button#header_notification {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }
  .dropdown {
    margin-bottom: 0;
  }
  .dropdown-menu {
    top: 38px;
  }
  a:hover {
    background-color: transparent !important;
  }
  #header_notification .caret {
    display: none;
  }
`;

export const RoleWrapper = styled.span`
  font-size: 13px;
  color: #9f9f9f;
  font-family: opensans;
  padding: 5px 0;
`;

export const MenuItemWrapper = styled.div`
  font-family: opensans;
  font-size: 13px;
  color: #000000;
  padding: 5px 0px;
`;

export const HeaderWrapper = styled.div`
  z-index: 99;
  height: 67px;
  top: 0;
  background-color: #ffffff;
  border-bottom: 1px solid;
  border-color: #e2e2e3;
  padding-left: 75px;
  padding-right: 229px;
  margin-left: 128px;
  position: fixed;
  width: 100%;
`;

export const LogoWrapper = styled.img`
  margin-left: 2px;
  margin-right: 20px;
  width: 200px;
`;

export const UserImg = styled.i`
  vertical-align: middle;
  font-size: 18px;
`;
