import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import { formatText, showAckMessage, showAckErrorMessage } from '../../../common/utils';

const AddAudienceSegments = (props) => {
  const { univisionStore, getAllAudience, AudTabTitles } = props;
  const [show, setShow] = useState(false);
  const [addAudiencefields, setAudienceFields] = useState({
    advertiserName: '',
    dataSource: '',
    audienceName: '',
    audienceDescription: '',
    liveRampCount: '',
    dishCount: '',
    uciCount: '',
  });

  const handleShow = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setAudienceFields({
      advertiserName: '',
      dataSource: '',
      audienceName: '',
      audienceDescription: '',
      liveRampCount: '',
      dishCount: '',
      uciCount: '',
    });
  };

  const handleAudienceFieldsChange = (e, id) => {
    const addAudiencefieldsCpy = { ...addAudiencefields };
    if (id === 'adv') {
      addAudiencefieldsCpy.advertiserName = e.target.value;
    } else if (id === 'data_source') {
      addAudiencefieldsCpy.dataSource = e.target.value;
    } else if (id === 'audience_name') {
      addAudiencefieldsCpy.audienceName = e.target.value;
    } else if (id === 'audience_description') {
      addAudiencefieldsCpy.audienceDescription = e.target.value;
    } else if (id === 'liveramp_count') {
      addAudiencefieldsCpy.liveRampCount = e.target.value;
    } else if (id === 'dish_count') {
      addAudiencefieldsCpy.dishCount = e.target.value;
    } else if (id === 'first_party') {
      addAudiencefieldsCpy.uciCount = e.target.value;
    }
    setAudienceFields(addAudiencefieldsCpy);
  };

  const handleAddAudienceSubmit = () => {
    if (addAudiencefields.dataSource === 'live_ramp') {
      if (
        formatText(addAudiencefields.advertiserName) &&
        addAudiencefields.dataSource &&
        formatText(addAudiencefields.audienceName) &&
        formatText(addAudiencefields.audienceDescription)
      ) {
        if (addAudiencefields.liveRampCount || addAudiencefields.dishCount) {
          const payload = {
            company_name: formatText(addAudiencefields.advertiserName),
            data_provider: addAudiencefields.dataSource,
            name: formatText(addAudiencefields.audienceName),
            description: formatText(addAudiencefields.audienceDescription),
            household_count: addAudiencefields.liveRampCount,
            dish_count: addAudiencefields.dishCount,
          };
          univisionStore.saveAudience(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data) {
                  showAckMessage({
                    message: res?.message ?? 'Added Audience successful.',
                  });
                  if (addAudiencefields.liveRampCount && addAudiencefields.dishCount) {
                    getAllAudience(AudTabTitles[1]);
                  } else {
                    getAllAudience(AudTabTitles[2]);
                  }
                  closeModal();
                  setAudienceFields({
                    advertiserName: '',
                    dataSource: '',
                    audienceName: '',
                    audienceDescription: '',
                    liveRampCount: '',
                    dishCount: '',
                  });
                }
              } else showAckErrorMessage({ message: res?.message ?? 'Something went wrong' });
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else {
          const payload = {
            company_name: formatText(addAudiencefields.advertiserName),
            data_provider: addAudiencefields.dataSource,
            name: formatText(addAudiencefields.audienceName),
            description: formatText(addAudiencefields.audienceDescription),
          };
          univisionStore.saveAudience(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data) {
                  showAckMessage({
                    message: res?.message ?? 'Added Audience successful.',
                  });
                  getAllAudience(AudTabTitles[2]);
                  closeModal();
                  setAudienceFields({
                    advertiserName: '',
                    dataSource: '',
                    audienceName: '',
                    audienceDescription: '',
                    liveRampCount: '',
                    dishCount: '',
                  });
                }
              } else showAckErrorMessage({ message: res?.message ?? 'Something went wrong' });
            },
            () => {
              showAckErrorMessage();
            }
          );
        }
      } else {
        showAckErrorMessage({ message: 'Please select required fields' });
      }
    } else {
      if (
        formatText(addAudiencefields.advertiserName) &&
        addAudiencefields.dataSource &&
        formatText(addAudiencefields.audienceName) &&
        formatText(addAudiencefields.audienceDescription)
      ) {
        if (addAudiencefields.dishCount) {
          const payload = {
            company_name: formatText(addAudiencefields.advertiserName),
            data_provider: addAudiencefields.dataSource,
            name: formatText(addAudiencefields.audienceName),
            description: formatText(addAudiencefields.audienceDescription),
            dish_count: addAudiencefields.dishCount,
          };
          univisionStore.saveAudience(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data) {
                  showAckMessage({
                    message: res?.message ?? 'Added Audience successful.',
                  });
                  getAllAudience(AudTabTitles[1]);
                  closeModal();
                  setAudienceFields({
                    advertiserName: '',
                    dataSource: '',
                    audienceName: '',
                    audienceDescription: '',
                    liveRampCount: '',
                    dishCount: '',
                  });
                }
              } else showAckErrorMessage({ message: res?.message ?? 'Something went wrong' });
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else {
          const payload = {
            company_name: formatText(addAudiencefields.advertiserName),
            data_provider: addAudiencefields.dataSource,
            name: formatText(addAudiencefields.audienceName),
            description: formatText(addAudiencefields.audienceDescription),
          };
          univisionStore.saveAudience(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data) {
                  showAckMessage({
                    message: res?.message ?? 'Added Audience successful.',
                  });
                  getAllAudience(AudTabTitles[2]);
                  closeModal();
                  setAudienceFields({
                    advertiserName: '',
                    dataSource: '',
                    audienceName: '',
                    audienceDescription: '',
                    liveRampCount: '',
                    dishCount: '',
                  });
                }
              } else showAckErrorMessage({ message: res?.message ?? 'Something went wrong' });
            },
            () => {
              showAckErrorMessage();
            }
          );
        }
      } else {
        showAckErrorMessage({ message: 'Please select required fields' });
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>Add Audience</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt10 flex-container1">
            Advertiser <span className="error-indicator">*</span> <span className="ml5">:</span>
            <FormControl
              style={{ width: '150px', marginLeft: '120px' }}
              type="text"
              placeholder="Enter Advertiser"
              value={addAudiencefields.advertiserName}
              onChange={(e) => handleAudienceFieldsChange(e, 'adv')}
            />
          </div>

          <div className="mt10 flex-container1">
            Data Source <span className="error-indicator">*</span> <span className="ml5">:</span>
            <select
              style={{ width: '150px', marginLeft: '110px' }}
              value={addAudiencefields?.dataSource || ''}
              onChange={(e) => handleAudienceFieldsChange(e, 'data_source')}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="live_ramp">LiveRamp</option>
              <option value="audience_request_form">Audience Request Form</option>
              <option value="first_party">UCI FirstParty</option>
            </select>
          </div>

          <div className="mt10 flex-container1">
            Audience Name <span className="error-indicator">*</span> <span className="ml5">:</span>
            <FormControl
              style={{ width: '150px', marginLeft: '85px' }}
              type="text"
              placeholder="Enter Name"
              value={addAudiencefields.audienceName}
              onChange={(e) => handleAudienceFieldsChange(e, 'audience_name')}
            />
          </div>

          <div className="mt10 flex-container1">
            Audience Description <span className="error-indicator">*</span> <span className="ml5">:</span>
            <FormControl
              style={{ width: '150px', marginLeft: '51px' }}
              type="text"
              placeholder="Enter description"
              value={addAudiencefields?.audienceDescription}
              onChange={(e) => handleAudienceFieldsChange(e, 'audience_description')}
            />
          </div>
          {addAudiencefields?.dataSource === 'live_ramp' && (
            <>
              <div className="mt10 flex-container1">
                LiveRamp Count (<p style={{ fontWeight: 'bold', fontSize: '13px' }}> Optional</p>) :
                <input
                  style={{ width: '150px', marginLeft: '31px', marginTop: '1px' }}
                  type="number"
                  min="1"
                  value={parseInt(addAudiencefields?.liveRampCount)}
                  onChange={(e) => handleAudienceFieldsChange(e, 'liveramp_count')}
                />
              </div>
              <div className="mt10 flex-container1">
                Dish Count(<p style={{ fontWeight: 'bold', fontSize: '13px' }}> Optional</p>) :
                <input
                  style={{ width: '150px', marginLeft: '69px' }}
                  type="number"
                  min="1"
                  value={parseInt(addAudiencefields?.dishCount)}
                  onChange={(e) => handleAudienceFieldsChange(e, 'dish_count')}
                />
              </div>
            </>
          )}
          {addAudiencefields?.dataSource === 'audience_request_form' && (
            <div className="mt10 flex-container1">
              Dish Count(<p style={{ fontWeight: 'bold', fontSize: '13px' }}> Optional</p>) :
              <input
                style={{ width: '150px', marginLeft: '69px', marginTop: '1px' }}
                type="number"
                min="1"
                value={parseInt(addAudiencefields.dishCount)}
                onChange={(e) => handleAudienceFieldsChange(e, 'dish_count')}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Submit" handleButtonClick={handleAddAudienceSubmit} />
        </Modal.Footer>
      </Modal>
      <div className="ml10">
        <CustomButton type="primary" buttonText="Add Audience" handleButtonClick={handleShow}>
          <i className="fas fa-plus-circle fa-lg  mr5" />
        </CustomButton>
      </div>
    </>
  );
};
AddAudienceSegments.propTypes = {
  univisionStore: PropTypes.object,
  getCompanyList: PropTypes.func,
  getAllAudience: PropTypes.func,
  AudTabTitles: PropTypes.array,
};

export default AddAudienceSegments;
