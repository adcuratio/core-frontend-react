import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CustomButton from '../../../components/CustomButton';

const ThumbnailWrapper = styled.div`
  width: 100px;
  max-width: 100%;
  max-height: 100%;
`;

const ThumbnailImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const TableContainer = styled.div`
  height: 80vh;
  overflow: auto;
`;

const ManageCreativesTableContainer = (props) => {
  const { manageCreativesTableTitles, filteredCreativesData, isLoading, handleModalAction } = props;

  return (
    <TableContainer>
      <table id="table_top" className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
        <thead>
          <tr>
            {manageCreativesTableTitles?.map((heading) => (
              <th key={heading.id}>
                <span className="mr10">{heading.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCreativesData?.map((res) => (
            <tr key={res.id}>
              <td>
                <ThumbnailWrapper
                  className="video-thumbnail video-thumbnail-big"
                  onClick={() => handleModalAction('viewCreative', res)}
                >
                  <ThumbnailImage src={res.s3_thumbnail_url} />
                </ThumbnailWrapper>
              </td>
              <td>{res.company_name || '---'}</td>
              <td>{res.brand_name || '---'}</td>
              <td>{res.ad_name || '---'}</td>
              <td className="no-text-transform">{res.identifier || '---'}</td>
              <td>{res.inventory_owner || '---'}</td>

              <td className="no-text-transform">{res.asset_id || '---'}</td>
              <td>{res.ad_type || '---'}</td>
              <td>{res.order_type[0] || '---'}</td>

              <td>{res.delivery_vendor || '---'}</td>
              <td>{`${res.actual_duration} sec` || '---'}</td>
              <td>
                {res.is_received.length ? ( // Show text for confirmation if present else show confirm button
                  res.creative_received
                ) : (
                  <CustomButton
                    buttonText="Confirm Receipt"
                    handleButtonClick={() => handleModalAction('operatorAck', res)}
                    buttonClassName="tradebtn height-auto-imp"
                  ></CustomButton>
                )}
              </td>
              <td>
                {res?.is_encoded?.length ? ( // Show text for confirmation if present else show confirm button
                  res?.encoding_received
                ) : (
                  <CustomButton
                    buttonText="Confirm Encoding"
                    handleButtonClick={() => handleModalAction('encoding', res)}
                    buttonClassName="tradebtn height-auto-imp"
                  ></CustomButton>
                )}
              </td>
            </tr>
          ))}
          {!(filteredCreativesData && filteredCreativesData.length) && !isLoading ? (
            <tr key="no_data_found">
              <td colSpan={manageCreativesTableTitles.length} className="text-center-imp">
                No data available.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </TableContainer>
  );
};

ManageCreativesTableContainer.propTypes = {
  manageCreativesTableTitles: PropTypes.array,
  filteredCreativesData: PropTypes.array,
  isLoading: PropTypes.bool,
  confirmCreative: PropTypes.func,
  creativePreview: PropTypes.func,
  handleModalAction: PropTypes.func,
  handlePagination: PropTypes.func,
  searchValue: PropTypes.string,
  sortGroup: PropTypes.func,
};

ManageCreativesTableContainer.defaultProps = {
  handleModalAction: () => {},
  searchValue: '',
};

export default ManageCreativesTableContainer;
