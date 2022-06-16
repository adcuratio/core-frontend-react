import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import withStore from '../../../hocs/WithStore';
import { getRotationLable, getRotationAssetKey } from './campaign-helper';
import { getRotationTooltip, creativePreviewTooltip } from './tool-tips';

import { Row, Col, OverlayTrigger } from 'react-bootstrap';
import CreativeSelector from './CreativeSelector';

const CopyRotationTable = inject('aggCampaignStore')(
  observer((props) => {
    const {
      rotationType,
      onChangeRotationType,
      creativesCount,
      onChangeRotationCreativesCount,
      rotationAssets,
      onSelectCreative,
      onChangeRotationValue,
      selectedCompanyId,
      previewCreative,
      rotationDuration,
      onChangeRotationDuration,
    } = props;

    const durationArray = ['15', '30'];

    return (
      <div>
        <Row className="mt10">
          <Col md={3} sm={3}>
            <p className="f12">AD Copy Rotation Type</p>
          </Col>
          <Col md={3} sm={3}>
            <select
              value={rotationType || ''}
              onChange={(e) => onChangeRotationType(e.target.value)}
              className="date-picker-length f12"
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Weighted">Weighted</option>
              <option value="WeightedPercentage">Weighted Percentage</option>
              <option value="Sequenced">Sequenced</option>
              <option value="Storyboard">Storyboard</option>
            </select>
          </Col>
          <Col md={3} sm={3}>
            <p className="f12">No.of Creatives</p>
          </Col>
          <Col md={3} sm={3}>
            <select
              value={creativesCount || ''}
              onChange={(e) => onChangeRotationCreativesCount(e.target.value * 1)}
              className="date-picker-length f12"
            >
              <option value="" disabled>
                Select No.of Creatives
              </option>
              {/* <option value="1">1</option> */}
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </Col>
        </Row>

        <Row className="mt10">
          <Col md={3} sm={3}>
            <p className="f12">Ad Length (seconds)</p>
          </Col>
          <Col md={3} sm={3}>
            <select
              value={rotationDuration || ''}
              onChange={(e) => onChangeRotationDuration(e.target.value * 1)}
              className="date-picker-length f12"
            >
              <option value="" disabled>
                Select Ad duration
              </option>
              {durationArray.map((dur, id) => (
                <option value={dur} key={`duration_key_${id}`}>
                  {dur}
                </option>
              ))}
            </select>
          </Col>
        </Row>

        {creativesCount >= 2 && (
          <table className="table table-striped table-wrapper mt20 wrapped-table table-elem-center">
            <thead>
              <tr>
                <th className="f12">Creative Name</th>
                <th className="f12">
                  AD Copy Rotation {getRotationLable(rotationType)}
                  <OverlayTrigger placement="bottom" overlay={getRotationTooltip(rotationType)}>
                    <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                  </OverlayTrigger>
                </th>
                <th className="f12">AD length (Second)</th>
              </tr>
            </thead>
            <tbody>
              {rotationAssets.map((asset, assetIndex) => (
                <tr key={`rotation-row-${assetIndex}`} xl={12} className={'mt10'}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreativeSelector
                        orderType="ad_copy_rotation"
                        selectorValueType="name"
                        adCpySelectedDuration={rotationDuration}
                        selectedCompanyId={selectedCompanyId}
                        creative={{
                          label: asset?.creative_name,
                          value: asset?.adid,
                          name: asset?.creative_name,
                          adid: asset?.adid,
                          identifier: asset?.identifier,
                          duration: asset?.duration,
                          meta_id: asset?.meta_id,
                        }}
                        onChangeCreative={(creativeObj) => onSelectCreative(creativeObj, assetIndex)}
                      />
                      {asset?.meta_id ? (
                        <OverlayTrigger placement="right" overlay={creativePreviewTooltip}>
                          <i
                            className="glyphicon glyphicon-info-sign ml5"
                            aria-hidden="true"
                            onClick={() => {
                              previewCreative(asset?.meta_id);
                            }}
                          />
                        </OverlayTrigger>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      style={{ width: '190px', backgroundColor: '#c6ccc8', height: '30px', marginLeft: '40px' }}
                      value={asset?.[getRotationAssetKey(rotationType)] || ''}
                      min={0}
                      onChange={(e) =>
                        onChangeRotationValue(e.target.value * 1, getRotationAssetKey(rotationType), assetIndex)
                      }
                    />
                  </td>
                  <td>
                    <p className="f12">{asset?.duration}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  })
);

CopyRotationTable.propTypes = {
  rotationType: PropTypes.string,
  onChangeRotationType: PropTypes.func,
  creativesCount: PropTypes.number,
  onChangeRotationCreativesCount: PropTypes.func,
  rotationAssets: PropTypes.array,
  onSelectCreative: PropTypes.func,
  onChangeRotationValue: PropTypes.func,
  selectedCompanyId: PropTypes.any,
  previewCreative: PropTypes.func,
  rotationDuration: PropTypes.number,
  onChangeRotationDuration: PropTypes.func,
};

export default withStore(CopyRotationTable);
