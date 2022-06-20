import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, DropdownButton, MenuItem, FormGroup } from 'react-bootstrap';
import Slider from 'rc-slider';
import styled from 'styled-components';
import { Picky } from 'react-picky';
import { inject, observer } from 'mobx-react';

import AvailableFiltersModal from '../available-filters-modal';
import ReactPickyFilter, { PickyWrapper } from '../../../components/ReactPickyFilter';

import { hasProperty } from '../../../common/utils';

const StyledScrollBar = styled.div`
  max-height: 350px;
  width: 200px;
  overflow-y: auto !important;
`;

const DropDownInputWrapper = styled.div`
  max-width: 191px;
  width: 200px;
  height: 35px;
  margin-left: 5px;
  margin-bottom: 15px;
  & > input {
    font-size: 12px;
  }
`;

let timerId = null;

const ExperianFilters = inject('segmentStore')(
  observer((props) => {
    const {
      filtersForExperian,
      handleTabChangeFunctionsForExperian,
      type,
      handleSelectAllOrNoneFiltersForExperian,
      activeSubCategoryData,
      handleAutoTabFilters,
      handleUserInputFuncForExperian,
      segmentStore,
    } = props;

    const [availableFiltersModal, setAvailableFiltersModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const [optionList, setOptionList] = useState([]);

    const userInputHandler = (title, selectedValue) => {
      if (searchValue.length > 0 && title.filter_name === 'zip_code') {
        setSearchValue(selectedValue);
      }
      handleUserInputFuncForExperian({ selectedValue, title, filtersForExperian, activeSubCategoryData, type });
    };

    const handlSelectFilters = (id, title, type) => {
      handleSelectAllOrNoneFiltersForExperian(id, title, type, activeSubCategoryData);
    };

    const handleAutoSubCategoriesForFilters = (data) => {
      handleAutoTabFilters({ activeSubCategoryData, filtersForExperian, data });
    };

    const toggleAvailableFiltersModal = () => {
      setAvailableFiltersModal(!availableFiltersModal);
      document.activeElement.blur();
    };

    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const debounceFunction = (value, timeout) => {
      if (value.length === 0) {
        setOptionList([]);
        setShowDropDown(false);
      }
      setSearchValue(value);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        handleZipcodeSearch(value);
      }, timeout);
    };

    const handleZipcodeSearch = (value) => {
      if (value.length > 0) {
        segmentStore.getZipCode(value).then((res) => {
          if (res.data.length > 0) {
            setOptionList(res.data);
            setShowDropDown(true);
          } else {
            setOptionList([]);
            setShowDropDown(true);
          }
        });
      }
    };

    const getZipCodeContent = (filter, filterKey) => {
      const allOptions = filter.filter_name === 'state_code' ? [...filter.options[0].values] : [];

      return (
        <div className="col-md-6 mb20 target-segment-fields dropdown-scrollable" key={filterKey}>
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={
                type === 'experian_non_auto' || type === 'experian_quick'
                  ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                  : () => handleAutoSubCategoriesForFilters(filter)
              }
            ></span>
          </div>
          {filter.filter_name === 'zip_code' ? (
            <div>
              <DropDownInputWrapper className="dropdown">
                <input
                  type="text"
                  name="name"
                  value={searchValue}
                  className="combo-size-button dropdown-width-automobile"
                  placeholder={'search Zip Code'}
                  onChange={(e) => debounceFunction(e.target.value, 300)}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  autoFocus
                  aria-expanded="true"
                />
                {/* onBlur={(e) => onBlurInput(e, filter)} */}
              </DropDownInputWrapper>

              {showDropDown && (
                <StyledScrollBar>
                  {optionList.length === 0 && <span className="text-center">No search found</span>}
                  {optionList.map((val) => (
                    <div key={`zip_code_search_dropdown${val}`} className="checkbox-margin">
                      <label className="checkbox-inline">
                        <input
                          type="checkbox"
                          checked={filter.value.includes(val)}
                          onChange={() => userInputHandler(filter, val)}
                        />
                        <span className="v-align-middle"></span>
                        <span className="dropdown-text checkbox-text active v-align-middle">{val}</span>
                      </label>
                    </div>
                  ))}
                </StyledScrollBar>
              )}
            </div>
          ) : (
            <div>
              <PickyWrapper className="rct">
                <Picky
                  id="state-code"
                  options={allOptions}
                  value={filter.value}
                  multiple={true}
                  includeSelectAll={true}
                  onChange={(data) => userInputHandler(filter, data)}
                  selectAllText="Select All"
                  allSelectedPlaceholder="All"
                  numberDisplayed={0}
                  disabled={allOptions?.length === 0}
                  placeholder="Select an Option"
                />
              </PickyWrapper>
            </div>
          )}
        </div>
      );
    };

    const getDropdownContent = (filter, filterKey) => (
      <div className="col-md-6 mb20 target-segment-fields dropdown-scrollable" key={filterKey}>
        <div className="form-title">
          {filter.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={
              type === 'experian_non_auto' || type === 'experian_quick'
                ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                : () => handleAutoSubCategoriesForFilters(filter)
            }
          ></span>
        </div>
        <ButtonToolbar>
          <DropdownButton
            className="dropdown-width"
            title={filter.value || 'choose option'}
            id={`${filter.filter_name}-${filter.title}`}
          >
            {filter.options[0] &&
              filter.options[0].values &&
              filter.options[0].values.length &&
              filter.options[0].values.map((val, idx) => (
                <MenuItem
                  className="dropdown-width"
                  key={`${val}-${idx}-${filter.title}`}
                  onSelect={() => userInputHandler(filter, val)}
                >
                  {val}
                </MenuItem>
              ))}
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );

    const MultiselectContent = (filter, filterKey) => {
      const allOptions = filter?.options?.[0]?.values.length ? filter?.options?.[0]?.values.slice() : [];
      const selectedData = filter?.value?.length ? filter?.value.slice() : [];

      return (
        <div className="col-md-6 mb20 target-segment-fields dropdown-scrollable" key={filterKey}>
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={
                type === 'experian_non_auto' || type === 'experian_quick'
                  ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                  : () => handleAutoSubCategoriesForFilters(filter)
              }
            ></span>
          </div>

          <ReactPickyFilter
            allOptions={allOptions}
            selectedData={selectedData}
            onChange={(data) => userInputHandler(filter, data)}
            id={filterKey}
            selectAllText="Select All Options"
            allSelectedPlaceholder="All Options"
          />
        </div>
      );
    };

    const getSingleSliderContent = (filter, filterKey) => {
      if (filter.title === 'Age') {
        const createSliderWithTooltip = Slider.createSliderWithTooltip;
        const Range = createSliderWithTooltip(Slider.Range);
        return (
          <div key={filterKey}>
            <div className="form-title">
              {filter.title}&nbsp;&nbsp;&nbsp;
              <span
                className="glyphicon glyphicon-remove"
                onClick={
                  type === 'experian_non_auto' || type === 'experian_quick'
                    ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                    : () => handleAutoSubCategoriesForFilters(filter)
                }
              ></span>
            </div>
            <div className="slider-shopper">
              <Range
                allowCross={false}
                dots
                min={19}
                max={99}
                step={1}
                defaultValue={[filter.value[0], filter.value[1]]}
                marks={filter.optionsArray.tooltip}
                onAfterChange={(e) => userInputHandler(filter, e)}
              />
            </div>
            <div className="range-width"></div>
            <br />
          </div>
        );
      } else {
        if (filter.value === '') {
          userInputHandler(filter, filter.optionsArray.tooltip[1]);
        }
        return (
          <div key={filterKey}>
            <div className="form-title">
              {filter.title}&nbsp;&nbsp;&nbsp;
              <span
                className="glyphicon glyphicon-remove"
                onClick={
                  type === 'experian_non_auto' || type === 'experian_quick'
                    ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                    : () => handleAutoSubCategoriesForFilters(filter)
                }
              ></span>
            </div>

            <div className="slider-shopper experian-slider">
              <Slider
                min={filter.minOption}
                max={filter.maxOption}
                defaultValue={[
                  Object.keys(filter.optionsArray.tooltip).find(
                    (key) => filter.optionsArray.tooltip[key] === filter.value
                  ),
                ]}
                marks={filter.optionsArray.tooltip}
                step={null}
                onAfterChange={(e) => userInputHandler(filter, filter.optionsArray.tooltip[e])}
                tipFormatter={(e) => filter.options[0].values[e] - 1}
              />
            </div>
            <div className="range-width"></div>
            <br />
          </div>
        );
      }
    };

    const getRadioContent = (filter, filterKey) => (
      <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
        <div className="form-title">
          {filter.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={
              type === 'experian_non_auto' || type === 'experian_quick'
                ? () => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)
                : () => handleAutoSubCategoriesForFilters(filter)
            }
          ></span>
        </div>
        <div>
          <FormGroup>
            {filter.options[0].values.map((val, index) => (
              <label className="distribute distribute-freq" role="button" key={`${val.name}-${index}-${filter.title}`}>
                <input
                  type="radio"
                  className=""
                  name={`${filter.title}-radioGroup`}
                  checked={val.name === filter.value || val === filter.value}
                  onChange={() => userInputHandler(filter, val.name ? val.name : val)}
                />
                <span className="v-align-middle"></span>
                <span className="dropdown-text radio-text active v-align-middle">{val}</span>
              </label>
            ))}
          </FormGroup>
        </div>
      </div>
    );

    const getCheckboxContent = (filter, filterKey) => (
      <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
        <div className="form-title">
          {filter.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={() => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)}
          ></span>
        </div>
        <div title={filter.value || 'choose option'} id={filter.title}>
          {filter.options.map((val) => (
            <div key={val} className="checkbox-margin">
              <label className="checkbox-inline">
                <input
                  type="checkbox"
                  checked={hasProperty(filter, 'isValue') ? filter.isValue : filter.value !== ''}
                  onChange={() => userInputHandler(filter, val.values[0])}
                />
                <span className="v-align-middle"></span>
                <span className="dropdown-text checkbox-text active v-align-middle">{val.values[0]}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );

    const getMosaicCodeContent = (filter, filterKey) => (
      <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
        <div className="form-title">
          {filter.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={() => handleTabChangeFunctionsForExperian(filtersForExperian, filter, type, activeSubCategoryData)}
          ></span>
        </div>
        <div>
          {filter.options.map((val) => (
            <div key={val.val + filterKey} role="button" onClick={() => userInputHandler(filter, val)}>
              <div className="checkbox-inline mb5">
                <label className="checkbox-inline">
                  <input type="checkbox" onChange={() => userInputHandler(filter, val)} checked={val.isValueSelected} />
                  <span className="v-align-middle"></span>
                  <span className="dropdown-text checkbox-text active v-align-middle">{val.val}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const getFilterConent = () => (
      <div className="input-dir-wrapper form-row form-container">
        {filtersForExperian.filters.map((filter) => {
          if (filter.isFilterSelected) {
            const filterKey = `${type}-${filter.filter_name}-sub-categories`;
            return (
              <div key={filter.filter_name}>
                {filter.field_type === 'multi-select-dropdown' && MultiselectContent(filter, filterKey)}
                {filter.field_type === 'dropdown' && getDropdownContent(filter, filterKey)}
                {filter.field_type === 'slider' && getSingleSliderContent(filter, filterKey)}
                {filter.field_type === 'radio' && getRadioContent(filter, filterKey)}
                {filter.field_type === 'table' && getCheckboxContent(filter, filterKey)}
              </div>
            );
          }
          return null;
        })}
      </div>
    );

    const getExperianQuickFilters = () => (
      <div className="input-dir-wrapper form-row form-container">
        {filtersForExperian.template.filters.map((filter, index) => {
          if (filter.isFilterSelected) {
            const filterKey = `${type}-${filter.filter_name}-quick-${index}`;
            return (
              <div className={filterKey}>
                {filter.field_type === 'dropdown' && getDropdownContent(filter, filterKey)}
                {filter.field_type === 'multi-select-dropdown' &&
                  filtersForExperian.name !== 'Geographic' &&
                  MultiselectContent(filter, filterKey)}
                {filter.field_type === 'slider' && getSingleSliderContent(filter, filterKey)}
                {filter.field_type === 'radio' && getRadioContent(filter, filterKey)}
                {filter.field_type === 'table' && getCheckboxContent(filter, filterKey)}
                {filter.field_type === 'multi-select-dropdown' &&
                  filtersForExperian.name === 'Geographic' &&
                  getZipCodeContent(filter, filterKey)}
                {filter.field_type === 'checkbox' &&
                  filter.filter_name === 'mosaic_global_household' &&
                  getMosaicCodeContent(filter, filterKey)}
              </div>
            );
          }
          return null;
        })}
      </div>
    );

    return (
      <div key={`experian_content`} className="experian-filter-container-height">
        <form>
          <div className="form-container">
            <div className="input-dir-wrapper form-row">
              {hasProperty(filtersForExperian, 'template') ? getExperianQuickFilters() : getFilterConent()}
            </div>
            <div style={{ maxWidth: 250 }}>
              <div className="add-category-tab">
                <a href="" className="add-filters segement-add-remove-button" onClick={toggleAvailableFiltersModal}>
                  Add/Remove Filters
                </a>
              </div>
            </div>
          </div>
        </form>
        <AvailableFiltersModal
          activeSubCategoryData={activeSubCategoryData}
          showModal={availableFiltersModal}
          toggleModal={toggleAvailableFiltersModal}
          handleSelectAllOrNoneFunc={handlSelectFilters}
          handleTabChangeFunc={
            type === 'experian_auto' ? handleAutoSubCategoriesForFilters : handleTabChangeFunctionsForExperian
          }
          filterData={filtersForExperian}
          type={type}
        />
      </div>
    );
  })
);

ExperianFilters.propTypes = {
  filtersForExperian: PropTypes.object,
  handleTabChangeFunctionsForExperian: PropTypes.func,
  type: PropTypes.string,
  handleSelectAllOrNoneFiltersForExperian: PropTypes.func,
  activeSubCategoryData: PropTypes.object,
  handleAutoTabFilters: PropTypes.func,
  handleUserInputFuncForExperian: PropTypes.func,
  segmentStore: PropTypes.object,
};

export default ExperianFilters;
