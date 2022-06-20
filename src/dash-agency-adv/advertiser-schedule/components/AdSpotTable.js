import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';

import CheckBox from '../../../components/CheckBox';

const TableWrapper = styled(Table)`
  tbody > tr > td {
    border-top: 0 !important;
  }

  label {
    padding-left: 20px !important;
    margin: 0 auto !important;
  }
  .checkmark {
    position: relative;
  }
`;

const AdSpotTable = (props) => {
  const { adSpotList, onSelectDealFile, isLoading } = props;
  return (
    <TableWrapper striped condensed className="table-wrapper wrapped-table">
      <thead>
        <tr>
          <th>Select</th>
          <th>Spot USN</th>
          <th>Flighting Dates</th>
          <th>Ad Spot Date</th>
        </tr>
      </thead>
      <tbody>
        {adSpotList?.map((spot, id) => (
          <tr key={id}>
            <td>
              <CheckBox
                key={spot.adspot_id}
                label={''}
                isChecked={spot.isSelected || false}
                value={spot.adspot_id}
                onChangeFunction={() => onSelectDealFile(spot)}
              />
            </td>
            <td>{spot.adspot_id}</td>
            <td>{spot.flighting_dates}</td>
            <td>{spot.adspot_date}</td>
          </tr>
        ))}
        {!adSpotList.length && !isLoading ? (
          <tr>
            <td colSpan={4}>
              <p className="text-center">No Data Found</p>
            </td>
          </tr>
        ) : null}
      </tbody>
    </TableWrapper>
  );
};

AdSpotTable.propTypes = {
  adSpotList: PropTypes.array,
  onSelectDealFile: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

AdSpotTable.deafultProps = {
  adSpotList: [],
  isLoading: false,
};

export default AdSpotTable;
