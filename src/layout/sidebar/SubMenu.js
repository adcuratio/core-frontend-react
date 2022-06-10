import React from 'react';
import PropTypes from 'prop-types';

const SubMenu = (props) => {
  const { child, appendClass, onHandleClick } = props;
  return (
    <li>
      <a onClick={() => onHandleClick()} className={`${appendClass(child)}`}>
        {child.title}
      </a>
    </li>
  );
};

SubMenu.propTypes = {
  child: PropTypes.object.isRequired,
  appendClass: PropTypes.func.isRequired,
  onHandleClick: PropTypes.func.isRequired,
};

export default SubMenu;
