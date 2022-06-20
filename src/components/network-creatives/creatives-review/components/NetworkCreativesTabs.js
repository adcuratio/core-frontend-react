import PropTypes from 'prop-types';
import React from 'react';

const NetworkCreativesTabs = (props) => {
  const { onTabChange, activeTab, tabData } = props;

  return (
    <ul className="nav nav-tabs" role="tablist">
      {tabData?.map((data) => (
        <li key={data.id} className={activeTab.id === data.id ? 'active cursor-pointer' : 'cursor-pointer'}>
          <a className="hightlighted-trade-tab" onClick={activeTab.id !== data.id ? () => onTabChange(data) : () => {}}>
            {data.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

NetworkCreativesTabs.propTypes = {
  tabData: PropTypes.array,
  activeTab: PropTypes.object,
  onTabChange: PropTypes.func,
};

NetworkCreativesTabs.defaultProps = {
  tabData: [],
  activeTab: {},
  onTabChange: () => {},
};

export default NetworkCreativesTabs;
