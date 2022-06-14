import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import withStore from '../../../hocs/WithStore';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
import { MainContent, PageHeader, PageContent } from '../../../components/PageLayout';
import { PageTitle, PaneTitle } from '../../../components/Typography';
import { getEntityType, showAckErrorMessage } from '../../../common/utils';
import CustomButton from '../../../components/CustomButton';
import ReactLoader from '../../../components/ReactLoader';

const SelectWrapper = styled.div`
  width: 150px;
  margin: auto;

  .transparent {
    background-color: transparent;
    border: none;
  }
`;
const NextBtn = styled.div`
  .msg-grp-next-btn {
    margin: auto;
    margin-top: 20px;
    display: block;
    min-width: 100px;
  }
`;

const CreateNewAudience = inject(
  'univisionStore',
  'uiStore'
)(
  observer((props) => {
    const { univisionStore, navigationService, uiStore } = props;
    const [companiesData, setCompaniesData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState();
    const [selectedCompanyName, setSelectedCompanyName] = useState();

    useEffect(() => {
      univisionStore.getAdvertiserListData().then(
        (res) => {
          if (res && res?.status === 200) {
            setCompaniesData(res?.data?.data);
          } else {
            showAckErrorMessage({ message: 'Failed to load Advertisers' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    }, []);

    const handleEntitySelection = (company) => {
      setSelectedCompany(company);
      setSelectedCompanyName(company.company.name);
    };

    const handleSubmit = () => {
      if (selectedCompany) {
        navigationService.goToUnivisionSelectAudience(
          selectedCompany?.company.id,
          selectedCompany.company,
          getEntityType(selectedCompany.company),
          selectedCompany,
          selectedCompanyName
        );
      } else {
        showAckErrorMessage({ message: 'Please select the Advertiser.' });
      }
    };

    return (
      <>
        <MainContent>
          <PageHeader>
            <PageTitle className="mt5 ml10">Build New Audience</PageTitle>
          </PageHeader>
          <PageContent>
            <div className="main-content-wrapper">
              <div className="mt15 mb15">
                <PaneTitle>Create New Audience for Univision Addressable</PaneTitle>
                <div className="flex-container2">
                  <SelectWrapper>
                    <ButtonToolbar className="segment-dropdown-btn">
                      <DropdownButton
                        className="dropdownSeg"
                        title={selectedCompanyName || 'Select Advertiser'}
                        id="company_name"
                      >
                        {companiesData?.length > 0 &&
                          companiesData?.map((c) => (
                            <MenuItem key={c.company.id} onSelect={() => handleEntitySelection(c)}>
                              {c.company.name}
                            </MenuItem>
                          ))}
                      </DropdownButton>
                    </ButtonToolbar>
                  </SelectWrapper>
                </div>
                <NextBtn>
                  <CustomButton
                    buttonText="Next"
                    type="primary"
                    buttonClassName="msg-grp-next-btn"
                    handleButtonClick={() => handleSubmit()}
                  />
                </NextBtn>
              </div>
            </div>
            <ReactLoader isLoading={uiStore.isLoading} />
          </PageContent>
        </MainContent>
      </>
    );
  })
);

export default withStore(CreateNewAudience);
