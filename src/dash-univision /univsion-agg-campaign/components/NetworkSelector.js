import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';

import AggPickyFilter from './PickyAgg';
import { showAckErrorMessage } from '../../../common/utils';

const NetworkSelector = inject('aggCampaignStore')(
  observer((props) => {
    const { selectedNetworkList, onChange, aggCampaignStore } = props;
    const networkList = toJS(aggCampaignStore.networkList);

    return (
      <AggPickyFilter
        includeSelectAll={false}
        className="date-picker-length"
        allOptions={networkList.map((e) => e.name)}
        allSelectedPlaceholder={`${networkList.length - 1} selected`}
        selectedData={selectedNetworkList?.map((e) => networkList.find((network) => network.id === e)?.name || [])}
        onFilterChange={(data) => {
          if (networkList.length === data.length) {
            showAckErrorMessage({ message: 'All Networks cannot be selected' });
          }
          const selectedNetworks = data.map((e) => networkList.find((n) => n.name === e)?.id);
          data.length < networkList.length && onChange(selectedNetworks);
        }}
        id="network"
      />
    );
  })
);

NetworkSelector.propTypes = {
  selectedNetworkList: PropTypes.array,
  onChange: PropTypes.func,
};

export default withStore(NetworkSelector);
