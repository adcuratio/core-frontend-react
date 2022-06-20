/* eslint-disable */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import { MainContent, PageHeader } from "../../../components/PageLayout";
//import withStore from '../../../hocs/WithStore';
import ReactLoader from "../../../components/ReactLoader";
import TabContainer from "../../../components/TabContainer";

import { AudienceTableTitles, declineCodes } from "../JsonData";
import AudienceTable from "./AudienceTable";

import { showAckErrorMessage, showAckMessage } from "../../../common/utils";

import AudienceDetailsModal from "./AudienceDetailsModal";
import ActionModal from "./ActionModal";

import ReactPickyFilter from "../../../components/ReactPickyFilter";
import CustomButton from "../../../components/CustomButton";
import { PageTitle } from "../../../components/Typography";
import ConfirmDeclineStatusModal from "./ConfirmDeclineStatusModal";

const ViewAudience = inject(
  "univisionStore",
  "uiStore"
)(
  observer((props) => {
    const { univisionStore, uiStore, $state } = props;
    const [tabCount, setTabCount] = useState({
      activeCount: 0,
      processedCount: 0,
      archiveCount: 0,
      pendingCount: 0,
      declineCount: 0,
    });

    const AudTabTitles = [
      {
        id: "active",
        name: "Active",
        status: 0,
        count: tabCount.activeCount,
      },
      {
        id: "pending",
        name: "Pending Approval",
        status: 3,
        count: tabCount.pendingCount,
      },
      {
        id: "pending-processing",
        name: "Pending Processing",
        status: 1,
        count: tabCount.processedCount,
      },
      {
        id: "declined",
        name: "Declined",
        status: 4,
        count: tabCount.declineCount,
      },
      {
        id: "archive",
        name: "Archive",
        status: 2,
        count: tabCount.archiveCount,
      },
    ];

    const [activeTab, setActiveTab] = useState(
      AudTabTitles[$state.params.tableState]
    );
    const [activeModal, setActiveModal] = useState("");

    const [advFilterAllData, setAdvFilterAllData] = useState([]);
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]);

    const [dataProviderData, setDataProviderData] = useState([
      "custom audience",
      "liveRamp",
      "uCI first party",
    ]);
    const [dpFilterSelectedData, setDpFilterSelectedData] = useState([
      "custom audience",
      "liveRamp",
      "UCI First Party",
    ]);

    const [segmentData, setSegmentData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [actionData, setActionData] = useState({});
    const [audienceData, setAudienceData] = useState([]);

    const [filteredEntityList, SetFilteredEntityList] = useState([]);

    const [companyList, setCompanyList] = useState([]);
    const [audiencePayload, setAudiencePayload] = useState({});
    const [audienceId, setAudienceId] = useState();

    const getCompanyList = () => {
      univisionStore.getAdvertiserListData().then(
        (res) => {
          if (res && res.status === 200) {
            const entityList = JSON.parse(JSON.stringify(res.data.data));
            setCompanyList(res?.data?.data);
            const advData = [];
            entityList?.forEach((a) => {
              if (a.company.name) {
                advData.push(a.company.name);
              } else {
                advData.push("with no advertiser");
              }
            });
            const advFilterdDataCpy = [...new Set(advData)];
            setAdvFilterAllData(advFilterdDataCpy);
            setAdvFilterSelectedData(advFilterdDataCpy);
            const dpData = [];
            dataProviderData?.forEach((d) => {
              if (d) {
                // var c = d.replace('audience_request_form', 'custom_audience');
                dpData.push(d);
              } else {
                dpData.push("with no data provider");
              }
            });
            const dpFilterDataCpy = [...new Set(dpData)];
            setDataProviderData(dpFilterDataCpy);
            setDpFilterSelectedData(dpFilterDataCpy);
          } else {
            showAckErrorMessage({
              message: res?.data?.message ?? "Unable to fetch Data!",
            });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAllSegments = (advData = [], dpData = dataProviderData) => {
      const advId = advData
        .filter((a) => a.company?.id)
        .map((c) => c.company?.id);
      const dp = onFilterDpData(dpData);
      univisionStore.getAudienceList(advId, dp).then(
        (res) => {
          if (res && res?.data) {
            setAudienceData(res?.data?.data);
            getAudienceTableList(res.data.data);
          } else {
            showAckErrorMessage({ message: "Unable to fetch data" });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getSegments = (tabSwitch = null) => {
      univisionStore.getAudience().then(
        (res) => {
          if (res && res?.data) {
            setAudienceData(res?.data?.data);
            getAudienceTableList(res.data.data, tabSwitch);
            getCompanyList();
          } else {
            showAckErrorMessage({ message: "Unable to fetch data" });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAudienceTableList = (audience, tabSwitch) => {
      const segData = [];

      if (activeTab.status === 0) {
        audience.forEach((seg) => {
          if (
            (seg.audience_state === 0 || seg.audience_state === 1) &&
            seg.is_archived === false &&
            seg.processed !== false
          ) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, activeCount: segData.length });
      } else if (activeTab.status === 1) {
        audience.forEach((seg) => {
          if (
            seg.audience_state === 3 ||
            seg.audience_state === 5 ||
            seg.processed === false
          ) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, processedCount: segData.length });
      } else if (activeTab.status === 2) {
        audience.forEach((seg) => {
          if (seg.is_archived === true) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, archiveCount: segData.length });
      } else if (activeTab.status === 3) {
        audience.forEach((seg) => {
          if (seg.audience_state === 2 || seg.audience_state === 6) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, pendingCount: segData.length });
      } else if (activeTab.status === 4) {
        audience.forEach((seg) => {
          if (seg.audience_state === 4) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, declineCount: segData.length });
      }

      setSegmentData(segData);
      if (tabSwitch === 0 || tabSwitch === 3) {
        onTabChange(AudTabTitles[tabSwitch]);
      }
    };

    useEffect(() => {
      getSegments();
    }, []);

    useEffect(() => {
      getAudienceTableList(audienceData);
    }, [activeTab]);

    const onFilterAdvData = (filteredData) => {
      const modifiedData = companyList.filter((a) => {
        if (a.company.name && filteredData.includes(a.company.name)) {
          return true;
        } else if (
          !a &&
          a.company.name &&
          filteredData.includes("with no advertiser")
        ) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onFilterDpData = (dataProviderData) => {
      const modifiedData = dataProviderData.filter((a) => {
        if (a && dataProviderData.includes(a)) {
          return true;
        } else if (!a && filteredData.includes("with no data provider")) {
          return true;
        }
        return false;
      });

      const mData = [];
      modifiedData.forEach((dataProvider) => {
        if (dataProvider === "liveRamp") {
          mData.push(dataProvider.replace("eR", "e_r"));
        } else if (dataProvider === "custom audience") {
          mData.push(
            dataProvider.replace("custom audience", "audience_request_form")
          );
        } else {
          mData.push(dataProvider.replace("uCI first party", "first_party"));
        }
      });
      return mData;
    };

    const applyFilter = (filteredData, id) => {
      if (id === "adv_filter" && filteredData.length > 0) {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        const modifiedDPData = onFilterDpData(dpFilterSelectedData);
        SetFilteredEntityList(modifiedData);
        getAllSegments(modifiedData, modifiedDPData);
      } else if (id === "dp_filter" && dataProviderData.length > 0) {
        setDpFilterSelectedData(filteredData);
        const modifiedData = onFilterDpData(filteredData);
        const modifiedAdvData = onFilterAdvData(advFilterSelectedData);
        SetFilteredEntityList(modifiedData);
        getAllSegments(modifiedAdvData, modifiedData);
      } else if (filteredData.length === 0) {
        setAdvFilterSelectedData(filteredData);
        SetFilteredEntityList([]);
        setAudienceData([]);
        setSegmentData([]);
        switch (activeTab.status) {
          case 0:
            setTabCount({ ...tabCount, activeCount: 0 });
            break;
          case 1:
            setTabCount({ ...tabCount, processedCount: 0 });
            break;
          case 2:
            setTabCount({ ...tabCount, archiveCount: 0 });
            break;
          case 3:
            setTabCount({ ...tabCount, pendingCount: 0 });
            break;
          case 4:
            setTabCount({ ...tabCount, declineCount: 0 });
            break;
        }
      }
    };

    const onRefresh = () => {
      setAudienceData([]);
      SetFilteredEntityList([]);
      setSegmentData([]);
      setAdvFilterSelectedData([]);
      getSegments();
    };

    const onTabChange = (tab) => {
      setActiveTab(tab);
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const handleTableButtonAction = (buttonType, seg) => {
      if (buttonType === "view") {
        onSetActiveModal("view");
        setModalData(seg);
      } else if (buttonType === "archive") {
        univisionStore.archiveSegments(seg).then(
          (res) => {
            if (res.status) {
              showAckMessage({ message: "Audience Sucessfully Archived !" });
              getSegments();
            } else {
              showAckErrorMessage({ message: res?.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (buttonType === "unarchive") {
        univisionStore.unarchiveSegments(seg).then(
          (res) => {
            if (res.status) {
              showAckMessage({ message: "Audience Sucessfully Unarchived !" });
              getSegments();
            } else {
              showAckErrorMessage({ message: res?.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (buttonType === "confirm") {
        const payload = {
          audience_state: 1,
        };
        setAudiencePayload(payload);
        setAudienceId(seg.id);
        onSetActiveModal("approve");
      } else if (buttonType === "decline") {
        onSetActiveModal("declineReason");
        setModalData(seg);
      }
    };

    const onHandleConfirm = (e, id) => {
      e.preventDefault();
      const payload = {
        audience_state: 4,
      };
      if (actionData?.reason?.id === undefined) {
        showAckErrorMessage({
          message: "Please select a reason before declining",
        });
        return;
      } else if (!actionData?.reason?.reason?.trim()) {
        showAckErrorMessage({
          message: "Decline message should not be empty",
        });
        return;
      } else {
        payload.reason = actionData.reason.reason;
      }
      setAudiencePayload(payload);
      setAudienceId(id);
      onSetActiveModal("decline");
    };

    const confirmDeclineAudience = (actionType) => {
      if (actionType === "approve") {
        univisionStore.confirmDeclineAudience(audiencePayload, audienceId).then(
          (res) => {
            if (res.status) {
              showAckMessage({ message: "Audience Approved !" });
              getSegments(0);
            } else {
              showAckErrorMessage({ message: res?.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        handleAudienceModalClose();
      } else if (actionType === "decline") {
        univisionStore.confirmDeclineAudience(audiencePayload, audienceId).then(
          (res) => {
            if (res.status) {
              showAckMessage({ message: "Audience Declined !" });
              getSegments(3);
            } else {
              showAckErrorMessage({ message: res?.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        handleAudienceModalClose();
      }
    };

    const handleAudienceModalClose = () => {
      setActiveModal("");
      setActionData({});
      setAudienceId("");
      setAudiencePayload({});
    };

    const tooltipSelection = (e) => {
      const target = e.target;
      if (target.id === "overlay-trigger") {
        return;
      }
    };

    const onChangeDeclineReason = (e, reason) => {
      setActionData({ ...actionData, reason });
    };

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle className="mt10 ml10">
              View/Manage Addressable Segments
            </PageTitle>

            <div className="flex-container1">
              <ReactPickyFilter
                allOptions={advFilterAllData}
                selectedData={advFilterSelectedData}
                onFilterChange={applyFilter}
                id="adv_filter"
                selectAllText="Select All Advertisers"
                allSelectedPlaceholder="All Advertisers"
                placeholderText="Select Advertiser"
              />
              <ReactPickyFilter
                allOptions={dataProviderData}
                selectedData={dpFilterSelectedData}
                onFilterChange={applyFilter}
                id="dp_filter"
                selectAllText="Select All Data Providers"
                allSelectedPlaceholder="All Data Providers"
                placeholderText="Select Data Provider"
              />
              <CustomButton
                type="primary"
                buttonText="Refresh"
                buttonClassName="m10 mr15"
                handleButtonClick={() => onRefresh()}
              />
            </div>
          </div>
        </PageHeader>
        <TabContainer
          onTabChange={onTabChange}
          activeTab={activeTab}
          tabList={AudTabTitles}
          showCount={false}
        />
        <AudienceTable
          audienceTableTitles={AudienceTableTitles}
          audienceTableData={segmentData}
          handleTableButtonAction={handleTableButtonAction}
          activeTab={activeTab}
          isLoading={uiStore.isLoading}
          advFilterSelectedData={advFilterSelectedData}
        />
        <AudienceDetailsModal
          showModal={activeModal === "view"}
          closeModal={() => handleAudienceModalClose()}
          modalData={modalData}
          tooltipSelection={tooltipSelection}
        />
        <ActionModal
          showModal={activeModal === "declineReason"}
          closeModal={() => handleAudienceModalClose()}
          modalData={modalData}
          onHandleConfirm={onHandleConfirm}
          actionData={{
            selectedValue: actionData.reason,
            reasons: declineCodes,
            onChangeReason: onChangeDeclineReason,
          }}
        />
        <ConfirmDeclineStatusModal
          showModal={activeModal === "approve" || activeModal === "decline"}
          closeModal={() => handleAudienceModalClose()}
          actionType={activeModal}
          confirmDeclineAudience={confirmDeclineAudience}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

ViewAudience.propTypes = {
  state: PropTypes.any,
};

export default ViewAudience;
