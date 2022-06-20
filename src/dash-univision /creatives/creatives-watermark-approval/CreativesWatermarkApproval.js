import React, { useState, useEffect, useRef } from "react";
import { inject, observer } from "mobx-react";

import CreativesAdPreviewModal from "../../../components/CreativesAdPreviewModal";
import { MainContent, PageHeader } from "../../../components/PageLayout";
import { PageTitle } from "../../../components/Typography";
import CustomButton from "../../../components/CustomButton";
import ReactLoader from "../../../components/ReactLoader";

import NetworkCreativesTableContainer from "../../../components/network-creatives/creatives-watermark-approval/NetworkCreativesTableContainer";
import NetworkCreativesTabs from "../../../components/network-creatives/creatives-watermark-approval/NetworkCreativesTabs";
import QAModal from "../../../components/network-creatives/creatives-watermark-approval/QAModal";

import { showAckErrorMessage, showAckMessage } from "../../../common/utils";
import { NetworkCreativesTabData, manageHeaderList } from "./JsonData";

const WatermarkCreatives = inject(
  "creativesStore",
  "uiStore"
)(
  observer((props) => {
    const { uiStore, creativesStore } = props;
    const [creativesList, setCreativesList] = useState([]);
    const [selectedTab, setSelectedTab] = useState(NetworkCreativesTabData[0]);
    const [headerList, setHeaderList] = useState(() =>
      manageHeaderList(NetworkCreativesTabData[0].id)
    );
    const [activeModal, setActiveModal] = useState("");
    const [creativeModalData, setCreativeModalData] = useState({});
    const [modalData, setModalData] = useState({});
    const tableRef = useRef(null);
    const [nextPageUrl, setNextPageUrl] = useState("");

    const processCreatives = (res) => {
      const creativesList = res.data.data.results.map((creative) => {
        // Deep-copy
        const creativeCpy = JSON.parse(JSON.stringify(creative));
        creativeCpy.actual_duration = creative.actual_duration.toString();
        return creativeCpy;
      });
      return creativesList;
    };

    const getCreatives = (tab, url) => {
      const tabName = tab.id.split("_")[2];
      creativesStore.getCreativesForQA(tabName, url).then(
        (response) => {
          if (response.status === 200) {
            if (selectedTab.id !== tab.id) {
              setSelectedTab(tab);
              const headers = manageHeaderList(tab.id);
              setHeaderList(headers);
            }

            setNextPageUrl(response.data?.data?.next);

            const processedCreatives = processCreatives(response);
            let concatenatedArray;

            if (url) {
              const creativesListCpy = JSON.parse(
                JSON.stringify(creativesList)
              );
              const processedCreativesCpy = JSON.parse(
                JSON.stringify(processedCreatives)
              );
              concatenatedArray = [
                ...creativesListCpy,
                ...processedCreativesCpy,
              ];
            } else {
              concatenatedArray = JSON.parse(
                JSON.stringify(processedCreatives)
              );
              scrollToTop();
            }

            setCreativesList(concatenatedArray);
          } else {
            showAckErrorMessage({ message: "Can't fetch creatives list." });
          }
        },
        () => {
          showAckErrorMessage({
            message: "something went wrong with creatives list.",
          });
        }
      );
    };

    useEffect(() => {
      getCreatives(selectedTab);
    }, []);

    const onTabChange = (_tab) => {
      const _newTab = _tab ? _tab : NetworkCreativesTabData[0];
      getCreatives(_newTab);
    };

    const getTabFromTabId = (input_id) => {
      const index = NetworkCreativesTabData.findIndex(
        (tab) => tab?.id === input_id
      );
      if (index === -1) {
        return NetworkCreativesTabData[0];
      } else return NetworkCreativesTabData[index];
    };

    const handlePagination = () => {
      getCreatives(selectedTab, nextPageUrl);
    };

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    const playVideo = (adid) => {
      const _creativeModalData = { showModal: true, selectedAdid: adid };
      if (adid) {
        creativesStore.getWatermarkedVideoUrl(adid.id).then(
          (res) => {
            if (res.data) {
              if (res.data.success && res.data.data) {
                _creativeModalData.selectedAdid = res.data.data;
                setCreativeModalData(_creativeModalData);
                onSetActiveModal("viewCreative");
              } else
                showAckErrorMessage({
                  message: res.data?.message
                    ? res.data?.message
                    : "No data present on server.",
                });
            } else
              showAckErrorMessage({ message: "No data returned from server." });
          },
          () =>
            showAckErrorMessage({
              message: "Cannot get video file data for the creative.",
            })
        );
      } else {
        showAckErrorMessage({ message: "No creative data available." });
      }
    };

    const handleModalAction = (buttonType, mData) => {
      if (buttonType === "viewCreative") {
        playVideo(mData);
      } else if (buttonType === "qa_approve" || buttonType === "qa_decline") {
        setModalData(mData);
        onSetActiveModal(buttonType);
      }
    };

    const downloadWatermarkedFile = (mData) => {
      if (mData.downloadURL) {
        const downloadLink = document.createElement("a");
        downloadLink.href = mData.downloadURL;
        downloadLink.download = mData.file_name_mxf
          ? mData.file_name_mxf
          : mData.identifier;
        downloadLink.click();
      } else showAckErrorMessage({ message: "No file found on server." });
    };

    const handleDownloadAction = (mData, id) => {
      if (id === "watermarkFile") {
        const _creativeData = JSON.parse(JSON.stringify(mData));
        if (mData) {
          creativesStore.getWatermarkedVideoDownloadUrl(mData.id).then(
            (res) => {
              if (res.data) {
                if (res.data.success && res.data.data) {
                  _creativeData.downloadURL = res.data.data;
                  downloadWatermarkedFile(_creativeData);
                } else showAckErrorMessage({ message: res.data?.message });
              } else showAckErrorMessage();
            },
            () =>
              showAckErrorMessage({
                message: "Cannot get video file data for the creative.",
              })
          );
        } else {
          showAckErrorMessage({ message: "No creative data available." });
        }
      } else if (id === "WatermarkOrigin") {
        const _creativeData = JSON.parse(JSON.stringify(mData));
        if (mData) {
          creativesStore
            .getWatermarkedVideoDownloadUrl(mData.original_ad_id)
            .then(
              (res) => {
                if (res.data) {
                  if (res.data.success && res.data.data) {
                    _creativeData.downloadURL = res.data.data;
                    downloadWatermarkedFile(_creativeData);
                  } else
                    showAckErrorMessage({
                      message:
                        res.data?.message ??
                        "Cannot get video file for the creative.",
                    });
                } else showAckErrorMessage();
              },
              () =>
                showAckErrorMessage({
                  message: "Cannot get video file data for the creative.",
                })
            );
        } else {
          showAckErrorMessage({ message: "No creative data available." });
        }
      }
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const onHandleAction = (buttonType, mData) => {
      if (buttonType === "qa_approve") {
        onApproveQA(buttonType, mData);
      } else if (buttonType === "qa_decline") {
        onDeclineQA(buttonType, mData);
      }
    };

    const onApproveQA = (actionType, cr_data) => {
      if (actionType !== "qa_approve") return null;
      const payload = { status: 4, comment: "" };

      creativesStore
        .watermarkQA(payload, cr_data.creative_watermark[0]?.id)
        .then(
          (res) => {
            if (res && res.status === 200 && res.data?.success) {
              getCreatives(getTabFromTabId("nt_cr_approved"));
              showAckMessage({ message: "Confirmed successfully." });
              setActiveModal("");
            } else {
              showAckErrorMessage({ message: res.data.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
    };

    const onDeclineQA = (actionType, cr_data) => {
      if (actionType !== "qa_decline") return null;
      const payload = {
        status: 1,
        comment: "Watermark strength is too bright",
      };

      creativesStore
        .watermarkQA(payload, cr_data.creative_watermark[0]?.id)
        .then(
          (res) => {
            if (res && res.status === 200 && res.data?.success) {
              showAckMessage({ message: "Declined successfully." });
              getCreatives(getTabFromTabId("nt_cr_declined"));
              setActiveModal("");
            } else {
              showAckErrorMessage({ message: res.data.message });
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
          <PageTitle>Creatives - Watermark Approval</PageTitle>
        </PageHeader>

        <div className="flex-container2 nav-tabs">
          <NetworkCreativesTabs
            tabData={NetworkCreativesTabData}
            activeTab={selectedTab}
            onTabChange={onTabChange}
          ></NetworkCreativesTabs>
          <div className="flex-container1">
            <CustomButton
              type="primary"
              buttonText="Refresh"
              handleButtonClick={() => getCreatives(selectedTab)}
              buttonClassName="mr10"
            ></CustomButton>
          </div>
        </div>

        <NetworkCreativesTableContainer
          creativesFilteredData={creativesList}
          manageCreativesTableTitles={headerList}
          isLoading={uiStore.isLoading}
          selectedTab={selectedTab}
          handleModalAction={handleModalAction}
          handleDownloadAction={handleDownloadAction}
          handlePagination={handlePagination}
          tableRef={tableRef}
          nextPageUrl={nextPageUrl}
        />

        {activeModal === "viewCreative" ? (
          <CreativesAdPreviewModal
            showModal={true}
            closeModal={() => onSetActiveModal("")}
            creativeModalData={
              creativeModalData && creativeModalData.selectedAdid
            }
          />
        ) : null}

        {activeModal === "qa_approve" || activeModal === "qa_decline" ? (
          <QAModal
            showModal={
              activeModal === "qa_approve" || activeModal === "qa_decline"
            }
            closeModal={() => onSetActiveModal("")}
            modalData={modalData}
            modalType={activeModal}
            modalClass="w600p"
            onHandleAction={onHandleAction}
          />
        ) : null}

        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default WatermarkCreatives;
