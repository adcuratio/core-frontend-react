import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import withStore from '../../../hocs/WithStore';

import { Row, Col, OverlayTrigger } from 'react-bootstrap';
import { creativePreviewTooltip } from './tool-tips';
import CreativeSelector from './CreativeSelector';

const AdidTable = inject('aggCampaignStore')(
  observer((props) => {
    const {
      adid,
      duration,
      identifier,
      creativeName,
      metaId,
      onChangeAdidCreative,
      previewCreative,
      selectedCompanyId,
    } = props;

    return (
      <>
        <Row className="mt10">
          <Col md={3} sm={3}>
            <p className="f12">Creative Name</p>
          </Col>
          <Col md={3} sm={3}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CreativeSelector
                orderType="adid"
                selectorValueType="name"
                adCpySelectedDuration={null}
                selectedCompanyId={selectedCompanyId}
                creative={{
                  label: creativeName,
                  value: adid,
                  name: creativeName,
                  adid,
                  identifier,
                  duration,
                  meta_id: metaId,
                }}
                onChangeCreative={(creativeObj) => onChangeAdidCreative(creativeObj)}
              />
              {metaId ? (
                <OverlayTrigger placement="right" overlay={creativePreviewTooltip}>
                  <i
                    className="glyphicon glyphicon-info-sign ml5"
                    aria-hidden="true"
                    onClick={() => {
                      previewCreative(metaId);
                    }}
                  />
                </OverlayTrigger>
              ) : null}
            </div>
          </Col>
          <Col md={3} sm={3}>
            <p className="f12">Creative Identifier</p>
          </Col>
          <Col md={3} sm={3}>
            <CreativeSelector
              orderType="adid"
              selectorValueType="identifier"
              adCpySelectedDuration={null}
              selectedCompanyId={selectedCompanyId}
              creative={{
                label: identifier,
                value: adid,
                name: creativeName,
                adid,
                identifier,
                duration,
                meta_id: metaId,
              }}
              onChangeCreative={(creativeObj) => onChangeAdidCreative(creativeObj)}
            />
          </Col>
        </Row>
        <Row className="mt10">
          <Col md={3} sm={3}>
            Duration
          </Col>
          <Col md={3} sm={3}>
            {duration && <p>{duration} seconds</p>}
          </Col>
        </Row>
      </>
    );
  })
);

AdidTable.propTypes = {
  adid: PropTypes.any,
  duration: PropTypes.number,
  identifier: PropTypes.string,
  creativeName: PropTypes.string,
  metaId: PropTypes.any,
  onChangeAdidCreative: PropTypes.func,
  previewCreative: PropTypes.func,
  selectedCompanyId: PropTypes.any,
};

export default withStore(AdidTable);
