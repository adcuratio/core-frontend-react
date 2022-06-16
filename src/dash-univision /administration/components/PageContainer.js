import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { MainContent } from '../../../components/PageLayout';
import CustomButton from '../../../components/CustomButton';

import AddUserModal from '../content/AddUserModal';
import AddAdvertiserModal from '../content/AddAdvertiserModal';

const LayoutPadding = styled.div`
  padding: 20px 20px 40px;
  background-color: white;
`;

const MainHeading = styled.div`
  font-family: opensans;
  font-size: 24px;
  color: #243643;
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: bold;
`;

const PageContainer = (props) => {
  const {
    userAdministrationTiles,
    advertiserAdministrationTiles,
    uniUserList,
    addAdvertiser,
    univisionStore,
    getAdvertiserList,
    isLoading,
    getAllAgencyRepAPI,
    subAgencyId,
  } = props;

  // const [show, setShow] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [advModal, setAdvModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const onCloseAdvModal = () => {
    setAdvModal(false);
  };

  const handleAdvModalOpen = () => setAdvModal(true);

  const renderUserTableHeader = () => {
    if (userAdministrationTiles?.length) {
      const headerComp = [];
      userAdministrationTiles.forEach((title) => {
        headerComp.push(<th key={title.id}>{title.name}</th>);
      });
      return headerComp;
    }
    return null;
  };

  const renderAdvertiserTableHeader = () => {
    if (advertiserAdministrationTiles?.length) {
      const headerComp = [];
      advertiserAdministrationTiles.forEach((title) => {
        headerComp.push(<th key={title.id}>{title.name}</th>);
      });
      return headerComp;
    }
    return null;
  };

  return (
    <MainContent>
      {activeModal === 'add_agency_modal' || activeModal === 'edit_agency_modal' ? (
        <AddUserModal
          getAllAgencyRepAPI={getAllAgencyRepAPI}
          modalData={modalData}
          showModal={true}
          closeModal={() => setActiveModal(null)}
          univisionStore={univisionStore}
          mode={activeModal === 'add_agency_modal' ? 'add' : 'edit'}
        />
      ) : null}
      <AddAdvertiserModal
        showModal={advModal}
        closeModal={onCloseAdvModal}
        univisionStore={univisionStore}
        getAdvertiserList={getAdvertiserList}
        subAgencyId={subAgencyId}
      />
      <LayoutPadding>
        <div className="flex-container6">
          <MainHeading>User Administration</MainHeading>
          <span className="ml-auto-imp">
            <CustomButton
              type="primary"
              buttonText="Add User"
              buttonClassName="ml10"
              handleButtonClick={() => setActiveModal('add_agency_modal')}
            />
          </span>
          <table className="table table-striped table-wrapper mt10 wrapped-table">
            <thead>
              <tr>{renderUserTableHeader()}</tr>
            </thead>
            <tbody>
              {uniUserList && uniUserList.length
                ? uniUserList?.map((user) => (
                    <tr key={user.id}>
                      <td>{user.first_name || '-'}</td>
                      <td>{user.last_name || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{`${'+1'} ${user.phone}` || '-'}</td>
                      <td>
                        <CustomButton
                          buttonText="Edit"
                          buttonClassName="tradebtn"
                          handleButtonClick={() => {
                            setActiveModal('edit_agency_modal');
                            setModalData(user);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                : !isLoading ?? (
                    <tr>
                      <td className="text-align-center-imp">No Data Found.</td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
        <div className="flex-container6" style={{ marginTop: '60px' }}>
          <MainHeading>Advertiser Administration</MainHeading>
          <span className="ml-auto-imp">
            <CustomButton
              type="primary"
              buttonText="Add Advertiser"
              buttonClassName="ml10"
              handleButtonClick={handleAdvModalOpen}
            />
          </span>
          <table className="table table-striped table-wrapper mt10 wrapped-table">
            <thead>
              <tr>{renderAdvertiserTableHeader()}</tr>
            </thead>
            <tbody>
              {addAdvertiser && addAdvertiser.length
                ? addAdvertiser?.map((a) => (
                    <tr key={a.company.id}>
                      <td>{a.company.name || '---'}</td>
                    </tr>
                  ))
                : !isLoading ?? (
                    <tr>
                      <td className="text-align-center-imp">No Data Found.</td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </LayoutPadding>
    </MainContent>
  );
};

PageContainer.propTypes = {
  userAdministrationTiles: PropTypes.array,
  advertiserAdministrationTiles: PropTypes.array,
  notificationAdministrationTiles: PropTypes.array,
  uniUserList: PropTypes.array,
  addAdvertiser: PropTypes.array,
  univisionStore: PropTypes.object,
  getAdvertiserList: PropTypes.func,
  isLoading: PropTypes.any,
  getAllAgencyRepAPI: PropTypes.func,
  subAgencyId: PropTypes.any,
};

export default PageContainer;
