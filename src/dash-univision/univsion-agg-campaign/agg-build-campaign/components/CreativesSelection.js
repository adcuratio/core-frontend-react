import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import withStore from '../../../../hocs/WithStore';

import DatePicker from 'react-datepicker';
import { FormControl, Row, Col, OverlayTrigger } from 'react-bootstrap';
import ReactLoader from '../../../../components/ReactLoader';
import CreativesAdPreviewModal from '../../../../components/CreativesAdPreviewModal';
import { showAckErrorMessage } from '../../../../common/utils';
import {
  orderIntakeTooltip,
  priorityTooltip,
  targetAudienceTooltip,
  skipWeekTooltip,
  showExclusionTooltip,
} from '../../components/tool-tips';
import SkipWeekSelector from '../../components/SkipWeekSelector';
import NetworkSelector from '../../components/NetworkSelector';
import DaypartSelector from '../../components/DaypartSelector';
import WeekdaySelector from '../../components/WeekdaySelector';
import AdidTable from '../../components/AdidTable';
import CopyRotationTable from '../../components/CopyRotationTable';
import DataproviderSegmentSelector from '../../components/DataproviderSegmentSelector';
import DesiredImpressionCpmSelector from '../../components/DesiredImpressionCpmSelector';
import FrequencyCapMaxViewSelector from '../../components/FrequencyCapMaxViewSelector';
import ShowExclusionSelector from '../../components/ShowExclusionSelector';
import AggAccordian from './AggAccordian';

