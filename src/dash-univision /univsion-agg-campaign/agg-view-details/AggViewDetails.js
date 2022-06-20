import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { Col, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import "moment-timezone";
//import withStore from '../../../hocs/WithStore';
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../../components/PageLayout";
import { PageTitle } from "../../../components/Typography";
import {
  showAckErrorMessage,
  showAckMessage,
  processUTCtoEST,
} from "../../../common/utils";
import { orderDetailsTableTitles } from "../../manage-campaigns/components/JsonData";
import ReactLoader from "../../../components/ReactLoader";
import { TradeComponent } from "../../manage-campaigns/components/ManageTable";
import CustomButton from "../../../components/CustomButton";
import AggViewEditModal from "../components/ViewEditModal";
import OrderOrderLineCancelModal from "../components/OrderOrderlineCancelModal";
import ActionModal from "../../../operator-dash/manage-orders/components/ActionModal";

const AggVeiwDetailsPage = inject(
  "uiStore",
  "companyStore",
  "campaignStore",
  "aggCampaignStore",
  "$state",
  "tradeStore"
)(
  observer((props) => {
    const { $state, navigationService, tradeStore, uiStore, aggCampaignStore } =
      props;
    const [orderDetails, setOrderDetails] = useState({});
    const [isView, setIsView] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [orderlineData, setOrderlineData] = useState({});
    const [cancelOrderline, setCancelOrderline] = useState(false);
    const [activeModal, setActiveModal] = useState("");
    const [salesId, setSalesId] = useState("");

    const toggleCancelOrderline = (data) => {
      setOrderlineData(data);
      setCancelOrderline(!cancelOrderline);
    };

    const onConfirmCancelOrderline = (id, comment) => {
      if (!comment.length) {
        showAckErrorMessage({
          message: " Please describe the reason to cancel",
        });
        return;
      }
      aggCampaignStore
        .cancelOrderline(id.id, { status: "Canceled", cancel_comment: comment })
        .then(
          (res) => {
            if (res.data.success) {
              showAckMessage({
                message: "Target audience cancelled successfully",
              });
              setCancelOrderline(!cancelOrderline);
              getOrderDetails();
            } else {
              showAckErrorMessage({ message: res.data.message });
              setCancelOrderline(!cancelOrderline);
            }
          },
          (error) => showAckErrorMessage({ message: error.message })
        );
    };

    useEffect(() => {
      getOrderDetails();
    }, []);

    const onSubmitEdits = (orderlineID, editData) => {
      aggCampaignStore.editOrderLine(orderlineID, editData).then(
        (res) => {
          if (res.data.success) {
            showAckMessage({ message: res.data.message });
            setShowModal(false);
            getOrderDetails();
          } else {
            showAckErrorMessage({ message: res.data.message });
          }
        },
        (error) => {
          showAckErrorMessage({ message: error?.message });
        }
      );
    };

    const getOrderDetails = () => {
      if ($state?.params?.tradeId === null) {
        navigationService.goToUnivisionManageCampaigns();
      } else {
        tradeStore.getDishOrderDetails($state?.params?.tradeId).then(
          (res) => {
            if (res.status === 200) {
              setOrderDetails(res.data.data);
            } else {
              showAckErrorMessage();
            }
          },
          (error) => {
            showAckErrorMessage({ message: error.message });
          }
        );
      }
    };

    const toggleModal = () => {
      setShowModal(!showModal);
    };

    const renderTableHeader = (orderDetailsTableTitles) => (
      <tr>
        {orderDetailsTableTitles.map((header, index) => (
          <th
            key={`tabe_index_${index}`}
            className="mn-font text-align-center-imp"
          >
            {header.name}
          </th>
        ))}
      </tr>
    );

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
        {orderDetails?.status === 9 && (
          <Row className="row justify-content-center mt20">
            <Col md={3} sm={3}>
              <p className="mr20 f16 bold">Canceled Reason :</p>
            </Col>
            <Col md={9} sm={9}>
              <p className="mr20 f16">
                {orderDetails?.orderline_details?.order_data?.cancel_comment}
              </p>
            </Col>
          </Row>
        )}
      </div>
    );

    const ViewOrderlineData = (data) => {
      setOrderlineData(data);
      setIsView(true);
      setShowModal(true);
    };

    const onCloseModal = () => {
      setSalesId("");
      setActiveModal("");
    };

    const onApproval = () => {
      setActiveModal("");
      tradeStore
        .UciApproval({ sales_id: `${salesId}`, is_approved: "true" })
        .then(
          (res) => {
            if (res) {
              if (res.status === 200) {
                showAckMessage({ message: `Orderline approved successfully` });
                getOrderDetails();
              }
            } else {
              showAckErrorMessage({ message: res.data.message });
            }
          },
          (error) => {
            showAckErrorMessage({ message: error?.message });
          }
        );
    };

    const onGoBack = () => {
      navigationService.goToUnivisionManageCampaigns();
    };

    const EditOrderlineData = (data) => {
      setOrderlineData(data);
      setIsView(false);
      setShowModal(true);
    };

    const toggleViewOrEdit = () => {
      setIsView(!isView);
    };

    const renderTableBody = (orderDetails) =>
      orderDetails?.orderline_details ? (
        orderDetails?.orderline_details?.orderline_data?.map(
          (orderData, index) => (
            <tr key={`order_data_agg_${index}`} className="wrapped-table">
              <td className="mn-font text-align-center-imp">
                {orderData?.creatives?.creative_selection_type || "---"}
              </td>
              <td className="mn-font text-align-center-imp">
                {orderData?.creatives?.creative_count || "---"}
              </td>
              <td className="mn-font text-align-center-imp">
                {orderData?.creatives?.creatives?.map((cData, id) => (
                  <span key={`cdata_${id}`}>
                    {cData?.creative_name}
                    <span>({cData.identifier})</span>
                  </span>
                ))}
              </td>
              <td className="mn-font text-align-center-imp">
                {orderData?.data_provider || "---"}
              </td>
              <td className="mn-font text-align-center-imp">
                {orderData?.segment_name || "---"}
              </td>
              <td className="mn-font text-align-center-imp">
                {orderData.audience_size || "---"}
              </td>
              <td className="mn-font text-align-center-imp">
                {moment(orderData.activation_time)
                  .tz("America/New_York")
                  .format("YYYY-MM-DD HH:mm:ss") || "---"}{" "}
                EST
              </td>
              <td className="mn-font text-align-center-imp">
                {moment(orderData.deactivation_time)
                  .tz("America/New_York")
                  .format("YYYY-MM-DD HH:mm:ss") || "---"}{" "}
                EST
              </td>
              <td className="mn-font text-align-center-imp">
                {$state.params.comingFromUCIPending !== "pendingUCIApproval" &&
                orderData.status !== "Canceled" &&
                orderData?.status !== "Completed" ? (
                  orderData?.uci_orderline_approval ? (
                    `Confirmed by 
              ${orderData?.uci_orderline_approval?.first_name} ${
                      orderData?.uci_orderline_approval?.last_name
                    }
               at ${processUTCtoEST(
                 orderData?.uci_orderline_approval?.approved_at
               )} ET`
                  ) : (
                    <CustomButton
                      buttonText="Approve"
                      buttonClassName="tradebtn mn-trade-btn"
                      handleButtonClick={() => {
                        setActiveModal("approve");
                        setSalesId(orderData?.sales_id);
                      }}
                    />
                  )
                ) : (
                  orderData?.status
                )}
                {orderData?.cancel_comment ? (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="standard-campaign-tooltip">
                        {orderData?.cancel_comment}
                      </Tooltip>
                    }
                  >
                    <i
                      className="glyphicon glyphicon-info-sign ml5"
                      aria-hidden="true"
                    />
                  </OverlayTrigger>
                ) : null}
              </td>
              {orderData.status !== "Canceled" &&
              orderData?.status !== "Completed" ? (
                <td className="mn-font text-align-center-imp">
                  <CustomButton
                    buttonText="View"
                    buttonClassName="tradebtn mn-trade-btn ml5"
                    handleButtonClick={() => {
                      ViewOrderlineData(orderData);
                    }}
                  />
                  {$state.params.comingFromUCIPending !==
                    "pendingUCIApproval" && (
                    <span>
                      <CustomButton
                        buttonText="Edit"
                        buttonClassName="tradebtn mn-trade-btn ml5"
                        handleButtonClick={() => {
                          EditOrderlineData(orderData);
                        }}
                      />
                      <CustomButton
                        buttonText="Cancel"
                        buttonClassName="tradebtn mn-trade-btn ml5"
                        handleButtonClick={() => {
                          toggleCancelOrderline(orderData);
                        }}
                      />
                    </span>
                  )}
                </td>
              ) : (
                <td className="mn-font text-align-center-imp">N/A</td>
              )}
            </tr>
          )
        )
      ) : (
        <tr className="wrapped-table">
          <td className="mn-font text-align-center-imp"></td>
        </tr>
      );

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>View Order Details</PageTitle>
        </PageHeader>
        <PageContent>
          <div>{generalOrderData(orderDetails)}</div>
          <TradeComponent
            key="TableDataTrade"
            className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder"
          >
            <thead>{renderTableHeader(orderDetailsTableTitles)}</thead>
            <tbody>{renderTableBody(orderDetails)}</tbody>
          </TradeComponent>
          <AggViewEditModal
            showModal={showModal}
            orderlineData={orderlineData}
            toggleViewOrEdit={toggleViewOrEdit}
            isView={isView}
            toggleModal={toggleModal}
            onSubmitEdits={onSubmitEdits}
            orderDetails={orderDetails}
            comingFromUCIPending={$state.params.comingFromUCIPending}
          />
          <div style={{ marginTop: "15px", float: "left" }}>
            <CustomButton
              type="secondary"
              buttonText="Back"
              handleButtonClick={() => onGoBack()}
              buttonClassName="custom-btn-style"
            />
          </div>
        </PageContent>

        <ActionModal
          isModalActive={activeModal === "approve"}
          closeModal={onCloseModal}
          actionData={{ actionType: activeModal }}
          order={""}
          onHandleConfirm={onApproval}
        />

        <OrderOrderLineCancelModal
          showModal={cancelOrderline}
          toggleModal={toggleCancelOrderline}
          orderData={orderlineData}
          type={"Orderline"}
          onSubmit={onConfirmCancelOrderline}
        />
        <ActionModal
          isModalActive={activeModal === "approve"}
          closeModal={onCloseModal}
          actionData={{ actionType: activeModal }}
          order={""}
          onHandleConfirm={onApproval}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default AggVeiwDetailsPage;
