import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
//import withStore from '../../../hocs/WithStore';
import _ from "lodash";

import { FormControl, Row, Col, OverlayTrigger } from "react-bootstrap";
import { showAckErrorMessage, showAckMessage } from "../../../common/utils";
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../../components/PageLayout";
import CreativesAdPreviewModal from "../../../components/CreativesAdPreviewModal";
import { PageTitle } from "../../../components/Typography";
import ReactLoader from "../../../components/ReactLoader";
import CustomButton from "../../../components/CustomButton";
import SkipWeekSelector from "../components/SkipWeekSelector";
import NetworkSelector from "../components/NetworkSelector";
import DaypartSelector from "../components/DaypartSelector";
import WeekdaySelector from "../components/WeekdaySelector";
import AdidTable from "../components/AdidTable";
import CopyRotationTable from "../components/CopyRotationTable";
import DataproviderSegmentSelector from "../components/DataproviderSegmentSelector";
import DesiredImpressionCpmSelector from "../components/DesiredImpressionCpmSelector";
import FrequencyCapMaxViewSelector from "../components/FrequencyCapMaxViewSelector";
import ShowExclusionSelector from "../components/ShowExclusionSelector";

import {
  orderIntakeTooltip,
  priorityTooltip,
  skipWeekTooltip,
  showExclusionTooltip,
} from "../components/tool-tips";

