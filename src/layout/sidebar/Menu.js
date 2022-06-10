import React from 'react';
import PropTypes from 'prop-types';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const Menu = (props) => {
  const { index, appendClass, onHandleClick, menu } = props;
  const { title, iconClass, iconStyle, iconProps, iconImg, titleWrapper, isChildren, showChildren } = menu;
  return (
    <li>
      <a className={`sidebar-item-link ${appendClass(menu)}`} onClick={() => onHandleClick(menu, index)}>
        {/* Menu icon */}
        {(iconImg || iconClass) && (
          <span className="icon-wrapper">
            {!iconImg && iconClass && <i className={`sidebar-icon ${iconClass}`} style={iconStyle} {...iconProps}></i>}
            {iconImg && (
              <img
                className={`sidebar-icon ${iconClass || ''}`}
                src={menu?.isActiveRoute() ? iconImg.active : iconImg.inactive}
              />
            )}
          </span>
        )}
        {/* Menu Lable */}
        <span className={`sidebar-item-title ${titleWrapper?.class || ''}`} style={titleWrapper?.style}>
          {title}
        </span>

        {/* Collapsible icon */}
        {isChildren && showChildren && <FaCaretUp className="collapse-icon" />}
        {isChildren && !showChildren && <FaCaretDown className="collapse-icon" />}
      </a>
      {props.children}
    </li>
  );
};

Menu.propTypes = {
  index: PropTypes.number.isRequired,
  appendClass: PropTypes.func.isRequired,
  onHandleClick: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  children: PropTypes.any,
};
export default Menu;
