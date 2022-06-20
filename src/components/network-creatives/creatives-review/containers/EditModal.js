import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import _ from 'lodash';

import withStore from '../../../../hocs/WithStore';

import CustomButton from '../../../CustomButton';

import { showAckErrorMessage } from '../../../../common/utils';

import SelectedDaypartsTable from '../components/SelectedDaypartsTable';
import NetworkListSelector from '../components/NetworkListSelector';
import SelectDaypartsCheckboxTable from '../components/SelectDaypartsCheckboxTable';

const NetworkNameSpan = styled.span`
  word-break: break-word;
  display: inline !important;
  font-weight: 600 !important;
`;

const TableButton = styled.button`
  width: auto !important;
  text-align: center !important;
  font-size: 12px;
  padding: 0px 15px !important;
  background-color: #98c22a;
  color: #fff;
  border: 1px solid #98c22a;
  min-height: 35px;
`;

const EditModal = inject('networkStore')(
  observer((props) => {
    const {
      showModal,
      closeModal,
      networkStore,
      modalData,
      handleSuccessResponse,
      modalType,
      channels,
      selectedTab,
      modalClass,
    } = props;

    const [networksList, setNetworksList] = useState([]);
    const [activeNetworkData, setActiveNetworkData] = useState({ data: {} });
    const [selectedNetworkList, setSelectedNetworkList] = useState([]);
    const [selectedNetworkListCpy, setSelectedNetworkListCpy] = useState([]);
    const [editDaypartsData, setEditDaypartsData] = useState({});
    const [editDaypartsDataCpy, setEditDaypartsDataCpy] = useState({});

    const approveCreative = () => {
      if (selectedNetworkList && selectedNetworkList.length) {
        const channelDaypartData = {};
        selectedNetworkList.forEach((data) => {
          const dayPartsArray = [];
          data.dayparts.forEach((daypart) => {
            if (daypart.isSelected) {
              dayPartsArray.push(daypart.id);
            }
          });
          channelDaypartData[data.id] = dayPartsArray;
        });
        const payload = {
          identifier: modalData?.adid_meta_file_upload?.[0]?.identifier,
          channel_daypart_data: channelDaypartData,
        };

        if (modalType === 'edit' || selectedTab.id === 'nt_cr_declined') {
          networkStore.editApproveCreative(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data?.success) {
                  handleSuccessResponse(modalType);
                } else showAckErrorMessage({ message: res.data?.message ?? 'Something went wrong while Updating!' });
              } else showAckErrorMessage({ message: res?.data?.message ?? 'Soemthing went wrong while Updating!' });
            },
            () => showAckErrorMessage()
          );
        } else {
          networkStore.approveCreative(payload).then(
            (res) => {
              if (res && res.status === 200) {
                if (res.data?.success) {
                  handleSuccessResponse(modalType);
                } else showAckErrorMessage({ message: res.data?.message ?? 'Something went wrong while Approving!' });
              } else showAckErrorMessage({ message: res?.data?.message ?? 'Something went wrong while Approving!' });
            },
            () => showAckErrorMessage()
          );
        }
      }
    };

    const processNetworks = () => {
      const _networksList = JSON.parse(JSON.stringify(channels));
      _networksList.map((network) => {
        if (network.dayparts && network.dayparts.length) {
          network.dayparts.map((daypart) => (daypart.isSelected = true));
        }
        return network;
      });
      setNetworksList(_networksList);
    };

    const prepareEditCreativeData = () => {
      if (modalData.channelDaypartApprovedList && modalData.channelDaypartApprovedList.length) {
        const _selectedDataForEdit = JSON.parse(JSON.stringify(channels));
        const approvedData = [];
        modalData.channelDaypartApprovedList.forEach((stchannel) => {
          const obj = {};
          const keysList = Object.keys(stchannel);
          obj.channelId = Number(keysList[0]);
          const channels = stchannel[keysList[0]];
          if (channels && channels.length) {
            obj.daypartsId = channels.map((d) => d?.daypart?.id);
            obj.activeTradeDetails = channels.map((d) => ({
              id: d?.daypart?.id,
              isTradeActive: d.is_in_active_trade,
            }));
          }
          approvedData.push(obj);
        });
        _selectedDataForEdit.map((ed) => {
          const approvedDataIndex = approvedData.findIndex((ad) => ad.channelId === ed.id);
          if (approvedDataIndex !== -1) {
            const selectedApprovedData = approvedData[approvedDataIndex];
            ed.dayparts.forEach((dp) => {
              if (selectedApprovedData.daypartsId.includes(dp.id)) {
                const atd = selectedApprovedData.activeTradeDetails.find((atd) => atd.id === dp.id);
                dp.isTradeActive = atd.isTradeActive;
                dp.isSelected = true;
              } else {
                dp.isTradeActive = false;
                dp.isSelected = false;
              }
            });
          }
          const filterd = ed.dayparts.filter((dps) => {
            if (dps.isSelected) {
              return true;
            }
            return false;
          });
          if (filterd && filterd.length) {
            ed.selected = true;
          } else {
            ed.selected = false;
          }
          return ed;
        });

        const _selectedNetworkList = _selectedDataForEdit.filter((d) => d.selected);
        _selectedNetworkList.forEach((d) => {
          d.isNonRemovable = true;
        });
        setSelectedNetworkList(_selectedNetworkList);
        setSelectedNetworkListCpy(_selectedNetworkList);

        const _networksList = _selectedDataForEdit.filter((d) => !d.selected);
        _networksList.map((network) => {
          if (network.dayparts && network.dayparts.length) {
            network.dayparts.map((daypart) => (daypart.isSelected = true));
          }
          return network;
        });
        setNetworksList(_networksList);
      }
    };

    const addButtonClassName = (networkData) => {
      if (networkData && networkData.dayparts && networkData.dayparts.length) {
        let daypartCount = 0;
        networkData.dayparts.map((item) => {
          if (item.isSelected) {
            daypartCount = daypartCount + 1;
          }
          return item;
        });
        if (daypartCount === 0) {
          return true;
        }
      }
      return false;
    };

    const getDaypartInfo = (daypart) =>
      `${daypart.start_time} - ${daypart.end_time} ${getAiringDays(daypart.airing_days)}`;

    const getAiringDays = (airingDays) => {
      const daysInNum = JSON.parse(JSON.stringify(airingDays));
      if (daysInNum && daysInNum.length) {
        const defaultDays = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
        const daysInText = daysInNum.map((d) => defaultDays[d]);
        return daysInText.join(', ');
      }
      return '';
    };

    const createApprovalAction = (type, selectedData = null) => {
      if (type === 'add') {
        const selectedDayparts = activeNetworkData.data.dayparts.filter((data) => data.isSelected);
        if (!selectedDayparts.length) {
          showAckErrorMessage({ message: 'Please select atleast 1 daypart' });
          return;
        }
        const _selectedNetworkList = JSON.parse(JSON.stringify(selectedNetworkList));
        _selectedNetworkList.push(activeNetworkData.data);
        setSelectedNetworkList(_selectedNetworkList);
        const activeNetworkIndex = networksList.findIndex((data) => data.id === activeNetworkData.data.id);
        if (activeNetworkIndex !== -1) {
          const _networksList = JSON.parse(JSON.stringify(networksList));
          _networksList.splice(activeNetworkIndex, 1);
          setNetworksList(_networksList);
        }
        setActiveNetworkData({ data: {} });
      } else if (type === 'remove') {
        const selectedDataIndex = selectedNetworkList.findIndex((data) => data.id === selectedData.id);
        if (selectedDataIndex !== -1) {
          const _networksList = JSON.parse(JSON.stringify(networksList));
          const _selectedNetworkList = JSON.parse(JSON.stringify(selectedNetworkList));
          const parsedData = selectedNetworkList[selectedDataIndex];
          parsedData.dayparts.map((data) => {
            data.isSelected = true;
            return data;
          });
          _networksList.push(parsedData);
          setNetworksList(_networksList);
          _selectedNetworkList.splice(selectedDataIndex, 1);
          setSelectedNetworkList(_selectedNetworkList);
        }
      } else if (type === 'edit') {
        const _selectedData = JSON.parse(JSON.stringify(selectedData));
        setEditDaypartsData(_selectedData);
        setEditDaypartsDataCpy(_selectedData);
      } else if (type === 'add_edited_data') {
        const indexVal = selectedNetworkList.findIndex((d) => d.id === editDaypartsData.id);
        if (indexVal !== -1) {
          const _selectedNetworkList = JSON.parse(JSON.stringify(selectedNetworkList));
          _selectedNetworkList[indexVal] = editDaypartsData;
          setSelectedNetworkList(_selectedNetworkList);
        }
        closeEditAccordian();
      }
    };

    const closeEditAccordian = () => {
      setEditDaypartsData(null);
    };

    useEffect(() => {
      processNetworks();
      if (modalType === 'edit') {
        prepareEditCreativeData();
      }
    }, [modalData]);

    return (
      <Modal show={showModal} onHide={closeModal} dialogClassName={modalClass}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'approve' && 'Creative Approval'}
            {modalType === 'edit' && 'Edit Approved Creative'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <SelectedDaypartsTable
              selectedNetworkList={selectedNetworkList}
              getDaypartInfo={getDaypartInfo}
              createApprovalAction={createApprovalAction}
              editDaypartsData={editDaypartsData}
              editDaypartsDataCpy={editDaypartsDataCpy}
              NetworkNameSpan={NetworkNameSpan}
              closeEditAccordian={closeEditAccordian}
              setEditDaypartsData={setEditDaypartsData}
              TableButton={TableButton}
              addButtonClassName={addButtonClassName}
            />
            {networksList && networksList.length && (
              <>
                <NetworkListSelector networksList={networksList} setActiveNetworkData={setActiveNetworkData} />
                <SelectDaypartsCheckboxTable
                  activeNetworkData={activeNetworkData}
                  NetworkNameSpan={NetworkNameSpan}
                  setActiveNetworkData={setActiveNetworkData}
                  getDaypartInfo={getDaypartInfo}
                  addButtonClassName={addButtonClassName}
                  createApprovalAction={createApprovalAction}
                  TableButton={TableButton}
                />
              </>
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            buttonClassName={
              !selectedNetworkList.length || _.isEqual(selectedNetworkList, selectedNetworkListCpy)
                ? 'disabled-button block-pointer mr10'
                : 'mr10'
            }
            type="primary"
            buttonText="Confirm"
            handleButtonClick={approveCreative}
          />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

EditModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  handleSuccessResponse: PropTypes.func,
  modalType: PropTypes.string,
  channels: PropTypes.array,
  modalData: PropTypes.object,
  selectedTab: PropTypes.object,
  modalClass: PropTypes.string,
};

export default withStore(EditModal);
