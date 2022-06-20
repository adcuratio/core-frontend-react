import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { showAckErrorMessage } from '../../../common/utils';

import ReplacementCreativeTabs from './ReplacementCreativeTabs';

import RadioButton from '../../../components/RadioButton';
import CreativesAdPreviewModal from '../../../components/CreativesAdPreviewModal';

const TabType = styled.div`
  border: 1px solid #ddd;
  padding-bottom: 20px;
`;

const CardTitleFlow = styled.div`
  white-space: normal;
  overflow: inherit;
  width: 100%;
  font-weight: bold;
  color: #26282a;
  text-overflow: ellipsis;
`;

const Card = styled.div`
  .card-box {
    width: 47%;
    margin-left: 15px;
    height: 100px;
    padding: 10px 8px;
    display: inline-block;
    margin: 4px 4px;
    background-color: #fff;
    border: 1px solid;
    border-color: #e7e9ea;
    overflow: hidden;
  }
  .card-selected {
    background: #faf2e6;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.3);
    border: 1px solid #eea32c;
  }
`;

const Row = styled.div`
  margin-right: -15px;
  margin-left: 0px;
`;

const MsgGrpCardTitle = styled.div`
  width: auto;
  font-size: 11px;
  font-weight: bold;
  color: #26282a;
  overflow: hidden;
`;

const CardDivWrapper = styled.div`
  height: calc(60vh - 50px);
  overflow: auto;
`;

const repCreativeTabData = [
  {
    id: 'rep_creative',
    name: 'Always replace with single replacement creative',
  },
  {
    id: 'rep_creative_with_time',
    name: 'Vary replacement ad with time',
  },
  {
    id: 'rep_creative_on_frequency',
    name: 'Vary replacement ad based on frequency',
  },
];

const ReplacementCreative = inject('creativesVideoStore')(
  observer((props) => {
    const {
      repCreativeData,
      toggleDefaultAdIdSelection,
      creativesVideoStore,
      nextPageUrl,
      handlePagination,
      tableRef,
    } = props;

    const [creativeModalData, setCreativeModalData] = useState('');
    const [activeModal, setActiveModal] = useState('');
    const [activeTabData, setActiveTabData] = useState(repCreativeTabData[0]);

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const closeCreativesModalData = () => {
      if (creativeModalData) {
        setCreativeModalData('');
      }
      onSetActiveModal('');
    };

    const creativeData = (activeTabData, e) => {
      if (activeTabData.id === 'rep_creative') {
        setActiveTabData(activeTabData);
      } else if (activeTabData.id === 'rep_creative_with_time' || activeTabData.id === 'rep_creative_on_frequency') {
        e.stopPropagation();
      }
    };

    const getSwapCreativeVideo = (adid) => {
      if (adid) {
        creativesVideoStore.getVideoUrl(adid?.adid_meta_file_upload[0]?.id).then(
          (res) => {
            if (res && res?.success && res?.data) {
              setActiveModal('viewCreative');
              setCreativeModalData(res.data);
            } else {
              showAckErrorMessage({ message: 'No creative data available' });
            }
          },
          () => showAckErrorMessage({ message: 'Cannot get video file data for the creative.' })
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
    };

    useEffect(() => {
      if (repCreativeData && repCreativeData.length) {
        const wrapperElem = document.getElementById('table_wrapper_top');
        const mainElem = document.getElementById('table_top');
        if (wrapperElem.clientHeight > mainElem.clientHeight && nextPageUrl) {
          handlePagination();
        }
      }
    }, [repCreativeData]);

    const handleScroll = (e) => {
      const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
      if (bottom && nextPageUrl) {
        handlePagination();
      }
    };

    return (
      <div>
        <div>
          {activeTabData.id === 'rep_creative' ? (
            repCreativeData.length ? (
              <div>
                <div className="col-md-12 pb20">
                  <div className="pb10">Options For Replacement Creative</div>
                  <div>
                    <ReplacementCreativeTabs
                      repCreativeTabData={repCreativeTabData}
                      onChangeTabData={creativeData}
                      activeTabData={activeTabData}
                    />
                  </div>
                  <TabType className="col-md-12">
                    <div className="pt10 pb10">
                      <p>Please Choose the Message to swapped in</p>
                    </div>
                    <CardDivWrapper id="table_wrapper_top" onScroll={(e) => handleScroll(e)} ref={tableRef}>
                      <Row id="table_top">
                        {repCreativeData.map((data) => (
                          <Card key={data.id} className="ml10">
                            <div
                              className={
                                data.isSelected
                                  ? `col-md-6 card-box card-selected cursor-pointer`
                                  : `col-md-6 card-box cursor-pointer`
                              }
                              onClick={() => toggleDefaultAdIdSelection(data)}
                            >
                              <div className="col-md-1 pt10 card-checkbox">
                                <RadioButton
                                  value={data.id}
                                  isChecked={data.isSelected}
                                  onChange={() => toggleDefaultAdIdSelection(data)}
                                ></RadioButton>
                                <label></label>
                              </div>
                              <div className="col-md-9 pt10">
                                <CardTitleFlow>
                                  {data.ad_name} ({data.identifier})
                                </CardTitleFlow>
                                <MsgGrpCardTitle>Duration: {data.duration}sec</MsgGrpCardTitle>
                              </div>
                              <div className="col-md-2 pt10">
                                {data?.adid_meta_file_upload[0]?.s3_thumbnail_url ? (
                                  <div
                                    className="video-thumbnail video-thumbnail-small pt5"
                                    onClick={() => getSwapCreativeVideo(data)}
                                  >
                                    <img
                                      className="creative-thumb-small"
                                      src={data?.adid_meta_file_upload[0]?.s3_thumbnail_url}
                                    />
                                  </div>
                                ) : (
                                  <p>N/A</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </Row>
                    </CardDivWrapper>
                  </TabType>
                </div>
              </div>
            ) : (
              <div>
                <div className="col-md-12 pb20">
                  <div className="pb10">Options For Replacement Creative</div>
                  <div>
                    <ReplacementCreativeTabs
                      repCreativeTabData={repCreativeTabData}
                      onChangeTabData={creativeData}
                      activeTabData={activeTabData}
                    />
                    <TabType className="col-md-12">
                      <p className="pt10 pb10">No AdIds present for this product.</p>
                    </TabType>
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
        <CreativesAdPreviewModal
          showModal={activeModal === 'viewCreative'}
          closeModal={closeCreativesModalData}
          creativeModalData={creativeModalData}
        />
      </div>
    );
  })
);

ReplacementCreative.propTypes = {
  repCreativeData: PropTypes.array,
  toggleDefaultAdIdSelection: PropTypes.func,
  creativesVideoStore: PropTypes.object,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  tableRef: PropTypes.object,
};

ReplacementCreative.defaultProps = {
  repCreativeData: [],
  toggleDefaultAdIdSelection: () => {},
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default ReplacementCreative;