const CreativesSelection = inject(
  'creativesStore',
  'uiStore'
)(
  observer((props) => {
    const { selectedCompanyData, levelData, setLevelData, creativesStore, uiStore } = props;

    // constants
    const initFieldsDataObj = {
      number_of_targeting: 1,
      targeting_data: [
        {
          creative_selection_type: 'adid',
        },
      ],
      adv_company: selectedCompanyData?.companyName?.company.id,
      name: selectedCompanyData?.companyName?.company?.name,
      order_type: 'Aggregation',
      additional_notes: '',
    };

    // States
    const [fields, setFields] = useState(initFieldsDataObj);
    const [toggleAdvertiserDetailAccordian, setToggleAdvertiserDetailAccordian] = useState(true);
    const [toggleOrder, setToggleOrder] = useState(0);
    const [activeModal, setActiveModal] = useState('');
    const [creativeModalData, setCreativeModalData] = useState();

    React.useEffect(() => {
      if (Object.keys(levelData).length > 2) {
        setFields(_.cloneDeep(levelData));
      }
    }, []);

    React.useEffect(() => {
      setLevelData(fields);
    }, [fields]);

    // Functions
    const getVideoUrl = (metaId) => {
      if (metaId) {
        creativesStore.getVideoUrl(metaId).then(
          (res) => {
            if (res.data) {
              if (res?.data?.success && res?.data?.data) {
                setActiveModal('preview');
                setCreativeModalData(res?.data?.data);
              } else
                showAckErrorMessage({ message: res?.data?.message ? res.data.message : 'No data found on server.' });
            } else showAckErrorMessage({ message: 'Creative data is not found.' });
          },
          () => {
            showAckErrorMessage({ message: 'Cannot get video file data for the creative.' });
          }
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
    };

    const closeCreativesModalData = () => {
      if (creativeModalData) {
        setCreativeModalData('');
      }
      setActiveModal('');
    };

    const onChangeCampaignName = (key, value) => {
      setFields({
        ...fields,
        [key]: value,
      });
    };

    const onChangeLabelOne = (key, value) => {
      const value1 = value.toDateString();
      if (key === 'end_date' && !Object.prototype.hasOwnProperty.call(fields, 'start_date')) {
        showAckErrorMessage({ message: 'Please select Flight start date first' });
        return;
      }
      if (key === 'start_date' || key === 'end_date') {
        for (let i = 0; i < fields.targeting_data.length; i++) {
          onChangeValue('skip_weeks_off', null, i);
        }
      }
      const tempFields = { ...fields };
      delete tempFields[key];
      tempFields[key] = value1;
      setFields({
        ...tempFields,
      });
    };

    const onChangeTargetCount = (e) => {
      setFields({
        ...fields,
        number_of_targeting: e.target.value * 1,
        targeting_data: [...new Array(e.target.value * 1)].map(() => ({
          creative_selection_type: 'adid',
        })),
      });
    };

    const handleAdditionalNotes = (e) => {
      const tempFields = { ...fields };
      tempFields['additional_notes'] = e.target.value;
      setFields(tempFields);
    };

    const onChangeOrderType = (typeStr, index) => {
      setFields({
        ...fields,
        targeting_data: fields.targeting_data.map((a, idx) => {
          if (index === idx) {
            return {
              creative_selection_type: typeStr,
            };
          }
          return a;
        }),
      });
    };

    const onChangeRotationType = (typeStr, index) => {
      setFields({
        ...fields,
        targeting_data: fields.targeting_data.map((a, idx) => {
          if (index === idx) {
            return {
              ...a,
              ad_copy_rotation: {
                ...(a?.ad_copy_rotation || {}),
                type: typeStr,
                assets: a?.ad_copy_rotation?.assets?.map(() => ({})),
              },
            };
          }
          return a;
        }),
      });
    };

    const onChangeRotationDuration = (durationNum, index) => {
      setFields({
        ...fields,
        targeting_data: fields.targeting_data.map((a, idx) => {
          if (index === idx) {
            return {
              ...a,
              ad_copy_rotation: {
                ...(a?.ad_copy_rotation || {}),
                duration: durationNum,
                assets: a?.ad_copy_rotation?.assets?.map(() => ({})),
              },
            };
          }
          return a;
        }),
      });
    };

    const onChangeRotationCreativesCount = (countNum, index) => {
      if (!fields?.targeting_data?.[index]?.ad_copy_rotation?.duration) {
        showAckErrorMessage({
          message: 'Please select AD Rotation Type / AD duration before selecting number of creatives.',
        });
        return;
      }

      setFields({
        ...fields,
        targeting_data: fields.targeting_data.map((a, idx) => {
          if (index === idx) {
            const b = {
              ...a,
              number_of_creatives: countNum,
              ad_copy_rotation: {
                ...(a?.ad_copy_rotation || {}),
                assets: [...new Array(countNum)].map(() => ({})),
              },
            };
            return b;
          }
          return a;
        }),
      });
    };

    const handleCreativeNameChange = (creativeObj, index, assetIndex = 0) => {
      const tempFields = { ...fields };

      if (tempFields.targeting_data[index].creative_selection_type === 'adid') {
        // adid important others used for repopulating data.
        tempFields.targeting_data[index].adid = creativeObj?.adid;
        tempFields.targeting_data[index].creative_name = creativeObj?.name;
        tempFields.targeting_data[index].identifier = creativeObj?.identifier;
        tempFields.targeting_data[index].duration = creativeObj?.duration;
        tempFields.targeting_data[index].meta_id = creativeObj?.meta_id;
      } else if (tempFields.targeting_data[index].creative_selection_type === 'ad_copy_rotation') {
        if (creativeObj !== null) {
          let flag = 0;
          tempFields.targeting_data[index].ad_copy_rotation.assets.forEach((data) => {
            if (data?.adid === creativeObj?.adid) flag = 1;
          });
          if (flag === 1) {
            showAckErrorMessage({ message: 'Creative has already been selected please select another creative.' });
            return;
          }
        }
        tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex].adid = creativeObj?.adid;
        tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex].creative_name = creativeObj?.name;
        tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex].identifier = creativeObj?.identifier;
        tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex].duration = creativeObj?.duration;
        tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex].meta_id = creativeObj?.meta_id;
      }
      setFields(tempFields);
    };

    const handleChangeADCopyRotation = (value, index, assetIndex = 0, key) => {
      if (!key) return null;
      if (value < 0) return null;
      const tempFields = _.cloneDeep(fields);
      tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] = value;

      if (tempFields.targeting_data[index]?.ad_copy_rotation.type === 'Weighted') {
        let weighted_sum = 0;
        tempFields.targeting_data[index]?.ad_copy_rotation.assets.forEach((a) => {
          if (Object.prototype.hasOwnProperty.call(a, 'weight')) {
            weighted_sum = weighted_sum + a?.weight;
          }
        });

        if (weighted_sum > 10) {
          tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] = '';
          showAckErrorMessage({ message: 'Sum of all weights cannot be greater than 10.' });
        }
      }

      if (tempFields.targeting_data[index]?.ad_copy_rotation.type === 'WeightedPercentage') {
        let sum = 0;
        tempFields.targeting_data[index]?.ad_copy_rotation.assets.forEach((a) => {
          if (Object.prototype.hasOwnProperty.call(a, 'weighted_percentage')) {
            sum = sum + a?.weighted_percentage;
          }
        });

        if (sum > 100) {
          tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] = '';
          showAckErrorMessage({ message: 'Sum of all percentages cannot be greater than 100.' });
        }
      }

      seqCheckBreak: if (
        tempFields.targeting_data[index]?.ad_copy_rotation.type === 'Sequenced' ||
        tempFields.targeting_data[index]?.ad_copy_rotation.type === 'Storyboard'
      ) {
        // Is valid value. (between 1 to no of creatives)
        if (
          tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] >
          tempFields?.targeting_data[index]?.number_of_creatives
        ) {
          tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] = '';
          showAckErrorMessage({
            message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${tempFields?.targeting_data[index]?.number_of_creatives}).`,
          });
          break seqCheckBreak;
        }
        // Duplicate check.
        const idx_dup_chk = Object.create(null);
        for (let i = 0; i < tempFields.targeting_data[index]?.ad_copy_rotation.assets.length; i++) {
          // Avioding falsy values to be checked.
          if (tempFields.targeting_data[index]?.ad_copy_rotation.assets?.[i]?.index) {
            if (tempFields.targeting_data[index]?.ad_copy_rotation.assets?.[i]?.index in idx_dup_chk) {
              tempFields.targeting_data[index].ad_copy_rotation.assets[assetIndex][key] = '';
              showAckErrorMessage({
                message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${tempFields?.targeting_data[index]?.number_of_creatives}).`,
              });
              break seqCheckBreak;
            }
            idx_dup_chk[tempFields.targeting_data[index]?.ad_copy_rotation.assets?.[i]?.index] = true;
          }
        }
      }

      setFields(tempFields);
    };

    const onChangeValue = (key, value, index) => {
      const tempFields = { ...fields };
      tempFields.targeting_data[index][key] = value;
      setFields(tempFields);
    };

    const handleDesiredImpressions = (value, index) => {
      if (value * 1 > 2147483647) {
        showAckErrorMessage({ message: 'Desired impressions cannot be greater than 2,147,483,647' });
        return;
      }
      onChangeValue('desired_impression', value, index);
    };

    const handleCPM = (value, index) => {
      if (Number.isNaN(value)) {
        showAckErrorMessage({ message: 'CPM should be numeric' });
        return;
      }
      onChangeValue('cpm', value, index);
    };

    const handlePriority = (value, index) => {
      if (Number.isNaN(value)) {
        showAckErrorMessage({ message: 'Priority should be numeric' });
        return;
      }
      onChangeValue('priority', value, index);
    };

    const onChangeSkipWeek = (weekNum, index) => {
      if (weekNum && !isNaN(weekNum)) {
        onChangeValue('skip_weeks_off', weekNum, index);
      } else if (weekNum === null) {
        onChangeValue('skip_weeks_off', null, index);
      }
    };

    const onChangeShowExclusion = (selectedShowArr, index) => {
      const showIndexArr = selectedShowArr?.map((data) => data?.id);
      if (selectedShowArr?.length > 5) {
        showAckErrorMessage({ message: 'Skipping more than 5 shows is not allowed.' });
        return;
      }
      onChangeValue('programs', [...showIndexArr], index);
    };

    const campaginDetailsBlock = () => (
      <div>
        <div className="ex-agg-padding" style={{ paddingBottom: '0px', paddingTop: '0px' }}>
          <Row className="row justify-content-center">
            <Col md={3} sm={3}>
              <p className="mr20 f12">Advertiser</p>
            </Col>
            <Col md={3} sm={3}>
              <p className="f12">
                {selectedCompanyData?.addadvertiserFreeText
                  ? selectedCompanyData.addadvertiserFreeText
                  : selectedCompanyData?.companyName?.company?.name}
              </p>
            </Col>
            <Col md={3} sm={3}>
              <p className="mr20 f12">Campaign Name </p>
            </Col>
            <Col md={3} sm={3}>
              <p className="f12">
                <FormControl
                  type="text"
                  value={fields?.campaign_name || ''}
                  onChange={(e) => onChangeCampaignName('campaign_name', e.target.value)}
                  placeholder="Enter campaign name"
                  style={{ width: '200px', height: '30px' }}
                />
              </p>
            </Col>
          </Row>

          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="mr20 f12">Flight Start</p>
            </Col>
            <Col md={3} sm={3}>
              <DatePicker
                minDate={new Date()}
                selected={fields?.start_date ? new Date(fields?.start_date) : ''}
                onChange={(date) => onChangeLabelOne('start_date', date)}
                wrapperClassName="date-picker-length"
              />
            </Col>
            <Col md={3} sm={3}>
              <p className="mr20 f12">Flight End </p>
            </Col>
            <Col md={3} sm={3}>
              <DatePicker
                selected={fields?.end_date ? new Date(fields?.end_date) : ''}
                minDate={fields?.start_date ? new Date(fields?.start_date) : ''}
                onChange={(date) => onChangeLabelOne('end_date', date)}
                wrapperClassName="date-picker-length"
              />
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12">
                Number of Orderlines
                <OverlayTrigger placement="right" overlay={targetAudienceTooltip}>
                  <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                </OverlayTrigger>
              </p>
            </Col>
            <Col md={3} sm={3}>
              <div>
                <select
                  value={fields?.number_of_targeting}
                  onChange={(e) => onChangeTargetCount(e)}
                  className="date-picker-length f12"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </Col>
          </Row>
        </div>
        <div className="column-border mt10">
          <Row>
            <Col md={3} sm={3}>
              <p className="f12">Additional Notes</p>
            </Col>
            <Col md={9} sm={9}>
              <FormControl
                type="text"
                value={fields?.additional_notes || ''}
                placeholder="Additional notes"
                onChange={(e) => handleAdditionalNotes(e)}
              ></FormControl>
            </Col>
          </Row>
        </div>
      </div>
    );

    const renderCreativeSelectionBlock = (field, idx) => (
      <>
        <div className="column-border">
          <Row>
            <Col md={3} sm={3}>
              <p style={{ fontWeight: 'bold' }} className="f12">
                Order Type
                <OverlayTrigger placement="bottom" overlay={orderIntakeTooltip}>
                  <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                </OverlayTrigger>
              </p>
            </Col>
            <Col md={3} sm={3}>
              <div>
                <select
                  value={fields?.targeting_data[idx]?.creative_selection_type || ''}
                  onChange={(e) => onChangeOrderType(e.target.value, idx)}
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

          {fields?.targeting_data[idx]?.creative_selection_type === 'ad_copy_rotation' ? (
            <CopyRotationTable
              rotationType={field?.ad_copy_rotation?.type}
              onChangeRotationType={(typeStr) => onChangeRotationType(typeStr, idx)}
              creativesCount={field?.number_of_creatives}
              onChangeRotationCreativesCount={(countNum) => onChangeRotationCreativesCount(countNum, idx)}
              rotationAssets={field?.ad_copy_rotation?.assets}
              onSelectCreative={(creativeObj, assetIndex) => handleCreativeNameChange(creativeObj, idx, assetIndex)}
              onChangeRotationValue={(value, assetKey, assetIndex) =>
                handleChangeADCopyRotation(value, idx, assetIndex, assetKey)
              }
              selectedCompanyId={selectedCompanyData?.companyName?.company.id}
              previewCreative={(metaId) => getVideoUrl(metaId)}
              rotationDuration={field?.ad_copy_rotation?.duration}
              onChangeRotationDuration={(durationNum) => onChangeRotationDuration(durationNum, idx)}
            />
          ) : (
            <AdidTable
              adid={field?.adid}
              duration={field?.duration}
              identifier={field?.identifier}
              creativeName={field?.creative_name}
              metaId={field?.meta_id}
              onChangeAdidCreative={(creativeObj) => handleCreativeNameChange(creativeObj, idx)}
              selectedCompanyId={selectedCompanyData?.companyName?.company.id}
              previewCreative={(metaId) => getVideoUrl(metaId)}
            />
          )}
        </div>
        <div className="column-border mt10">
          <DataproviderSegmentSelector
            segmentData={field?.segment}
            onChangeSegmentData={(segment) => onChangeValue('segment', segment, idx)}
            selectedCompanyId={selectedCompanyData.companyName.company.id}
          />
        </div>
        <div className="ex-agg-padding">
          <DesiredImpressionCpmSelector
            desiredImpressions={field?.desired_impression}
            onChangeDesiredImpressions={(value) => handleDesiredImpressions(value, idx)}
            cpm={field?.cpm}
            onChamgeCpm={(value) => handleCPM(value, idx)}
          />
        </div>

        <div className="column-border mt10">
          <Row>
            <Col md={3} sm={3}>
              <p style={{ textDecorationLine: 'underline' }}>OPTIONAL</p>
            </Col>
          </Row>

          <FrequencyCapMaxViewSelector
            viewsData={field?.maximum_viewings}
            onChangeViewsData={(viewDataObj) => onChangeValue('maximum_viewings', viewDataObj, idx)}
          />
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12">Separation (minute)</p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <>
                  <div key={`${field}-${idx}`}>
                    <FormControl
                      style={{ width: '200px', height: '30px' }}
                      type="text"
                      placeholder="Separation"
                      value={field?.separation || ''}
                      onChange={(e) => onChangeValue('separation', e.target.value * 1, idx)}
                    />
                  </div>
                </>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12">
                Priority
                <OverlayTrigger placement="right" overlay={priorityTooltip}>
                  <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                </OverlayTrigger>
              </p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <div>
                  <div key={`${field}-${idx}`}>
                    <FormControl
                      type="number"
                      placeholder="1"
                      value={field?.priority || ''}
                      onChange={(e) => handlePriority(e.target.value, idx)}
                      style={{ width: '200px', height: '30px' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={3}>
              <p style={{ textDecorationLine: 'underline' }} className="mt30 f12">
                Exclusions
              </p>
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12">Days of Week </p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <div key={`${field}-${idx}`}>
                  <WeekdaySelector
                    selectedWeekdaysObj={field?.days_of_week}
                    onChange={(selectedWeekdays) => {
                      onChangeValue('days_of_week', selectedWeekdays, idx);
                    }}
                  />
                </div>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
            <Col md={3} sm={3}>
              <p className="f12">Dayparts</p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <div key={`${field}-${idx}`}>
                  <DaypartSelector
                    selectedDaypartList={field?.day_parts}
                    onChange={(selectedDayparts) => {
                      onChangeValue('day_parts', selectedDayparts, idx);
                    }}
                  />
                </div>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
          </Row>
          <Row className="mt10">
            <Col md={3} sm={3}>
              <p className="f12">Networks </p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <div key={`${field}-${idx}`}>
                  <NetworkSelector
                    selectedNetworkList={field?.networks}
                    onChange={(selectedNetworks) => {
                      onChangeValue('networks', selectedNetworks, idx);
                    }}
                  />
                </div>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
            <Col md={3} sm={3}>
              <p className="f12">
                Skip Week
                <OverlayTrigger placement="bottom" overlay={skipWeekTooltip}>
                  <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                </OverlayTrigger>
              </p>
            </Col>
            <Col md={3} sm={3}>
              {fields.number_of_targeting !== 0 ? (
                <div key={`${field}-${idx}`}>
                  <SkipWeekSelector
                    start_date={fields?.start_date ? new Date(fields?.start_date) : null}
                    end_date={fields?.end_date ? new Date(fields?.end_date) : null}
                    skipWeek={field?.skip_weeks_off ? field.skip_weeks_off : null}
                    onChange={(weekNum) => onChangeSkipWeek(weekNum, idx)}
                  />
                </div>
              ) : (
                <div className="agg-second-column-details">-</div>
              )}
            </Col>
          </Row>
          <Row className="mt30 flex-container1">
            <Col md={3} sm={3}>
              <p className="f12">
                Show Name Exclusion
                <OverlayTrigger placement="bottom" overlay={showExclusionTooltip}>
                  <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                </OverlayTrigger>
              </p>
            </Col>
            <Col md={9} sm={9}>
              <ShowExclusionSelector
                selectedData={field?.programs}
                onChange={(selectedShowArr) => onChangeShowExclusion(selectedShowArr, idx)}
              />
            </Col>
          </Row>
        </div>

        <hr />
      </>
    );

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
            isActive={toggleAdvertiserDetailAccordian}
            title="Campaign Details"
            index={1}
            content={campaginDetailsBlock}
            onClickAccordion={() => {
              setToggleAdvertiserDetailAccordian(!toggleAdvertiserDetailAccordian);
            }}
          />
        </div>

        {fields.number_of_targeting !== 0 ? (
          fields?.targeting_data?.map((field, idx) => (
            <div className="mt10" key={idx}>
              <AggAccordian
                isActive={toggleOrder === idx + 1 ? true : false}
                title={`Orderline ${idx + 1}`}
                index={idx + 1}
                content={() => renderCreativeSelectionBlock(field, idx)}
                onClickAccordion={() => toggleOrderDetail(idx)}
              />
            </div>
          ))
        ) : (
          <div className="second-column-details2">-</div>
        )}

        <CreativesAdPreviewModal
          showModal={activeModal === 'preview'}
          closeModal={closeCreativesModalData}
          creativeModalData={creativeModalData}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </div>
    );
  })
);

CreativesSelection.propTypes = {
  selectedCompanyData: PropTypes.object,
  levelData: PropTypes.object,
  setLevelData: PropTypes.any,
};

export default withStore(CreativesSelection);
