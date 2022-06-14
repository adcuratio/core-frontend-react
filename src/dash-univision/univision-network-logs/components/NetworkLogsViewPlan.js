import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';
import ReactPickyFilter from '../../../components/ReactPickyFilter';

import TableContainer from './TableViewContainer';

export const TableWrapper = styled.div`
  max-height: calc(100vh - 300px);
  overflow-y: scroll;
`;
export const SearchBoxWrapper = styled.div`
  width: 285px;
  border: 1px solid black;
  display: flex;
`;

export const SearchBoxInput = styled.input`
  width: 88% !important;
  border: none !important;
  border-right: 1px solid #b4b8bb !important;
`;

export const SearchButton = styled.button`
  width: 13% !important;
  border: none;
  background-color: #fff;
  padding: 0;
`;

export const RemoveIcon = styled.i`
  font-size: 15px;
`;

let timerId = null;

const NetworkLogsViewPlan = (props) => {
  const {
    viewPlanModal,
    toggleModal,
    selectedPlanToView,
    numOfPages,
    selectedPlanList,
    viewPlan,
    handleSearchTextForModal,
    searchValueForModal,
    selectedPlan,
    setSearchValueForModal,
    buttonId,
    isviewSchedules,
  } = props;

  const [newAneLogJsonData, setNewAneLogJsonData] = useState([]);
  const [selectedColumnOption, setSelectedColumnOption] = useState([]);
  const [allColumnOptions, setAllColumnOptions] = useState([]);
  const [currentMouseLocation, setCurrentMouseLocation] = useState('');
  const [isTooltipShow, setIsToolTipShow] = useState(false);
  const [isClickedNext, setIsClickedNext] = useState(false);
  const divRef = useRef();

  const getSelectedColumnOptions = (colData) => {
    const selectedColumOption = [];
    if (!selectedColumnOption.length) {
      colData?.forEach((fil) => {
        if (fil.isSelected) {
          selectedColumOption.push(fil.name);
        }
      });
    }
    setSelectedColumnOption(selectedColumOption);
  };

  const getAllColumnOptions = (data) => {
    const columnOption = [];
    if (data.length !== 0) {
      data?.forEach((fil) => {
        columnOption.push(fil.name);
      });
    }
    setAllColumnOptions(columnOption);
  };

  const saveColumnPrefs = () => {
    localStorage.setItem('networkColPrefs2020x2', JSON.stringify(newAneLogJsonData));
  };

  const init = () => {
    const allColumns = [];
    for (const col in selectedPlanToView[0]) {
      if (!['BUYBACK', 'ADDRESSABLE', 'LB_SEGMENT'].includes(col)) {
        const columnCreate = {
          id: col.replace(/_/g, ' '),
          name: col.replace(/_/g, ' ').toLowerCase(),
          dataProp: col,
          applyFilter: true,
          isSelected: true,
          isVisible: false,
        };
        allColumns.push(columnCreate);
      }
    }

    let tempAneDataForColumn = [];
    if (localStorage.getItem('networkColPrefs2020x2') !== null) {
      tempAneDataForColumn = [...JSON.parse(localStorage.getItem('networkColPrefs2020x2'))];
    } else {
      tempAneDataForColumn = [...allColumns];
    }
    getSelectedColumnOptions(tempAneDataForColumn);
    getAllColumnOptions(tempAneDataForColumn);
    setNewAneLogJsonData(tempAneDataForColumn);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (isClickedNext && divRef) {
      scrollToTop();
      setIsClickedNext(false);
    }
  }, [isClickedNext]);

  const scrollToTop = () => {
    divRef.current.scrollTop = 0;
    divRef.current.scrollLeft = 0;
  };

  const handleTableColumns = (selectedCols) => {
    let tempAneLogData = [...newAneLogJsonData];
    tempAneLogData?.forEach((ane) => {
      if (selectedCols.includes(ane.name)) {
        ane.isSelected = true;
        ane.isVisible = true;
      } else {
        ane.isSelected = false;
        ane.isVisible = false;
      }
    });
    const defaultType = tempAneLogData?.filter((a) => a.type === 'default');
    const notDefaultType = tempAneLogData?.filter((a) => a.type !== 'default');
    tempAneLogData = [...defaultType, ...notDefaultType];
    saveColumnPrefs(tempAneLogData);
    setNewAneLogJsonData(tempAneLogData);
    setSelectedColumnOption(selectedCols);
  };

  const togglePage = (pageType) => {
    if (isviewSchedules === false) {
      if (pageType === 'next') {
        viewPlan(buttonId, selectedPlan.id, selectedPlanList.next);
        setIsClickedNext(true);
      } else if (pageType === 'prev') {
        viewPlan(buttonId, selectedPlan.id, selectedPlanList.previous);
        setIsClickedNext(true);
      }
      return selectedPlanList.next ? parseInt(selectedPlanList.next.split('=')[1].split('&')) - 1 : numOfPages;
    } else {
      if (pageType === 'next') {
        viewPlan(buttonId, selectedPlanList.next);
        setIsClickedNext(true);
      } else if (pageType === 'prev') {
        viewPlan(buttonId, selectedPlanList.previous);
        setIsClickedNext(true);
      }
      return selectedPlanList.next ? parseInt(selectedPlanList.next.split('=')[1].split('&')) - 1 : numOfPages;
    }
  };

  const toggleTooltip = (heading, isShow = false) => {
    if (isShow) {
      setCurrentMouseLocation(heading.id);
      setIsToolTipShow(true);
    } else {
      setCurrentMouseLocation('');
      setIsToolTipShow(false);
    }
  };

  const handleColumnRemovalThroughTooltip = (heading) => {
    const tempAneLogData = [...newAneLogJsonData];
    const indexOfColumn = tempAneLogData.indexOf(heading);
    tempAneLogData[indexOfColumn].isSelected = false;
    tempAneLogData[indexOfColumn].isVisible = false;
    const tempSelectedCols = selectedColumnOption?.filter((item) => item !== heading.name);
    saveColumnPrefs(tempAneLogData);
    setNewAneLogJsonData(tempAneLogData);
    setSelectedColumnOption(tempSelectedCols);
  };

  const debounceFunctionUnivsion = (value, mainFunc, timeout) => {
    setSearchValueForModal(value);
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      mainFunc(selectedPlan, value);
    }, timeout);
  };

  return (
    <Modal
      show={viewPlanModal}
      onHide={toggleModal}
      aria-labelledby="contained-modal-title-lg"
      dialogClassName="modal-90w"
      className="network-logs-modal-scroll"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="flex-container2">
            <div className="flex-container2">
              <span className="mr20">View Adspot Details</span>
              <SearchBoxWrapper>
                <SearchBoxInput
                  type="text"
                  value={searchValueForModal}
                  onChange={(e) => debounceFunctionUnivsion(e.target.value, handleSearchTextForModal, 500)}
                  autoComplete="off"
                ></SearchBoxInput>
                <SearchButton
                  type="submit"
                  onClick={searchValueForModal ? () => handleSearchTextForModal(selectedPlan, '') : null}
                >
                  <RemoveIcon className="fa fa-times"></RemoveIcon>
                </SearchButton>
              </SearchBoxWrapper>
            </div>
            <div className="flex-container2 mr55">
              Select columns to Show/Hide:
              <ReactPickyFilter
                allOptions={allColumnOptions}
                selectedData={selectedColumnOption}
                onFilterChange={handleTableColumns}
                id="ane-log"
                selectAllText="Select All"
                allSelectedPlaceholder="All"
                placeholder="Select an Option"
              />
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TableWrapper ref={divRef}>
          <TableContainer
            selectedColumnOption={selectedColumnOption}
            newAneLogJsonData={newAneLogJsonData}
            toggleTooltip={toggleTooltip}
            isTooltipShow={isTooltipShow}
            currentMouseLocation={currentMouseLocation}
            handleColumnRemovalThroughTooltip={handleColumnRemovalThroughTooltip}
            selectedPlanToView={selectedPlanToView}
          />
        </TableWrapper>
      </Modal.Body>
      <Modal.Footer>
        {!isNaN(togglePage()) && isFinite(togglePage()) && isFinite(numOfPages) && (
          <p className="float-left">
            Page {togglePage()} of {numOfPages}
          </p>
        )}
        <CustomButton
          isDisabled={!selectedPlanList.previous}
          type="primary"
          buttonText="Previous"
          handleButtonClick={() => togglePage('prev')}
          buttonClassName="mr10"
        />
        <CustomButton
          isDisabled={!selectedPlanList.next}
          type="primary"
          buttonText="Next"
          handleButtonClick={() => togglePage('next')}
          buttonClassName="mr10"
        />
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

NetworkLogsViewPlan.propTypes = {
  viewPlanModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  selectedPlanToView: PropTypes.array,
  numOfPages: PropTypes.number,
  selectedPlanList: PropTypes.object,
  viewPlan: PropTypes.func,
  handleSearchTextForModal: PropTypes.func,
  searchValueForModal: PropTypes.string,
  selectedPlan: PropTypes.object,
  setSearchValueForModal: PropTypes.func,
  buttonId: PropTypes.string,
  isviewSchedules: PropTypes.bool,
};

NetworkLogsViewPlan.defaultProps = {
  viewPlanModal: true,
  toggleModal: () => {},
  selectedPlanToView: [],
  numOfPages: 1,
  selectedPlanList: {},
  viewPlan: () => {},
  handleSearchTextForModal: () => {},
  searchValueForModal: '',
  selectedPlan: {},
  setSearchValueForModal: () => {},
  buttonId: '',
  isviewSchedules: true,
};

export default NetworkLogsViewPlan;
