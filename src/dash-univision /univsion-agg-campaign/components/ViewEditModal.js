import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import parseISO from 'date-fns/parseISO';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';

import DatePicker from 'react-datepicker';
import { Col, Row, Modal, FormControl } from 'react-bootstrap';
import { showAckErrorMessage } from '../../../common/utils';
import CustomButton from '../../../components/CustomButton';
import SkipWeekSelector from './SkipWeekSelector';
import NetworkSelector from './NetworkSelector';
import DaypartSelector from './DaypartSelector';
import WeekdaySelector from './WeekdaySelector';
import DesiredImpressionCpmSelector from './DesiredImpressionCpmSelector';
import FrequencyCapMaxViewSelector from './FrequencyCapMaxViewSelector';
import ShowExclusionSelector from './ShowExclusionSelector';

const AggViewEditModal = inject('aggCampaignStore')(
  observer((props) => {
    const {
      orderlineData,
      showModal,
      toggleModal,
      isView,
      toggleViewOrEdit,
      onSubmitEdits,
      orderDetails,
      comingFromUCIPending,
      aggCampaignStore,
    } = props;

    const networkList = toJS(aggCampaignStore.networkList);
    const showsList = toJS(aggCampaignStore?.showNameList);

    const [editData, setEditData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
      const dataObj = {
        desired_impression: orderlineData?.desired_impressions,
        cpm: orderlineData?.cpm,
        maximum_viewings: {
          period: orderlineData?.freq_cap_map_viewing?.period,
          count: orderlineData?.freq_cap_map_viewing?.count,
        },
        separation: orderlineData?.separations,
        priority: orderlineData?.priority,
        days_of_week: orderlineData?.days_of_week ? { ...orderlineData?.days_of_week } : {},
        networks: orderlineData?.networks ? orderlineData?.networks : [],
        skip_weeks_off: orderlineData?.skip_weeks_off,
        day_parts: orderlineData?.day_parts ? orderlineData?.day_parts?.map((d) => d.id) : [],
        status: orderlineData?.status,
        activation_time: null,
        deactivation_time: null,
        programs: orderlineData?.programs?.length ? orderlineData?.programs?.map((showObj) => showObj?.id) : [],
      };

      setEditData(dataObj);
      setOriginalData(dataObj);
      setStartDate(orderDetails?.start_date);
      setEndDate(orderDetails?.end_date);
    }, [orderlineData, orderDetails]);

    const onChangeSkipWeek = (weekNum) => {
      if (weekNum && !isNaN(weekNum)) {
        handleInputChange(weekNum, 'skip_weeks_off');
      } else if (weekNum === null) {
        handleInputChange(null, 'skip_weeks_off');
      }
    };

    const onChangeShowExclusion = (selectedShowArr) => {
      const showIndexArr = selectedShowArr?.map((data) => data?.id);
      if (selectedShowArr?.length > 5) {
        showAckErrorMessage({ message: 'Skipping more than 5 shows is not allowed.' });
        return;
      }
      handleInputChange(showIndexArr, 'programs');
    };

    const onSubmit = () => {
      let payload = {};
      // Differential payload: only keys that changed.
      Object.keys(originalData)?.forEach((keyStr) => {
        if (JSON.stringify(originalData?.[keyStr]) !== JSON.stringify(editData?.[keyStr])) {
          payload = { ...payload, [keyStr]: editData?.[keyStr] };
        }
      });
      onSubmitEdits(orderlineData?.id, payload);
    };

    const onChangeActOrDeactDate = (value, key) => {
      if (key === 'activation_time') {
        // activation time should be before deactivation time.
        if (new Date(value) > new Date(editData?.deactivation_time || orderlineData?.deactivation_time)) {
          showAckErrorMessage({ message: 'Activation Time should be before the Deactivation time!' });
          return;
        }
        // if selected activation date is lesser than the start_date then change start date.
        if (new Date(value) < new Date(orderDetails?.start_date)) {
          setStartDate(new Date(value));
          setEditData({ ...editData, [key]: value, skip_weeks_off: null });
        } else {
          setStartDate(orderDetails?.start_date);
          setEditData({ ...editData, [key]: value, skip_weeks_off: orderlineData?.skip_weeks_off });
        }
      } else if (key === 'deactivation_time') {
        // deactivation time should be greater than the activation time.
        if (new Date(value) < new Date(editData?.activation_time || orderlineData?.activation_time)) {
          showAckErrorMessage({ message: 'Deactivation Time should be greater than the activation time!' });
          return;
        }
        // if selected deactivation date is greater than the end_date then set end date.
        if (new Date(value) > new Date(orderDetails?.end_date)) {
          setEndDate(new Date(value));
          setEditData({ ...editData, [key]: value, skip_weeks_off: null });
        } else {
          setEndDate(orderDetails?.end_date);
          setEditData({ ...editData, [key]: value, skip_weeks_off: orderlineData?.skip_weeks_off });
        }
      }
    };

    const handleInputChange = (value, key, objectKeyName) => {
      if (objectKeyName) {
        const tempObject = _.cloneDeep(editData);
        tempObject[objectKeyName][key] = value;
        setEditData({ ...tempObject });
      } else {
        setEditData({ ...editData, [key]: value });
      }
    };

    const getInputContent = (keyData, data, objectKeyName) => (
      <div key={`input_handler-${keyData}`}>
        <FormControl
          type="number"
          min={1}
          placeholder="0"
          value={data || ''}
          onChange={(e) => handleInputChange(parseInt(e.target.value), keyData, objectKeyName)}
          style={{ width: '200px', height: '30px' }}
        />
      </div>
    );

    const filterPassedTime = (time) => {
      if (new Date(editData?.activation_time) > new Date()) {
        const currentDate = new Date(editData?.activation_time);
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
      } else {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
      }
    };

    const renderModalBody = (orderlineData) => (
      <div>
        <div className="ex-agg-padding column-border" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
          <Row className="row justify-content-center mt20">
            <Col md={3} sm={3}>
              <p className="mr20 f12 bold">Order Type</p>
            </Col>
            <Col md={3} sm={3}>
              <p className="f12 bold">{orderlineData?.creatives?.creative_selection_type}</p>
            </Col>
          </Row>
          <Row>
            <table className="table table-striped table-wrapper mt20 wrapped-table table-elem-center">
              <thead>
                <tr>
                  <th className="f12 bold">Creative Name</th>
                  {/* <th className="f12 bold">{orderlineData?.creatives?.creative_selection_type?.split('_')?.join(' ')}</th> */}
                  <th>ISCI</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {orderlineData?.creatives?.creatives?.map((c, idx) => (
                  <tr key={`show_tab_orderline_${idx}`}>
                    <td className="f12 bold">
                      <p className="f12 bold">{c?.creative_name || c?.ceative_name}</p>
                    </td>
                    {/* <td className="f12 bold">{c?.weight || c?.weighted_percentage || c?.index}</td> */}
                    <td className="f12 bold">
                      <p className="f12 bold">{c?.identifier}</p>
                    </td>
                    <td>
                      <p className="f12 bold">{c?.duration} </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Row>
        </div>
        <div className="column-border mt10">
          <Row className="mt10">
            <Col md={3}>
              <p className="f12 bold">Data Provider</p>
            </Col>
            <Col md={3}>
              <p className="f12 bold" style={{ textTransform: 'capitalize' }}>
                {orderlineData?.data_provider}
              </p>
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3}>
              <p className="f12 bold">Segment Name</p>
            </Col>
            <Col md={3}>
              <p className="f12 bold" style={{ textTransform: 'capitalize', overflow: 'hidden' }}>
                {orderlineData?.segment_name}
              </p>
            </Col>
            <Col md={3}>
              <p className="f12 bold">Audience Size</p>
            </Col>
            <Col md={3}>
              <p className="f12 bold" style={{ textTransform: 'capitalize' }}>
                {orderlineData?.audience_size}
              </p>
            </Col>
          </Row>
        </div>
        <div className="column-border mt10">
          {isView ? (
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12 bold"> Desired Impressions for Campaign</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">
                  {editData?.desired_impression?.toLocaleString() || orderlineData?.desired_impressions}
                </p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">CPM</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">{editData?.cpm || orderlineData?.cpm}</p>
              </Col>
            </Row>
          ) : (
            <DesiredImpressionCpmSelector
              desiredImpressions={editData?.desired_impression}
              onChangeDesiredImpressions={(value) => handleInputChange(parseInt(value), 'desired_impression')}
              cpm={editData?.cpm}
              onChamgeCpm={(value) => handleInputChange(parseInt(value), 'cpm')}
            />
          )}

          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12 bold"> Activation Time</p>
            </Col>
            <Col md={3} sm={3}>
              {isView ? (
                <p className="f12 bold">
                  {moment(orderlineData?.activation_time).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')} EST
                </p>
              ) : (
                <DatePicker
                  portalId="root-portal"
                  selected={
                    editData?.activation_time
                      ? new Date(editData?.activation_time)
                      : parseISO(
                          moment(orderlineData?.activation_time).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')
                        )
                  }
                  onChange={(date) => onChangeActOrDeactDate(date, 'activation_time')}
                  wrapperClassName="date-picker-length"
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              )}
            </Col>
            <Col md={3} sm={3}>
              <p className="f12 bold">Deactivation Time (EST)</p>
            </Col>
            <Col md={3} sm={3}>
              {isView ? (
                <p className="f12 bold">
                  {moment(orderlineData?.deactivation_time).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss')} EST
                </p>
              ) : (
                <div>
                  <DatePicker
                    portalId="root-portal"
                    selected={
                      editData?.deactivation_time
                        ? new Date(editData?.deactivation_time)
                        : parseISO(
                            moment(orderlineData?.deactivation_time)
                              .tz('America/New_York')
                              .format('YYYY-MM-DD HH:mm:ss')
                          )
                    }
                    filterTime={filterPassedTime}
                    onChange={(date) => onChangeActOrDeactDate(date, 'deactivation_time')}
                    wrapperClassName="date-picker-length"
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div className="column-border mt10">
          <Row>
            <Col md={3} sm={3}>
              <p style={{ textDecorationLine: 'underline' }}>OPTIONAL</p>
            </Col>
          </Row>

          {isView ? (
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12 bold"> Frequency cap/Minimum Viewings</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">
                  {editData?.maximum_viewings?.period || orderlineData?.freq_cap_map_viewing?.period || '---'}
                </p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">Count</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12 bold">{orderlineData?.freq_cap_map_viewing?.count || '---'}</p>
              </Col>
            </Row>
          ) : (
            <FrequencyCapMaxViewSelector
              viewsData={editData?.maximum_viewings}
              onChangeViewsData={(viewDataObj) => handleInputChange(viewDataObj, 'maximum_viewings')}
            />
          )}

          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12 bold">Separation (minute)</p>
            </Col>
            <Col md={3} sm={3}>
              {isView ? (
                <p className="f12 bold">{editData?.separation || orderlineData?.separations || '---'}</p>
              ) : (
                getInputContent('separation', editData?.separation)
              )}
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12 bold">Priority</p>
            </Col>
            <Col md={3} sm={3}>
              {isView ? (
                <p className="f12 bold">{editData?.priority || orderlineData?.priority || '---'}</p>
              ) : (
                getInputContent('priority', editData?.priority)
              )}
            </Col>
          </Row>
          <Row className="mt30">
            <Col md={3} sm={3}>
              <p style={{ textDecorationLine: 'underline' }} className="f12 bold">
                Exclusions
              </p>
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12 bold">Days of week</p>
            </Col>
            <Col md={3} sm={3}>
              {isView &&
              Object.prototype.hasOwnProperty.call(orderlineData, 'days_of_week') &&
              orderlineData?.days_of_week !== null
                ? Object.keys(orderlineData?.days_of_week)?.map(
                    (key, value) =>
                      orderlineData?.days_of_week[key] && (
                        <p className="f12 bold" key={`id_of_key_${value}`}>
                          {key},
                        </p>
                      )
                  )
                : isView && <p className="f12 bold">---</p>}
              {!isView && (
                <WeekdaySelector
                  selectedWeekdaysObj={editData?.days_of_week}
                  onChange={(selectedWeekdays) => {
                    handleInputChange(selectedWeekdays, 'days_of_week');
                  }}
                />
              )}
            </Col>
            <Col md={3} sm={3}>
              <p className="f12 bold">Dayparts</p>
            </Col>
            <Col md={3} sm={3}>
              {isView &&
              Object.prototype.hasOwnProperty.call(orderlineData, 'day_parts') &&
              orderlineData?.day_parts !== null
                ? orderlineData?.day_parts?.map((daypart, ix) => (
                    <p className="f12 bold" key={`day_part_key${ix}`}>
                      {daypart.name}
                    </p>
                  ))
                : isView && <p className="f12 bold">---</p>}
              {!isView && (
                <DaypartSelector
                  selectedDaypartList={editData?.day_parts}
                  onChange={(selectedDayparts) => {
                    handleInputChange(selectedDayparts, 'day_parts');
                  }}
                />
              )}
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12 bold">Networks</p>
            </Col>
            <Col md={3} sm={3}>
              {isView && Object.prototype?.hasOwnProperty.call(orderlineData, 'networks')
                ? networkList?.map((net, ix) => (
                    <p className="f12 bold" key={`ix_key_net_${ix}`}>
                      {orderlineData?.networks?.includes(net.id) ? `${net.name}, ` : null}
                    </p>
                  ))
                : isView && <p className="f12 bold">---</p>}
              {!isView && (
                <NetworkSelector
                  selectedNetworkList={editData?.networks}
                  onChange={(selectedNetworks) => {
                    handleInputChange(selectedNetworks, 'networks');
                  }}
                />
              )}
            </Col>
            <Col md={3} sm={3}>
              <p className="f12 bold">Skip week</p>
            </Col>
            <Col md={3} sm={3}>
              {isView ? (
                <p className="f12 bold">{editData?.skip_weeks_off || orderlineData?.skip_weeks_off || '---'}</p>
              ) : (
                <div>
                  <SkipWeekSelector
                    start_date={startDate ? new Date(startDate) : null}
                    end_date={endDate ? new Date(endDate) : null}
                    skipWeek={editData?.skip_weeks_off ? editData?.skip_weeks_off : null}
                    onChange={(weekNum) => onChangeSkipWeek(weekNum)}
                  />
                </div>
              )}
            </Col>
          </Row>
          <Row className="mt30 flex-container1">
            <Col md={3} sm={3}>
              <p className="f12 bold">Show Name Exclusion</p>
            </Col>
            <Col md={9} sm={9}>
              {isView ? (
                <div>
                  {originalData?.programs?.length ? (
                    originalData?.programs?.map((showId, ixb) => (
                      <p className="f12" key={`${ixb}_programs`}>
                        {showsList?.find((dDay) => dDay?.id === showId)?.label},{' '}
                      </p>
                    ))
                  ) : (
                    <p className="f12">---</p>
                  )}
                </div>
              ) : (
                <ShowExclusionSelector
                  selectedData={editData?.programs}
                  onChange={(selectedShowArr) => onChangeShowExclusion(selectedShowArr)}
                />
              )}
            </Col>
          </Row>
        </div>
      </div>
    );

    return (
      <Modal show={showModal} onHide={toggleModal} bsSize="large" className="network-logs-modal-scroll">
        <Modal.Header closeButton>Orderline Details</Modal.Header>
        <Modal.Body>
          <div className="flex-container1 mb20">
            <p className={isView ? 'f16 mr30 bold segments-tab-active' : 'f16 mr30 bold'} onClick={toggleViewOrEdit}>
              View
            </p>
            {comingFromUCIPending !== 'pendingUCIApproval' && (
              <p className={!isView ? 'f16 mr10 bold segments-tab-active' : 'f16 mr10 bold'} onClick={toggleViewOrEdit}>
                Edit
              </p>
            )}
          </div>
          {renderModalBody(orderlineData)}
        </Modal.Body>
        <Modal.Footer>
          {!isView && (
            <CustomButton
              buttonClassName="capitalize mr10"
              type="primary"
              buttonText={`Submit`}
              handleButtonClick={onSubmit}
            />
          )}
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={toggleModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

AggViewEditModal.propTypes = {
  orderlineData: PropTypes.object,
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  isView: PropTypes.bool,
  toggleViewOrEdit: PropTypes.func,
  onSubmitEdits: PropTypes.func,
  orderDetails: PropTypes.object,
  comingFromUCIPending: PropTypes.string,
};

export default withStore(AggViewEditModal);
