import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { Panel } from "react-bootstrap";

import { PageTitle } from "../../components/Typography";
import { MainContent, PageHeader } from "../../components/PageLayout";
import CustomButton from "../../components/CustomButton";
import {
  MainWrapper,
  LeftWrapper,
  HeaderWrapper,
  Title,
} from "../../components/ops-user-flow/UserFlowLayout";
import ReactLoader from "../../components/ReactLoader";

import { showAckErrorMessage } from "../../common/utils";

import AddModal from "./containers/AddModal";

//import withStore from '../../hocs/WithStore';

const UnivisionManageNetwork = inject(
  "networkStore",
  "uiStore"
)(
  observer((props) => {
    const { networkStore, uiStore } = props;

    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showList, setShowList] = useState([]);
    const [activeModal, setActiveModal] = useState("");

    const getAllChannels = () => {
      networkStore.getAllChannels().then(
        (res) => {
          handleAPIErrors(res);
          closeModal();
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleRefreshOnSuccessChannel = () => {
      getAllChannels();
    };

    const handleRefreshOnSuccessShow = (show) => {
      const showListCpy = JSON.parse(JSON.stringify(showList));
      showListCpy.push(show);
      setShowList(showListCpy);
      closeModal();
    };

    const closeModal = () => {
      setActiveModal("");
    };

    const handleAPIErrors = (res) => {
      if (res && res.status === 200) {
        if (res.data && res.data.success === false) {
          if (res.data.message) {
            showAckErrorMessage({ message: res?.data?.message });
          } else {
            showAckErrorMessage();
          }
        }
      } else
        showAckErrorMessage({
          message: res?.data?.message ?? "Unable to fetch Networks!",
        });
    };

    useEffect(() => {
      getAllChannels();
    }, []);
    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Manage Networks and Shows</PageTitle>
        </PageHeader>
        <MainWrapper className="row">
          <LeftWrapper className="col-md-6">
            <HeaderWrapper>
              <Title className="m10">All Networks</Title>
              <CustomButton
                type="primary"
                buttonClassName="m10 min-width-fit-content"
                buttonText="Add a network"
                handleButtonClick={() => setActiveModal("network")}
              ></CustomButton>
            </HeaderWrapper>

            {networkStore.networkData.channels
              ? networkStore.networkData.channels.map((channel, index) => (
                  <Panel
                    eventKey={index}
                    key={index}
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowList(channel.show);
                    }}
                    className="mb10 ml10 mr10 mt10 word-break"
                  >
                    <Panel.Heading>
                      <Panel.Title toggle>{channel.display_name}</Panel.Title>
                    </Panel.Heading>
                  </Panel>
                ))
              : !uiStore.isLoading && <p>No networks found</p>}
          </LeftWrapper>
          <div className="col-md-6">
            <HeaderWrapper>
              {selectedChannel ? (
                <>
                  <Title className="word-break-break-word m10">
                    Shows for {selectedChannel.display_name}
                  </Title>
                  <CustomButton
                    type="primary"
                    buttonClassName="m10 min-width-fit-content align-self-flex-start"
                    buttonText="Add a new show"
                    handleButtonClick={() => setActiveModal("show")}
                  ></CustomButton>
                </>
              ) : null}
            </HeaderWrapper>
            {showList?.length
              ? showList.map((show, index) => (
                  <Panel
                    eventKey={index}
                    key={index}
                    className="mb10 ml10 mr10 mt10 word-break"
                  >
                    <Panel.Heading>
                      <Panel.Title toggle>
                        <span>{show.name}</span>
                      </Panel.Title>
                    </Panel.Heading>
                  </Panel>
                ))
              : !uiStore.isLoading &&
                selectedChannel && (
                  <p className="text-align-center">No shows found</p>
                )}
          </div>
        </MainWrapper>

        {activeModal === "network" && (
          <AddModal
            showModal={true}
            activeModal={activeModal}
            closeModal={closeModal}
            selectedChannel={selectedChannel}
            handleRefreshOnSuccess={handleRefreshOnSuccessChannel}
          ></AddModal>
        )}

        {activeModal === "show" && (
          <AddModal
            showModal={true}
            activeModal={activeModal}
            closeModal={closeModal}
            selectedChannel={selectedChannel}
            handleRefreshOnSuccess={handleRefreshOnSuccessShow}
          ></AddModal>
        )}
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default UnivisionManageNetwork;
