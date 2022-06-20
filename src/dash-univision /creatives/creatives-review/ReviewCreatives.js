import React, { useState, useEffect, useRef } from "react";
import { inject, observer } from "mobx-react";

import CreativesAdPreviewModal from "../../../components/CreativesAdPreviewModal";
import { MainContent, PageHeader } from "../../../components/PageLayout";
import { PageTitle } from "../../../components/Typography";
import CustomButton from "../../../components/CustomButton";
import ReactLoader from "../../../components/ReactLoader";

import NetworkCreativesTableContainer from "../../../components/network-creatives/creatives-review/components/NetworkCreativesTableContainer";
import NetworkCreativesTabs from "../../../components/network-creatives/creatives-review/components/NetworkCreativesTabs";
import EditModal from "../../../components/network-creatives/creatives-review/containers/EditModal";
import DeclineModal from "../../../components/network-creatives/creatives-review/containers/DeclineModal";

import {
  processUTCtoEST,
  showAckErrorMessage,
  showAckMessage,
} from "../../../common/utils";
import {
  NetworkCreativesTabData,
  manageHeaderList,
  declineCodes,
} from "./JsonData";

const ReviewCreatives = inject(
  "networkStore",
  "creativesStore",
  "uiStore"
)(
  observer((props) => {
    const { networkStore, uiStore, creativesStore } = props;
    const [channels, setChannels] = useState([]);
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

    const processCreatives = (res, tabName) => {
      const creativesList = res.data.data.results.map((creative) => {
        // Deep-copy
        const creativeCpy = JSON.parse(JSON.stringify(creative));

        creativeCpy.actual_duration =
          creative.adid_meta_file_upload?.[0]?.actual_duration.toString() ??
          "0";

        if (tabName === "approved") {
          // Prepare the daypart approval object for the creative under approved tab.
          if (
            creativeCpy?.adid_meta_file_upload?.[0]?.status_list
              ?.channel_daypart_approved_list &&
            creativeCpy?.adid_meta_file_upload?.[0]?.status_list
              ?.channel_daypart_approved_list.length
          ) {
            creativeCpy.channelDaypartApprovedList =
              creativeCpy.adid_meta_file_upload[0].status_list.channel_daypart_approved_list;
            creativeCpy.approvedChannelsAndDayparts = [];

            creativeCpy.adid_meta_file_upload[0].status_list.channel_daypart_approved_list.forEach(
              (stchannel) => {
                const obj = { channelName: "", dayparts: "" };
                const keysList = Object.keys(stchannel);
                obj.channelName = stchannel[keysList[0]][0].channel_name;
                const dayparts = stchannel[keysList[0]];

                if (dayparts && dayparts.length) {
                  obj.dayparts = dayparts
                    .map((d) => {
                      if (d && d.daypart) {
                        const details = `${d.daypart.name} (${getDaypartInfo(
                          d.daypart
                        )})`;
                        return details;
                      }
                      return "";
                    })
                    .join("\n ");
                }
                creativeCpy.approvedChannelsAndDayparts.push(obj);
              }
            );
          }
        }

        if (tabName === "declined") {
          // Prepare keys for the creative under declined tab.
          creativeCpy.declineComment = `${
            creativeCpy.adid_meta_file_upload?.[0]?.status_list?.declined?.[0]
              ?.comment ?? "-"
          }`;
          creativeCpy.declinedAt = creativeCpy.adid_meta_file_upload?.[0]
            ?.status_list?.declined?.[0]?.modified
            ? processUTCtoEST(
                creativeCpy.adid_meta_file_upload[0].status_list.declined[0]
                  .modified
              )
            : "-";
          creativeCpy.declinedBy = `${
            creativeCpy.adid_meta_file_upload?.[0]?.status_list?.declined?.[0]
              ?.first_name ?? "-"
          } ${
            creativeCpy.adid_meta_file_upload?.[0]?.status_list?.declined?.[0]
              ?.last_name ?? "-"
          }`;
        }

        return creativeCpy;
      });

      return creativesList;
    };

    const getCreatives = (tab, url) => {
      const tabName = tab.id.split("_")[2];
      networkStore.getCreativesForReview(tabName, url).then(
        (response) => {
          if (response.status === 200) {
            if (selectedTab.id !== tab.id) {
              setSelectedTab(tab);
              const headers = manageHeaderList(tab.id);
              setHeaderList(headers);
            }

            setNextPageUrl(response.data?.data?.next);

            const processedCreatives = processCreatives(response, tabName);
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
      networkStore.getAllChannels().then(
        (res) => {
          if (res && res.status === 200) {
            if (res.data?.success) {
              setChannels(res.data?.data[0]?.channels);
              getCreatives(selectedTab);
            } else showAckErrorMessage({ message: res?.data?.message });
          } else
            showAckErrorMessage({
              message: res?.data?.message ?? "Unable to fetch Creative List!",
            });
        },
        () => {
          showAckErrorMessage();
        }
      );
    }, []);

    const getDaypartInfo = (daypart) =>
      `${daypart.start_time} - ${daypart.end_time} ${getAiringDays(
        daypart.airing_days
      )}`;

    const getAiringDays = (airingDays) => {
      const daysInNum = JSON.parse(JSON.stringify(airingDays));
      if (daysInNum && daysInNum.length) {
        const defaultDays = ["M", "T", "W", "Th", "F", "Sa", "Su"];
        const daysInText = daysInNum.map((d) => defaultDays[d]);
        return daysInText.join(", ");
      }
      return "";
    };

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

    const getVideoUrl = (adid) => {
      const _creativeModalData = { showModal: true, selectedAdid: adid };
      if (adid && adid.adid_meta_file_upload?.[0]?.id) {
        creativesStore.getVideoUrl(adid.adid_meta_file_upload[0].id).then(
          (res) => {
            if (res.data) {
              if (res.data.success && res.data.data) {
                _creativeModalData.selectedAdid = res.data.data;
                setCreativeModalData(_creativeModalData);
                onSetActiveModal("viewCreative");
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
    };

    const handleModalAction = (buttonType, mData) => {
      if (buttonType === "viewCreative") {
        getVideoUrl(mData);
      } else if (
        buttonType === "approve" ||
        buttonType === "decline" ||
        buttonType === "edit"
      ) {
        setModalData(mData);
        onSetActiveModal(buttonType);
      }
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const handleSuccessResponse = async (type) => {
      let _message;
      switch (type) {
        case "approve":
          _message = "Approved Successfully";
          getCreatives(getTabFromTabId("nt_cr_approved"));
          break;
        case "decline":
          _message = "Declined Successfully";
          getCreatives(getTabFromTabId("nt_cr_declined"));
          break;
        case "edit":
          _message = "Edited Successfully";
          getCreatives(getTabFromTabId("nt_cr_approved"));
          break;
        default:
          break;
      }
      showAckMessage({ message: _message });
      setActiveModal("");
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Review Creatives</PageTitle>
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

        {activeModal === "approve" || activeModal === "edit" ? (
          <EditModal
            key={`edit_${modalData.id}`}
            showModal={true}
            closeModal={() => onSetActiveModal("")}
            modalData={modalData}
            handleSuccessResponse={handleSuccessResponse}
            modalType={activeModal}
            channels={channels}
            selectedTab={selectedTab}
            modalClass="w80"
          />
        ) : null}

        {activeModal === "decline" ? (
          <DeclineModal
            key={`decline_${modalData.id}`}
            showModal={activeModal === "decline"}
            closeModal={() => onSetActiveModal("")}
            modalData={modalData}
            handleSuccessResponse={handleSuccessResponse}
            modalType={activeModal}
            declineCodes={declineCodes}
            modalClass="w600p"
          />
        ) : null}

        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default ReviewCreatives;
