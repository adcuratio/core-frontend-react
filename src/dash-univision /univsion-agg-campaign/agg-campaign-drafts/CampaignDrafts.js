import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

//import withStore from '../../../hocs/WithStore';

import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../../components/PageLayout";
import { PageTitle } from "../../../components/Typography";
import {
  showAckMessage,
  showAckErrorMessage,
  processUTCtoEST,
} from "../../../common/utils";
import ReactLoader from "../../../components/ReactLoader";
import CustomButton from "../../../components/CustomButton";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../../routes/NavigationService";

const CampaignDrafts = inject(
  "uiStore",
  "companyStore",
  "campaignStore",
  "aggCampaignStore"
)(
  observer((props) => {
    const { uiStore, aggCampaignStore } = props;
    let navigate = useNavigate();
    let navigationService = new NavigationService(navigate);

    const [campaignTableData, setCampaignTableData] = useState([]);
    const [toggleModal, setToggleModal] = useState(false);
    const [toggleEditModal, setToggleEditModal] = useState(false);
    const [deleteCampaignData, setDeleteCampaignData] = useState({});

    useEffect(() => {
      getAllCampaignData();
      return () => {
        setCampaignTableData({});
      };
    }, []);

    const closeModal = () => {
      setToggleModal(false);
      setToggleEditModal(false);
    };

    const onSelectDelete = (data) => {
      setDeleteCampaignData(data);
      setToggleModal(true);
    };

    const onSelectEdit = (data) => {
      setDeleteCampaignData(data);
      setToggleEditModal(true);
    };

    const onConfirmDelete = () => {
      aggCampaignStore.deleteCampaignDraft(deleteCampaignData?.id).then(
        (res) => {
          if (res?.data?.success) {
            showAckMessage({ message: "Campaign Deleted successfully" });
            getAllCampaignData();
            setDeleteCampaignData({});
            setToggleModal(false);
          } else {
            showAckErrorMessage({ message: "Something went wrong" });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAllCampaignData = () => {
      aggCampaignStore.getCampaignDratfs().then(
        (res) => {
          if (res?.data?.success) {
            setCampaignTableData(res?.data?.message);
          } else {
            showAckErrorMessage({ message: "Something went wrong" });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Campaign Drafts</PageTitle>
        </PageHeader>
        <PageContent>
          <table className="table table-striped table-wrapper mt20 wrapped-table table-elem-center">
            <thead>
              <tr>
                <th>Advertiser</th>
                <th>Campaign Name</th>
                <th>Campaign Creation Date</th>
                <th>Order type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaignTableData.length > 0 && !uiStore.isloading ? (
                campaignTableData?.map((data, index) => (
                  <tr key={`draft_table_data_${index}`}>
                    <td>{data?.adv_company?.name}</td>
                    <td>{data?.campaign_data?.name}</td>
                    <td>
                      {data.created
                        ? `${processUTCtoEST(data?.created)} ET`
                        : "N/A"}
                    </td>
                    <td>{data?.campaign_data?.order_type}</td>
                    <td>
                      <CustomButton
                        buttonText="Edit"
                        buttonClassName="tradebtn"
                        handleButtonClick={() => onSelectEdit(data)}
                      />
                      <CustomButton
                        buttonText="Delete"
                        buttonClassName="tradebtn"
                        handleButtonClick={() => onSelectDelete(data)}
                      />
                    </td>
                  </tr>
                ))
              ) : !uiStore.isloading && campaignTableData.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div key="no_data_found" className="text-fixed-position">
                      No data found
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </PageContent>
        <Modal show={toggleModal} onHide={closeModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div className="mt10 mb10">{`Are you sure you want to delete draft campaign ${deleteCampaignData?.campaign_data?.name} ?`}</div>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton
              buttonClassName="capitalize"
              type="primary"
              buttonText={`Yes`}
              handleButtonClick={() => onConfirmDelete()}
            />
            <CustomButton
              type="secondary"
              buttonText="Close"
              buttonClassName="ml10"
              handleButtonClick={closeModal}
            />
          </Modal.Footer>
        </Modal>
        <Modal show={toggleEditModal} onHide={closeModal}>
          <Modal.Header closeButton>Edit draft campaign</Modal.Header>
          <Modal.Body>
            <div className="mt10 mb10">{`Are you sure you want to edit campaign ${deleteCampaignData?.campaign_data?.name} ?`}</div>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton
              buttonClassName="capitalize"
              type="primary"
              buttonText={`Yes`}
              handleButtonClick={() =>
                navigationService.goToAggCampaign("draft", deleteCampaignData)
              }
            />
            <CustomButton
              type="secondary"
              buttonText="Close"
              buttonClassName="ml10"
              handleButtonClick={closeModal}
            />
          </Modal.Footer>
        </Modal>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

CampaignDrafts.prototypes = {
  companyStore: PropTypes.object,
  uiStore: PropTypes.object,
  campaignStore: PropTypes.object,
  util: PropTypes.object,
};

export default CampaignDrafts;
