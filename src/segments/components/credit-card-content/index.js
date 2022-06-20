import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AvailableFiltersModal from '../available-filters-modal';

const CreditCardContent = (props) => {
  const { filtersForCredit, handleUserInputFunc, handleTabChangeFunc, handleSelectAllOrNoneFunc } = props;

  const [availableFiltersModal, setAvailableFiltersModal] = useState(false);

  const toggleAvailableFiltersModal = () => {
    setAvailableFiltersModal(!availableFiltersModal);
    document.activeElement.blur();
  };

  const userInputHandler = (title, selectedValue) => {
    const temp = [filtersForCredit, title, selectedValue];
    handleUserInputFunc(temp, 'credit');
  };

  return (
    <div>
      <form>
        <div className="form-container segment-credit-container-height">
          <div className="input-dir-wrapper form-row">
            {filtersForCredit.filters.map((filter) => {
              if (filter.field_type === 'checkbox' && filter.isFilterSelected) {
                return (
                  <div className="col-md-6 mb20 target-segment-fields" key={filter.filter_name}>
                    <div className="form-title">
                      {filter.title}&nbsp;&nbsp;&nbsp;
                      <span
                        className="glyphicon glyphicon-remove"
                        onClick={() => handleTabChangeFunc(filtersForCredit, filter, 'credit')}
                      ></span>
                    </div>
                    <div>
                      {filter.options.map((val) => (
                        <div key={val.val} role="button" onClick={() => userInputHandler(filter, val)}>
                          <div className="checkbox-inline mb5">
                            <label className="checkbox-inline">
                              <input
                                type="checkbox"
                                onChange={() => userInputHandler(filter, val)}
                                checked={val.isValueSelected}
                              />
                              <span className="v-align-middle"></span>
                              <span className="dropdown-text checkbox-text active v-align-middle">{val.val}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div style={{ maxWidth: 250 }}>
            <div className="add-category-tab">
              <a href="" className="add-filters" onClick={toggleAvailableFiltersModal}>
                Add/Remove Filters
              </a>
            </div>
          </div>
        </div>
      </form>

      <AvailableFiltersModal
        showModal={availableFiltersModal}
        toggleModal={toggleAvailableFiltersModal}
        handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
        handleTabChangeFunc={handleTabChangeFunc}
        filterData={filtersForCredit}
        type="credit"
      />
    </div>
  );
};

CreditCardContent.propTypes = {
  filtersForCredit: PropTypes.object,
  handleTabChangeFunc: PropTypes.func,
  handleUserInputFunc: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
};

export default CreditCardContent;
