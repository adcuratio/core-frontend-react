import React from 'react';
import PropTypes from 'prop-types';

const NetworkListSelector = (props) => {
  const { networksList, setActiveNetworkData } = props;
  return (
    <>
      <p className="mb10">Add network to approve</p>
      <select
        className="select-option-bwidth mb10"
        defaultValue={-1}
        onChange={(e) => {
          e.target.value === -1
            ? setActiveNetworkData({ data: {} })
            : setActiveNetworkData({ data: networksList[e.target.value] });
        }}
      >
        <option value={-1}>{'Select a Network'}</option>
        {networksList?.map((network, index) => (
          <option key={`network_${network.id}_${index}`} value={index}>
            {network.display_name.length > 40 ? `${network.display_name.substring(0, 40)}...` : network.display_name}
          </option>
        ))}
      </select>
    </>
  );
};

NetworkListSelector.propTypes = {
  networksList: PropTypes.array,
  setActiveNetworkData: PropTypes.func,
};

export default NetworkListSelector;
