import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { FormControl } from 'react-bootstrap';

import { showAckErrorMessage, formatText } from '../../../../common/utils';

import CustomButton from '../../../../components/CustomButton';

export const StyledDrpDwn = styled.div`
  .company-selection-btn {
    min-width: 100px;
  }
  .company-feedback-input {
    background-color: transparent;
    height: 35px;
    min-width: 150px;
    border: none;
  }
  .company-select-icon {
    position: absolute;
    right: 10px;
    top: 40%;
    pointer-events: none;
    width: auto;
  }
  .company-selection-wrapper {
    width: 200px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
  }
`;

const CompanySelection = inject(
  'companyStore',
  'campaignStore'
)(
  observer((props) => {
    const { afterValidation, handleChange, selectedCompanyData, companyStore, campaignStore } = props;

    const handleSubmit = (event) => {
      const advertiserDataCpy = { ...selectedCompanyData };
      if (advertiserDataCpy?.companyId === 'other' && formatText(advertiserDataCpy?.addadvertiserFreeText)) {
        afterValidation();
      } else if (selectedCompanyData?.companyId > 0) {
        campaignStore.prepareNCMData(); // Required??
        afterValidation();
      } else showAckErrorMessage({ message: 'Please select an advertiser first.' });
      event.preventDefault();
    };

    const companies = companyStore.companies;
    return (
      <StyledDrpDwn className="mt15 mb15 text-center">
        <div className="company-selection-wrapper mt10">
          <select
            value={selectedCompanyData?.companyId}
            onChange={(e) => handleChange(e, 'select_company')}
            className="company-feedback-input"
          >
            <option value="0" disabled>
              {companies?.length > 0 ? 'Select an Advertiser' : 'Loading advertisers'}
            </option>
            {companies?.map((c) => (
              <option key={c.company.id} value={c.company.id}>
                {c.company.name}
              </option>
            ))}
          </select>
          {selectedCompanyData?.companyId === 'other' && (
            <>
              <FormControl
                className="mt10"
                type="text"
                value={selectedCompanyData?.addadvertiserFreeText}
                onChange={(e) => handleChange(e, 'free_form_text')}
                placeholder="Enter free form text"
              />
            </>
          )}
          <span className="company-select-icon" />
        </div>
        <CustomButton
          type="primary"
          buttonText="Next"
          buttonClassName="company-selection-btn mt20"
          handleButtonClick={handleSubmit}
        />
      </StyledDrpDwn>
    );
  })
);

CompanySelection.propTypes = {
  afterValidation: PropTypes.func,
  handleChange: PropTypes.func,
  selectedCompanyData: PropTypes.object,
  campaignStore: PropTypes.object,
  companyStore: PropTypes.object,
};

CompanySelection.defaultProps = {
  afterValidation: () => {},
  handleChange: () => {},
  selectedCompanyData: {},
};
export default CompanySelection;