const AggAddNewOrderline = inject(
  "uiStore",
  "aggCampaignStore",
  "creativesStore",
  "$state",
  "tradeStore"
)(
  observer((props) => {
    const {
      $state,
      navigationService,
      tradeStore,
      uiStore,
      aggCampaignStore,
      creativesStore,
    } = props;

    const [activeModal, setActiveModal] = useState("");
    const [creativeModalData, setCreativeModalData] = useState();

    // Intermediatory data states. (Order details and selected duration)
    const [orderDetails, setOrderDetails] = useState({});

    // Intermediatory data states. (Segments and data-provider)
    const [advCompanyId, setAdvCompanyId] = useState(null);

    // Intermediatory data states. (Skipping weeks)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Required data states (for API response):
    // Row 1 data
    const [creativeSelectionType, setCreativeSelectionType] = useState("adid");
    const [adidCreativeObj, setAdidCreativeObj] = useState({});
    const [adCopyRotation, setAdCopyRotation] = useState({});
    const [acrNumCreatives, setAcrNumCreatives] = useState(null);

    // Row 2 data
    const [segment, setSegment] = useState({});

    // Row 3 data
    const [desiredImpressions, setDesiredImpressions] = useState("");
    const [cpm, setCpm] = useState("");

    // Row 4 data
    const [maxViews, setMaxViews] = useState({});
    const [separation, setSeparation] = useState(null);
    const [priority, setPriority] = useState("");
    const [daysOfWeek, setDaysOfWeek] = useState({});
    const [dayparts, setDayparts] = useState([]);
    const [networks, setNetworks] = useState([]);
    const [skipWeeksOff, setSkipWeeksOff] = useState(null);
    const [showsExclusion, setShowsExclusion] = useState([]);

    useEffect(() => {
      if ($state?.params?.tradeId === null) {
        navigationService.goToUnivisionManageCampaigns();
      } else {
        tradeStore.getDishOrderDetails($state?.params?.tradeId).then(
          (res) => {
            if (res.status === 200) {
              setOrderDetails(res?.data?.data);
              setStartDate(res?.data?.data?.start_date);
              setEndDate(res?.data?.data?.end_date);
              setAdvCompanyId(res?.data?.data?.adv_company);
              if (res?.data?.data?.adv_company && res?.data?.data?.order_type) {
                // Fetch creatives data:
                aggCampaignStore.getCreativesData(
                  res?.data?.data?.adv_company,
                  res?.data?.data?.order_type
                );
              }
            } else {
              showAckErrorMessage();
            }
          },
          (error) => {
            showAckErrorMessage({ message: error.message });
          }
        );
      }
    }, []);

    const getVideoUrl = (metaId) => {
      if (metaId) {
        creativesStore.getVideoUrl(metaId).then(
          (res) => {
            if (res.data) {
              if (res?.data?.success && res?.data?.data) {
                setActiveModal("preview");
                setCreativeModalData(res?.data?.data);
              } else
                showAckErrorMessage({
                  message: res?.data?.message
                    ? res.data.message
                    : "No data found on server.",
                });
            } else
              showAckErrorMessage({ message: "Creative data is not found." });
          },
          () => {
            showAckErrorMessage({
              message: "Cannot get video file data for the creative.",
            });
          }
        );
      } else {
        showAckErrorMessage({ message: "No creative data available." });
      }
    };

    const closeCreativesModalData = () => {
      if (creativeModalData) {
        setCreativeModalData("");
      }
      setActiveModal("");
    };

    // --------------------- Ad copy rotation --------------------------

    const onChangeRotationType = (typeStr) => {
      setAdCopyRotation({
        ...adCopyRotation,
        type: typeStr,
        assets: adCopyRotation?.assets?.map(() => ({})),
      });
    };

    const onChangeRotationDuration = (durationNum) => {
      setAdCopyRotation({
        ...adCopyRotation,
        duration: durationNum,
        assets: adCopyRotation?.assets?.map(() => ({})),
      });
    };

    const onChangeRotationCreativesCount = (countNum) => {
      if (!(adCopyRotation?.type && adCopyRotation?.duration)) {
        showAckErrorMessage({
          message:
            "Please select AD Rotation Type / Duration before selecting number of creatives.",
        });
        return;
      }
      setAcrNumCreatives(countNum);
      setAdCopyRotation({
        ...adCopyRotation,
        assets: [...new Array(countNum)].map(() => ({})),
      });
    };

    const handleChangeADCopyRotation = (value, assetIndex = 0, key) => {
      if (!key) return null;
      if (value <= 0) return null;

      const tempAdCopyRotation = _.cloneDeep(adCopyRotation);
      tempAdCopyRotation.assets[assetIndex][key] = value;

      if (tempAdCopyRotation.type === "Weighted") {
        let weighted_sum = 0;
        tempAdCopyRotation.assets.forEach((a) => {
          if (Object.prototype.hasOwnProperty.call(a, "weight")) {
            weighted_sum = weighted_sum + a?.weight;
          }
        });
        if (weighted_sum > 10) {
          tempAdCopyRotation.assets[assetIndex][key] = "";
          showAckErrorMessage({
            message:
              "sum of all weighted cannot be greater than 10 in weighted",
          });
        }
      }

      if (tempAdCopyRotation.type === "WeightedPercentage") {
        let sum = 0;
        tempAdCopyRotation.assets.forEach((a) => {
          if (Object.prototype.hasOwnProperty.call(a, "weighted_percentage")) {
            sum = sum + a?.weighted_percentage;
          }
        });
        if (sum > 100) {
          tempAdCopyRotation.assets[assetIndex][key] = "";
          showAckErrorMessage({
            message:
              "sum of all percentages cannot be greater than 100 in weighted percentage",
          });
        }
      }

      seqCheckBreak: if (
        tempAdCopyRotation.type === "Sequenced" ||
        tempAdCopyRotation.type === "Storyboard"
      ) {
        // Is valid value. (between 1 to no of creatives)
        if (tempAdCopyRotation.assets[assetIndex][key] > acrNumCreatives) {
          tempAdCopyRotation.assets[assetIndex][key] = "";
          showAckErrorMessage({
            message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${acrNumCreatives}).`,
          });
          break seqCheckBreak;
        }
        // Duplicate check.
        const idx_dup_chk = Object.create(null);
        for (let i = 0; i < tempAdCopyRotation.assets.length; i++) {
          // Avioding falsy values to be checked.
          if (tempAdCopyRotation.assets?.[i]?.index) {
            if (tempAdCopyRotation.assets?.[i]?.index in idx_dup_chk) {
              tempAdCopyRotation.assets[assetIndex][key] = "";
              showAckErrorMessage({
                message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${acrNumCreatives}).`,
              });
              break seqCheckBreak;
            }
            idx_dup_chk[tempAdCopyRotation.assets?.[i]?.index] = true;
          }
        }
      }

      setAdCopyRotation(tempAdCopyRotation);
    };

    const handleCreativeNameChange = (creativeObj, assetIndex = 0) => {
      const tempAdCopyRotation = { ...adCopyRotation };
      if (creativeObj !== null) {
        let flag = 0;
        tempAdCopyRotation.assets.forEach((data) => {
          if (data?.adid === creativeObj?.adid) flag = 1;
        });

        if (flag === 1) {
          showAckErrorMessage({
            message:
              "Creative has already been selected please select another creative.",
          });
          return;
        }
      }
      tempAdCopyRotation.assets[assetIndex].adid = creativeObj?.adid;
      tempAdCopyRotation.assets[assetIndex].creative_name = creativeObj?.name;
      tempAdCopyRotation.assets[assetIndex].identifier =
        creativeObj?.identifier;
      tempAdCopyRotation.assets[assetIndex].duration = creativeObj?.duration;
      tempAdCopyRotation.assets[assetIndex].meta_id = creativeObj?.meta_id;

      setAdCopyRotation(tempAdCopyRotation);
    };

    // -------------------- Ad copy rotation ends ----------------------------

    const handleDesiredImpressions = (value) => {
      if (value * 1 > 2147483647) {
        showAckErrorMessage({
          message: "Desired impressions cannot be greater than 2,147,483,647",
        });
        return;
      }
      setDesiredImpressions(value);
    };

    const handleCPM = (value) => {
      if (Number.isNaN(value)) {
        showAckErrorMessage({ message: "CPM should be numeric" });
        return;
      }
      setCpm(value);
    };

    const handlePriority = (value) => {
      if (Number.isNaN(value)) {
        showAckErrorMessage({ message: "Priority value should be numeric" });
        return;
      }
      setPriority(value);
    };

    const handleSeparation = (value) => {
      if (Number.isNaN(value)) {
        showAckErrorMessage({ message: "Minutes value should be numeric" });
        return;
      }
      setSeparation(value);
    };

    const onChangeSkipWeek = (weekNum) => {
      if (weekNum && !isNaN(weekNum)) {
        setSkipWeeksOff(weekNum);
      } else if (weekNum === null) {
        setSkipWeeksOff(null);
      }
    };

    const onChangeShowExclusion = (selectedShowArr) => {
      const showIndexArr = selectedShowArr?.map((data) => data?.id);
      if (selectedShowArr?.length > 5) {
        showAckErrorMessage({
          message: "Skipping more than 5 shows is not allowed.",
        });
        return;
      }
      setShowsExclusion(showIndexArr);
    };

    const handleSubmit = async () => {
      // Space for validation checks.
      if (creativeSelectionType === "adid" && !adidCreativeObj?.adid) {
        showAckErrorMessage({ message: "Select creative from the list." });
        return;
      }

      if (creativeSelectionType === "ad_copy_rotation") {
        if (!adCopyRotation?.type) {
          showAckErrorMessage({
            message: "Select Ad copy rotation type from the list.",
          });
          return;
        }

        if (!acrNumCreatives) {
          showAckErrorMessage({
            message: "Select Number of creatives from the list.",
          });
          return;
        }

        if (!(adCopyRotation?.assets?.length === acrNumCreatives * 1)) {
          showAckErrorMessage({
            message: "Selected creatives are less then the declared number.",
          });
          return;
        }

        let flag = 0;
        adCopyRotation?.assets?.forEach((obj) => {
          if (
            !(
              obj?.adid &&
              (obj?.weight || obj?.weighted_percentage || obj?.index)
            )
          ) {
            flag += 1;
          }
        });
        if (flag > 0) {
          showAckErrorMessage({
            message:
              "Select all the creatives and add their respective weights/percentages/indexes.",
          });
          return;
        }
      }

      // Sequence and storyboard index check.
      let index_flag = 0;
      if (
        adCopyRotation?.type === "Sequenced" ||
        adCopyRotation?.type === "Storyboard"
      ) {
        // Selected indexes should be distinct and in range (1 to number of creatives)
        const idx_dup_chk = Object.create(null);
        adCopyRotation?.assets?.forEach((asset) => {
          if (Object.prototype.hasOwnProperty.call(asset, "index")) {
            if (asset?.index in idx_dup_chk) {
              index_flag = 1;
            }
            idx_dup_chk[asset?.index] = true;
            if (asset?.index < 1 || asset?.index > acrNumCreatives * 1) {
              index_flag = 1;
            }
          } else {
            index_flag = 1;
          }
        });
      } else if (adCopyRotation?.type === "WeightedPercentage") {
        // Sum of selected percentage values should be equal to 100
        let percentageSum = 0;
        adCopyRotation?.assets?.forEach((asset) => {
          if (
            Object.prototype.hasOwnProperty.call(asset, "weighted_percentage")
          ) {
            percentageSum += asset?.weighted_percentage;
          } else {
            index_flag = 2;
          }
        });
        if (percentageSum !== 100) {
          index_flag = 2;
        }
      }

      if (index_flag === 1) {
        showAckErrorMessage({
          message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${acrNumCreatives})`,
        });
        return;
      } else if (index_flag === 2) {
        showAckErrorMessage({
          message: `Sum of selected percentage values should be equal to 100!`,
        });
        return;
      }

      if (!segment?.segment_id) {
        showAckErrorMessage({
          message:
            "Select appropriate segment by choosing a suitable data provider.",
        });
        return;
      }

      if (!desiredImpressions) {
        showAckErrorMessage({
          message: "Select desired impression for campaign.",
        });
        return;
      }

      if (!cpm) {
        showAckErrorMessage({ message: "Select CPM for campaign." });
        return;
      }

      // Space for payload generation.
      let targetPayload = {
        creative_selection_type: creativeSelectionType,
        desired_impression: desiredImpressions,
        cpm,
        segment,
        maximum_viewings: maxViews,
        separation,
        priority,
        days_of_week: daysOfWeek,
        networks,
        skip_weeks_off: skipWeeksOff,
        day_parts: dayparts,
        programs: showsExclusion,
      };

      if (creativeSelectionType === "adid") {
        targetPayload = { ...targetPayload, adid: adidCreativeObj?.adid };
      }

      if (creativeSelectionType === "ad_copy_rotation") {
        targetPayload = {
          ...targetPayload,
          number_of_creatives: acrNumCreatives,
          ad_copy_rotation: adCopyRotation,
        };
      }

      const payload = {
        trade_id: $state?.params?.tradeId,
        create_new_orderlines: [targetPayload],
      };

      // Space for API call and further navigation.
      try {
        const res = await aggCampaignStore.addNewAudienceGroup(payload);
        if (res && res?.status === 200) {
          if (res?.data?.success) {
            showAckMessage({ message: res?.data?.msg });
            navigationService.goToUnivisionManageCampaigns();
          } else {
            showAckErrorMessage({
              message: `Server Error!! ${res?.data?.msg || res?.data?.message}`,
            });
          }
        } else {
          showAckErrorMessage({
            message: `Server Error!! Not able to perform the required operation.`,
          });
        }
      } catch (error) {
        showAckErrorMessage({ message: `Server Error!! ${error}` });
      }
    };

    const handleBack = () => {
      navigationService.goToUnivisionManageCampaigns();
    };

    const generalOrderData = (orderDetails) => (
      <div className="ex-agg-padding column-border">
        <Row className="row justify-content-center">
          <Col md={3} sm={3}>
            <p className="mr20 f16 bold">Campaign Name :</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16">{orderDetails?.name}</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16 bold">Advertiser Name :</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16">
              {orderDetails?.orderline_details?.order_data?.advertiser?.Name}
            </p>
          </Col>
        </Row>
        <Row className="row justify-content-center mt20">
          <Col md={3} sm={3}>
            <p className="mr20 f16 bold">Start Date :</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16">{orderDetails?.start_date}</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16 bold">End Date :</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f16">{orderDetails?.end_date}</p>
          </Col>
        </Row>
        <Row className="row justify-content-center mt20">
          <Col md={3} sm={3}>
            <p className="mr20 f16 bold">Additional Notes :</p>
          </Col>
          <Col md={9} sm={9}>
            <p className="mr20 f16">{orderDetails?.additional_notes}</p>
          </Col>
        </Row>
      </div>
    );

    const renderCreativeSelectionBlock = () => (
      <>
        <div style={{ fontWeight: "600", fontSize: "14px" }}>
          <div className="column-border">
            <Row>
              <Col md={3} sm={3}>
                <p style={{ fontWeight: "bold" }} className="f12">
                  Order Type
                  <OverlayTrigger
                    placement="bottom"
                    overlay={orderIntakeTooltip}
                  >
                    <i
                      className="glyphicon glyphicon-info-sign ml5"
                      aria-hidden="true"
                    />
                  </OverlayTrigger>
                </p>
              </Col>

              <Col md={3} sm={3}>
                <div>
                  <select
                    value={creativeSelectionType || ""}
                    onChange={(e) => setCreativeSelectionType(e.target.value)}
                    className="date-picker-length f12"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="adid">AD/ID</option>
                    <option value="ad_copy_rotation">Ad Copy Rotation</option>
                  </select>
                </div>
              </Col>
            </Row>

            {creativeSelectionType === "ad_copy_rotation" ? (
              <CopyRotationTable
                rotationType={adCopyRotation?.type}
                onChangeRotationType={(typeStr) =>
                  onChangeRotationType(typeStr)
                }
                creativesCount={acrNumCreatives}
                onChangeRotationCreativesCount={(countNum) =>
                  onChangeRotationCreativesCount(countNum)
                }
                rotationAssets={adCopyRotation?.assets}
                onSelectCreative={(creativeObj, assetIndex) =>
                  handleCreativeNameChange(creativeObj, assetIndex)
                }
                onChangeRotationValue={(value, assetKey, assetIndex) =>
                  handleChangeADCopyRotation(value, assetIndex, assetKey)
                }
                selectedCompanyId={advCompanyId}
                previewCreative={(metaId) => getVideoUrl(metaId)}
                rotationDuration={adCopyRotation?.duration}
                onChangeRotationDuration={(durationNum) =>
                  onChangeRotationDuration(durationNum)
                }
              />
            ) : (
              <AdidTable
                adid={adidCreativeObj?.adid}
                duration={adidCreativeObj?.duration}
                identifier={adidCreativeObj?.identifier}
                creativeName={adidCreativeObj?.name}
                metaId={adidCreativeObj?.meta_id}
                onChangeAdidCreative={(creativeObj) =>
                  setAdidCreativeObj(creativeObj)
                }
                selectedCompanyId={advCompanyId}
                previewCreative={(metaId) => getVideoUrl(metaId)}
              />
            )}
          </div>

          <div className="column-border mt10">
            <DataproviderSegmentSelector
              segmentData={segment}
              onChangeSegmentData={(segment) => setSegment(segment)}
              selectedCompanyId={advCompanyId}
            />
          </div>

          <div className="ex-agg-padding">
            <DesiredImpressionCpmSelector
              desiredImpressions={desiredImpressions}
              onChangeDesiredImpressions={(value) =>
                handleDesiredImpressions(value)
              }
              cpm={cpm}
              onChamgeCpm={(value) => handleCPM(value)}
            />
          </div>

          <div className="column-border mt10">
            <Row>
              <Col md={3} sm={3}>
                <p style={{ textDecorationLine: "underline" }}>OPTIONAL</p>
              </Col>
            </Row>

            <FrequencyCapMaxViewSelector
              viewsData={maxViews}
              onChangeViewsData={(viewDataObj) => setMaxViews(viewDataObj)}
            />
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Separation (minute)</p>
              </Col>

              <Col md={3} sm={3}>
                <div>
                  <FormControl
                    type="number"
                    placeholder="Separation"
                    value={separation || ""}
                    onChange={(e) => handleSeparation(e.target.value * 1)}
                    style={{ width: "200px", height: "30px" }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">
                  Priority
                  <OverlayTrigger placement="right" overlay={priorityTooltip}>
                    <i
                      className="glyphicon glyphicon-info-sign ml5"
                      aria-hidden="true"
                    />
                  </OverlayTrigger>
                </p>
              </Col>
              <Col md={3} sm={3}>
                <div>
                  <div>
                    <FormControl
                      type="number"
                      placeholder="1"
                      value={priority || ""}
                      onChange={(e) => handlePriority(e.target.value)}
                      style={{ width: "200px", height: "30px" }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={3} sm={3}>
                <p
                  style={{ textDecorationLine: "underline" }}
                  className="mt30 f12"
                >
                  Exclusions
                </p>
              </Col>
            </Row>

            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Days of Week </p>
              </Col>
              <Col md={3} sm={3}>
                <div>
                  <WeekdaySelector
                    selectedWeekdaysObj={daysOfWeek}
                    onChange={(selectedWeekdays) => {
                      setDaysOfWeek(selectedWeekdays);
                    }}
                  />
                </div>
              </Col>

              <Col md={3} sm={3}>
                <p className="f12">Dayparts</p>
              </Col>
              <Col md={3} sm={3}>
                <div>
                  <DaypartSelector
                    selectedDaypartList={dayparts}
                    onChange={(selectedDayparts) => {
                      setDayparts(selectedDayparts);
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Networks </p>
              </Col>
              <Col md={3} sm={3}>
                <div>
                  <NetworkSelector
                    selectedNetworkList={networks}
                    onChange={(selectedNetworks) => {
                      setNetworks(selectedNetworks);
                    }}
                  />
                </div>
              </Col>

              <Col md={3} sm={3}>
                <p className="f12">
                  Skip Week
                  <OverlayTrigger placement="bottom" overlay={skipWeekTooltip}>
                    <i
                      className="glyphicon glyphicon-info-sign ml5"
                      aria-hidden="true"
                    />
                  </OverlayTrigger>{" "}
                </p>
              </Col>

              <Col md={3} sm={3}>
                <div>
                  <SkipWeekSelector
                    start_date={startDate ? new Date(startDate) : null}
                    end_date={endDate ? new Date(endDate) : null}
                    skipWeek={skipWeeksOff ? skipWeeksOff : null}
                    onChange={(weekNum) => onChangeSkipWeek(weekNum)}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt30 flex-container1">
              <Col md={3} sm={3}>
                <p className="f12">
                  Show Name Exclusion
                  <OverlayTrigger
                    placement="bottom"
                    overlay={showExclusionTooltip}
                  >
                    <i
                      className="glyphicon glyphicon-info-sign ml5"
                      aria-hidden="true"
                    />
                  </OverlayTrigger>
                </p>
              </Col>
              <Col md={9} sm={9}>
                <ShowExclusionSelector
                  selectedData={showsExclusion}
                  onChange={(selectedShowArr) =>
                    onChangeShowExclusion(selectedShowArr)
                  }
                />
              </Col>
            </Row>
          </div>
          <hr />
        </div>
      </>
    );

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Add New Orderline</PageTitle>
        </PageHeader>
        <PageContent>
          <div style={{ marginBottom: "20px" }}>
            {generalOrderData(orderDetails)}
          </div>
          <div>{renderCreativeSelectionBlock()}</div>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <CustomButton
              type="secondary"
              buttonText="Back to Campaign"
              handleButtonClick={() => handleBack()}
              buttonClassName="custom-btn-style"
            />
            <CustomButton
              type="primary"
              buttonText="Add Audience Group"
              handleButtonClick={() => handleSubmit()}
              buttonClassName="custom-btn-style"
            />
          </div>
        </PageContent>
        <CreativesAdPreviewModal
          showModal={activeModal === "preview"}
          closeModal={closeCreativesModalData}
          creativeModalData={creativeModalData}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default AggAddNewOrderline;
