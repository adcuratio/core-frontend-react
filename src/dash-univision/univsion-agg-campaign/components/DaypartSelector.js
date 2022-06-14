import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';

import AggPickyFilter from './PickyAgg';
import { showAckErrorMessage } from '../../../common/utils';

const DaypartSelector = inject('aggCampaignStore')(
  observer((props) => {
    const { selectedDaypartList, onChange, aggCampaignStore } = props;
    const daypartList = toJS(aggCampaignStore.daypartList);

    return (
      <AggPickyFilter
        includeSelectAll={false}
        className="date-picker-length "
        allOptions={daypartList.map((e) => e.name)}
        allSelectedPlaceholder={`${daypartList.length - 1} selected`}
        selectedData={selectedDaypartList?.map((e) => daypartList.find((day_parts) => day_parts.id === e)?.name || [])}
        onFilterChange={(data) => {
          if (daypartList.length === data.length) {
            showAckErrorMessage({ message: 'All Dayparts cannot be selected' });
          }
          const selectedDaypart = data.map((e) => daypartList.find((n) => n.name === e)?.id);
          data.length < daypartList.length && onChange(selectedDaypart);
        }}
        id="day_parts"
      />
    );
  })
);

DaypartSelector.propTypes = {
  selectedDaypartList: PropTypes.array,
  onChange: PropTypes.func,
};

export default withStore(DaypartSelector);
