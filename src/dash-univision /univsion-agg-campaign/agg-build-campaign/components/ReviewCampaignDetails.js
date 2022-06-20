import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import CustomButton from "../../../../components/CustomButton";
import AggAccordian from "./AggAccordian";
import { inject, observer } from "mobx-react";
//import withStore from '../../../../hocs/WithStore';
import { toJS } from "mobx";

const ReviewCampaignDetails = inject("aggCampaignStore")(
  observer((props) => {
    const {
      levelData,
      selectedCompanyData,
      onSubmit,
      onSaveTodrafts,
      backHandler,
      aggCampaignStore,
    } = props;

    const [toggleCampaignAccordian, setToggleCampaignAccordian] =
      useState(true);
    const [toggleOrder, setToggleOrder] = useState(0);

    const creativesListData = toJS(aggCampaignStore.creativesListData);
    const networkList = toJS(aggCampaignStore.networkList);
    const dayParts = toJS(aggCampaignStore.daypartList);
    const showsList = toJS(aggCampaignStore?.showNameList);

    const renderCampaignDetails = () => (
      <div
        className="ex-agg-padding"
        style={{ paddingBottom: "0px", paddingTop: "0px" }}
      >
        <Row className="row justify-content-center">
          <Col md={3} sm={3}>
            <p className="mr20 f12">Advertiser</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="f12">
              {selectedCompanyData?.companyName?.company?.name || "---"}
            </p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12">Campaign Name </p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12">{levelData?.campaign_name}</p>
          </Col>
        </Row>

        <Row className="mt10">
          <Col md={3} sm={3}>
            <p className="mr20 f12">Flight Start</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12">{levelData?.start_date}</p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12">Flight End </p>
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12"> {levelData?.end_date}</p>
          </Col>
        </Row>
        <Row className="mt10">
          <Col md={3} sm={3}>
            Number of Audience Targets
          </Col>
          <Col md={3} sm={3}>
            <p className="mr20 f12">{levelData.number_of_targeting}</p>
          </Col>
        </Row>
        <Row>
          <Col md={3} sm={3}>
            <p className="mr20 f12">Additional Notes</p>
          </Col>
          <Col md={9} sm={9}>
            <p className="f12">{levelData?.additional_notes}</p>
          </Col>
        </Row>
      </div>
    );

    const renderAudienceDetails = (data, creativesListData) => {
      const daysOfWeek = [];

      if (Object.prototype.hasOwnProperty.call(data, "days_of_week")) {
        Object.entries(data?.days_of_week)?.forEach(([key, value]) => {
          if (value) {
            daysOfWeek.push(key);
          }
        });
      }

      return (
        <div className="mt10">
          <div className="column-border">
            <Row>
              <Col md={3} sm={3}>
                <p className="f12">Order Type</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12" style={{ textTransform: "capitalize" }}>
                  {data?.creative_selection_type}
                </p>
              </Col>
            </Row>
            {data?.creative_selection_type !== "adid" ? (
              <div>
                <Row className="mt10">
                  <Col md={3} sm={3}>
                    <p className="f12">AD Copy Rotation Type</p>
                  </Col>
                  <Col md={3} sm={3}>
                    <p className="f12">{data?.ad_copy_rotation?.type}</p>
                  </Col>
                  <Col md={3} sm={3}>
                    <p className="f12">Number of Creatives</p>
                  </Col>
                  <Col md={3} sm={3}>
                    <p className="f12">
                      {data?.ad_copy_rotation?.assets.length}
                    </p>
                  </Col>
                </Row>
                <table className="table table-striped table-wrapper mt20 wrapped-table table-elem-center">
                  <thead>
                    <tr>
                      <th className="f12">Creative Name</th>
                      <th className="f12">AD Copy Rotation</th>
                      <th>Ad Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.ad_copy_rotation?.assets?.map((c, idx) => (
                      <tr key={`show_tab_${idx}`}>
                        <td className="f12">
                          {creativesListData?.map((cx, id) =>
                            cx.id === c?.adid ? (
                              <p key={id} className="f12">
                                {cx?.ad_name}
                              </p>
                            ) : null
                          )}
                        </td>
                        <td className="f12">
                          {c?.weight || c?.weighted_percentage || c?.index}
                        </td>
                        <td className="f12">
                          {creativesListData?.map((cx, id) =>
                            cx.id === c?.adid ? (
                              <p key={id} className="f12">
                                {cx?.duration}
                              </p>
                            ) : null
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Row className="mt10">
                <Col md={3} sm={3}>
                  <p className="f12">Creative Name</p>
                </Col>
                <Col md={3} sm={3}>
                  {creativesListData?.map((c, id) =>
                    c.id === data?.adid ? (
                      <p key={id} className="f12">
                        {c?.ad_name}
                      </p>
                    ) : null
                  )}
                </Col>
                <Col md={3} sm={3}>
                  <p className="f12">Ad Length</p>
                </Col>
                <Col md={3} sm={3}>
                  {creativesListData?.map((c, id) =>
                    c.id === data?.adid ? (
                      <p key={id} className="f12">
                        {c?.duration}
                      </p>
                    ) : null
                  )}
                </Col>
              </Row>
            )}
          </div>
          <div className="column-border mt10">
            <Row className="mt10">
              <Col md={3}>
                <p className="f12">Data Provider</p>
              </Col>
              <Col md={3}>
                <p className="f12" style={{ textTransform: "capitalize" }}>
                  {data?.segment?.data_provider}
                </p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3}>
                <p className="f12">Segment Name</p>
              </Col>
              <Col md={3}>
                <p
                  className="f12"
                  style={{
                    textTransform: "capitalize",
                    wordBreak: "break-word",
                  }}
                >
                  {data?.segment?.segment_name}
                </p>
              </Col>
              <Col md={3}>
                <p className="f12">Audience Size</p>
              </Col>
              <Col md={3}>
                <p className="f12" style={{ textTransform: "capitalize" }}>
                  {data?.segment?.row_count?.toLocaleString()}
                </p>
              </Col>
            </Row>
          </div>
          <div className="ex-agg-padding">
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12"> Desired Impressions for Campaign</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">
                  {data?.desired_impression?.toLocaleString()}
                </p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">CPM</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.cpm}</p>
              </Col>
            </Row>
          </div>
          <div className="column-border mt10">
            <Row>
              <Col md={3} sm={3}>
                <p style={{ textDecorationLine: "underline" }}>OPTIONAL</p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12"> Frequency cap/Minimum Viewings</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.maximum_viewings?.period || "---"}</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">Count</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.maximum_viewings?.count || "---"}</p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Separation (minute)</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.separation || "---"}</p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Priority</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.priority || "1"}</p>
              </Col>
            </Row>
            <Row className="mt30">
              <Col md={3} sm={3}>
                <p style={{ textDecorationLine: "underline" }} className="f12">
                  Exclusions
                </p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Days of week</p>
              </Col>
              <Col md={3} sm={3}>
                {Object.prototype.hasOwnProperty.call(data, "days_of_week") ? (
                  daysOfWeek?.map((key, keyidx) => (
                    <p className="f12" key={`id_of_key_${keyidx}`}>
                      {key},
                    </p>
                  ))
                ) : (
                  <p className="f12">---</p>
                )}
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">Dayparts</p>
              </Col>
              <Col md={3} sm={3}>
                {Object.prototype.hasOwnProperty.call(data, "day_parts") ? (
                  data?.day_parts?.map((daypart, ix) => (
                    <p className="f12" key={ix}>
                      {dayParts.find((dDay) => dDay.id === daypart).name},{" "}
                    </p>
                  ))
                ) : (
                  <p className="f12">---</p>
                )}
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Networks</p>
              </Col>
              <Col md={3} sm={3}>
                {Object.prototype.hasOwnProperty.call(data, "networks") ? (
                  data?.networks?.map((net, ixb) => (
                    <p className="f12" key={`${ixb}_net_work`}>
                      {networkList.find((dDay) => dDay.id === net).name},{" "}
                    </p>
                  ))
                ) : (
                  <p className="f12">---</p>
                )}
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">Skip week</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{data?.skip_weeks_off || "---"}</p>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Show Name Exclusions</p>
              </Col>
              <Col md={3} sm={3}>
                {Object.prototype.hasOwnProperty.call(data, "programs") ? (
                  data?.programs?.map((showName, ixb) => (
                    <p className="f12" key={`${ixb}_programs`}>
                      {showsList?.find((dDay) => dDay?.id === showName)?.label},{" "}
                    </p>
                  ))
                ) : (
                  <p className="f12">---</p>
                )}
              </Col>
            </Row>
          </div>
        </div>
      );
    };

    const toggleOrderDetail = (idx) => {
      if (toggleOrder === idx + 1) {
        setToggleOrder(0);
      } else {
        setToggleOrder(idx + 1);
      }
    };

    return (
      <div>
        <div>
          <AggAccordian
            isActive={toggleCampaignAccordian}
            title="Campaign Details"
            index={1}
            content={() => renderCampaignDetails()}
            onClickAccordion={() => {
              setToggleCampaignAccordian(!toggleCampaignAccordian);
            }}
          />
        </div>
        <div>
          {levelData?.targeting_data?.length > 0 &&
            levelData?.targeting_data?.map((cdata, idx) => (
              <div className="mt10" key={`accordian_data_${idx}`}>
                <AggAccordian
                  isActive={toggleOrder === idx + 1 ? true : false}
                  title={`Orderline ${idx + 1}`}
                  index={idx + 1}
                  content={() =>
                    renderAudienceDetails(cdata, creativesListData, idx)
                  }
                  onClickAccordion={() => toggleOrderDetail(idx)}
                />
              </div>
            ))}
        </div>

        <div
          className="mt10"
          style={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <CustomButton
            type="secondary"
            buttonText="Back"
            handleButtonClick={backHandler}
            buttonClassName="custom-btn-style"
          />
          <div className="mr10"></div>
          <CustomButton
            type="primary"
            buttonText="Submit"
            handleButtonClick={onSubmit}
            buttonClassName="custom-btn-style"
          />
          <div className="mr10"></div>
          <CustomButton
            type="primary"
            buttonText="Save as Draft"
            handleButtonClick={onSaveTodrafts}
            buttonClassName="custom-btn-style"
          />
        </div>
      </div>
    );
  })
);

ReviewCampaignDetails.propTypes = {
  levelData: PropTypes.object,
  selectedCompanyData: PropTypes.object,
  onSubmit: PropTypes.func,
  onSaveTodrafts: PropTypes.func,
  backHandler: PropTypes.func,
};

export default ReviewCampaignDetails;
