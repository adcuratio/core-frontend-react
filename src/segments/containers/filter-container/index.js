import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ButtonToolbar,
  DropdownButton,
  MenuItem,
  FormGroup,
  Table,
} from "react-bootstrap";
import Slider from "rc-slider";
import AvailableFiltersModal from "../../components/available-filters-modal";

import CreditCard from "../../components/credit-card";

import "rc-slider/assets/index.css";
import "../../../styles/unwantedGroup.css";

const FilterContainer = (props) => {
  // component to show different types of filters available
  const {
    allFilters,
    lite,
    handleTabChangeFunc,
    handleUserInputFunc,
    handleSelectAllOrNoneFunc,
    handleAddRemoveFunc,
    handleTitleTabChangeForCredit,
    handleSelectAllForCategories,
    type,
  } = props;

  const [availableFiltersModal, setAvailableFiltersModal] = useState(false);

  const toggleAvailableFiltersModal = () => {
    setAvailableFiltersModal(!availableFiltersModal);
    document.activeElement.blur();
  };

  const userInputHandler = (title, selectedValue, comboFilterName) => {
    if (comboFilterName) {
      const temp = [comboFilterName, selectedValue];
      handleUserInputFunc([lite, title, temp], "non_credit");
    } else {
      handleUserInputFunc([lite, title, selectedValue], "non_credit");
    }
  };

  const isAllCategoryNone = () => {
    let isAllNone = false;
    allFilters.forEach((fil) => {
      if (fil.isSelected) {
        isAllNone = true;
      }
    });
    return isAllNone;
  };

  const getDropdownContent = (filter, filterKey) => {
    if (filter.title === "Individual Age") {
      return (
        <div
          className="col-md-6 mb20 target-segment-fields dropdown-scrollable"
          key={filterKey}
        >
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => handleTabChangeFunc(lite, filter)}
            ></span>
          </div>
          <span>min :</span>
          <ButtonToolbar>
            <DropdownButton
              className="dropdown-width"
              title={filter.min || "choose option"}
              id={`min-${filter.title}`}
            >
              {filter.options[0].values.map((val) => (
                <MenuItem
                  className="dropdown-width"
                  key={val}
                  onSelect={() => userInputHandler(filter, val, "min")}
                >
                  {val}
                </MenuItem>
              ))}
            </DropdownButton>
          </ButtonToolbar>
          <span>max :</span>
          <ButtonToolbar>
            <DropdownButton
              className="dropdown-width"
              title={filter.max || "choose option"}
              id={`max-${filter.title}`}
            >
              {filter.options[1].values.map((val) => (
                <MenuItem
                  className="dropdown-width"
                  key={val}
                  onSelect={() => userInputHandler(filter, val, "max")}
                >
                  {val}
                </MenuItem>
              ))}
            </DropdownButton>
          </ButtonToolbar>
        </div>
      );
    } else {
      return (
        <div
          className="col-md-6 mb20 target-segment-fields dropdown-scrollable"
          key={filterKey}
        >
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => handleTabChangeFunc(lite, filter)}
            ></span>
          </div>

          <ButtonToolbar>
            <DropdownButton
              className="dropdown-width"
              title={filter.value || "choose option"}
              id={`${filter.filter_name}-${filter.title}`}
            >
              {filter.options[0] &&
                filter.options[0].values &&
                filter.options[0].values.length &&
                filter.options[0].values.map((val) => (
                  <MenuItem
                    className="dropdown-width"
                    key={val}
                    onSelect={() => userInputHandler(filter, val)}
                  >
                    {val}
                  </MenuItem>
                ))}
            </DropdownButton>
          </ButtonToolbar>
        </div>
      );
    }
  };

  const getCheckboxContent = (filter, filterKey) => (
    <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
      <div className="form-title">
        {filter.title}&nbsp;&nbsp;&nbsp;
        {filter.title === '"Personas"' ? (
          <span
            className="glyphicon glyphicon-remove"
            onClick={() => handleTabChangeFunc(lite, filter)}
          ></span>
        ) : null}
      </div>
      <div title={filter.value || "choose option"} id={filter.title}>
        {filter.options.map((val) => (
          <div key={val} className="checkbox-margin">
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={filter.value.indexOf(val) !== -1}
                onChange={() => userInputHandler(filter, val)}
              />
              <span className="v-align-middle"></span>
              <span className="dropdown-text checkbox-text active v-align-middle">
                {val}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
  const getComboContentForChildren = (filter, filterKey) => {
    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    return (
      <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
        <div className="form-title">
          {filter.handler_field.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={() => handleTabChangeFunc(lite, filter)}
          ></span>
          <div>
            <FormGroup>
              <label className="distribute distribute-freq" role="button">
                <input
                  checked={filter.handler_field.value === "Yes"}
                  type="radio"
                  className=""
                  name="radioGroup"
                  onChange={() => userInputHandler(filter, "Yes")}
                />
                <span className="v-align-middle"></span>
                <span className="dropdown-text radio-text active v-align-middle">
                  {filter.handler_field.options[0].values[0]}
                </span>
              </label>
              <label className="distribute distribute-freq" role="button">
                <input
                  checked={filter.handler_field.value === "No"}
                  type="radio"
                  className=""
                  name="radioGroup"
                  onChange={() => userInputHandler(filter, "No")}
                />
                <span className="v-align-middle"></span>
                <span className="dropdown-text radio-text active v-align-middle">
                  {filter.handler_field.options[0].values[1]}
                </span>
              </label>
            </FormGroup>
            {filter.handler_field.value === "Yes" && (
              <div className="form-title">
                {filter.key_value_map_if_children_present[0].title}
                <ButtonToolbar>
                  <DropdownButton
                    title={filter.value || "choose option"}
                    id={filter.filter_name}
                    className="combo-size-button"
                  >
                    {filter.key_value_map_if_children_present[0].options[0].values.map(
                      (val) => (
                        <MenuItem
                          key={val}
                          onSelect={() => userInputHandler(filter, val)}
                        >
                          {val}
                        </MenuItem>
                      )
                    )}
                  </DropdownButton>
                </ButtonToolbar>
              </div>
            )}
          </div>
        </div>
        <div>
          {filter.value !== "Any" &&
            filter.handler_field.value === "Yes" &&
            filter.comboFilters?.map((comboFilter, cfIndex) => (
              <div key={filter.handler_field.filter_name + cfIndex}>
                <br />
                {comboFilter.map((multiFilter, mfIndex) => (
                  <div key={multiFilter.title + mfIndex}>
                    {multiFilter.filter_name === "gender" && (
                      <ButtonToolbar>
                        <div className="form-title">
                          &nbsp;&nbsp;{multiFilter.title.slice(0, -1)}
                        </div>
                        <DropdownButton
                          title={multiFilter.value || "choose option"}
                          id={multiFilter.title}
                          className="combo-size-button"
                        >
                          {multiFilter.options[0].values.map((val) => (
                            <MenuItem
                              key={val}
                              onSelect={() =>
                                userInputHandler(filter, val, multiFilter.title)
                              }
                            >
                              {val}
                            </MenuItem>
                          ))}
                        </DropdownButton>
                      </ButtonToolbar>
                    )}
                    {multiFilter.type === "range" && (
                      <div>
                        <br />
                        <div className="form-title">
                          &nbsp;&nbsp;{multiFilter.title.slice(0, -1)}
                        </div>
                        <Range
                          allowCross={false}
                          dots
                          max={Object.keys(multiFilter.tooltip).length - 1}
                          step={1}
                          defaultValue={[
                            multiFilter.value[0],
                            multiFilter.value[1],
                          ]}
                          marks={multiFilter.tooltip}
                          onAfterChange={(e) =>
                            userInputHandler(filter, e, multiFilter.title)
                          }
                        />
                        <div className="range-width"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          {filter.value === "Any" && filter.handler_field.value === "Yes" && (
            <div>
              <ButtonToolbar>
                <div className="form-title">
                  &nbsp;&nbsp;{filter.key_value_map_any.title}
                </div>
                <DropdownButton
                  title={filter.key_value_map_any.value || "choose option"}
                  id={filter.key_value_map_any.title}
                  className="combo-size-button"
                >
                  {filter.key_value_map_any.options[0].values.map((val) => (
                    <MenuItem
                      key={val}
                      onSelect={() =>
                        userInputHandler(
                          filter,
                          val,
                          filter.key_value_map_any.filter_name
                        )
                      }
                    >
                      {val}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </ButtonToolbar>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getComboContent = (filter, filterKey) => (
    <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
      <div className="form-title">
        {filter.handler_field_present.title}&nbsp;&nbsp;&nbsp;
        <span
          className="glyphicon glyphicon-remove"
          onClick={() => handleTabChangeFunc(lite, filter)}
        ></span>
        <FormGroup>
          <label className="distribute distribute-freq" role="button">
            <input
              checked={filter.handler_field_present.value === "Yes"}
              type="radio"
              className=""
              name="radioGroup"
              onChange={() => userInputHandler(filter, "Yes")}
            />
            <span className="v-align-middle"></span>
            <span className="dropdown-text radio-text active v-align-middle">
              {filter.handler_field_present.options[0].values[0]}
            </span>
          </label>
          <label className="distribute distribute-freq" role="button">
            <input
              checked={filter.handler_field_present.value === "No"}
              type="radio"
              className=""
              name="radioGroup"
              onChange={() => userInputHandler(filter, "No")}
            />
            <span className="v-align-middle"></span>
            <span className="dropdown-text radio-text active v-align-middle">
              {filter.handler_field_present.options[0].values[1]}
            </span>
          </label>
        </FormGroup>
      </div>
      {filter.handler_field_present.value === "Yes" && (
        <div className="form-title">
          {filter.handler_field.title}&nbsp;&nbsp;&nbsp;
          <ButtonToolbar>
            <DropdownButton
              title={filter.value || "choose option"}
              id={filter.title}
              className="combo-size-button"
            >
              {filter.handler_field.options[0].values.map((val) => (
                <MenuItem
                  key={val}
                  onSelect={() => userInputHandler(filter, val)}
                >
                  {val}
                </MenuItem>
              ))}
            </DropdownButton>
          </ButtonToolbar>
        </div>
      )}
      <div>
        {filter.handler_field_present.value === "Yes" &&
          filter.value !== "Any" &&
          filter.comboFilters?.map((comboFilter, cfIndex) => (
            <div
              key={filter.handler_field_present.filter_name + cfIndex}
              className="combo-children"
            >
              <br />
              <ButtonToolbar>
                <div className="form-title">
                  &nbsp;&nbsp;{comboFilter[0].title.slice(0, -1)}
                </div>
                <DropdownButton
                  title={comboFilter[0].value || "choose option"}
                  id={comboFilter[0].title}
                  className="combo-size-button dropdown-width-automobile"
                >
                  {comboFilter[0].options[0].values.length !== 0 ? (
                    comboFilter[0].options[0].values.map((val) => (
                      <MenuItem
                        key={val}
                        onSelect={() =>
                          userInputHandler(
                            filter,
                            val,
                            comboFilter[0].filter_name
                          )
                        }
                      >
                        {val}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data available</MenuItem>
                  )}
                </DropdownButton>
              </ButtonToolbar>
              <br />
              <ButtonToolbar>
                <div className="form-title">
                  &nbsp;&nbsp;{comboFilter[1].title.slice(0, -1)}
                </div>
                <DropdownButton
                  title={comboFilter[1].value || "choose option"}
                  id={comboFilter[1].title}
                  className="combo-size-button dropdown-width-automobile"
                  disabled={comboFilter[0].value.length === 0}
                >
                  {comboFilter[1].options[0].values.length !== 0 ? (
                    comboFilter[1].options[0].values.map((val) => (
                      <MenuItem
                        key={val}
                        onSelect={() =>
                          userInputHandler(
                            filter,
                            val,
                            comboFilter[1].filter_name
                          )
                        }
                      >
                        {val}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data available</MenuItem>
                  )}
                </DropdownButton>
              </ButtonToolbar>
              <br />
              <ButtonToolbar>
                <div className="form-title">
                  &nbsp;&nbsp;{comboFilter[2].title.slice(0, -1)}
                </div>
                <DropdownButton
                  title={comboFilter[2].value || "choose option"}
                  id={comboFilter[2].title}
                  className="combo-size-button dropdown-width-automobile"
                  disabled={comboFilter[1].value.length === 0}
                >
                  {comboFilter[2].options[0].values.length !== 0 ? (
                    comboFilter[2].options[0].values.map((val) => (
                      <MenuItem
                        key={val}
                        onSelect={() =>
                          userInputHandler(
                            filter,
                            val,
                            comboFilter[2].filter_name
                          )
                        }
                      >
                        {val}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data available</MenuItem>
                  )}
                </DropdownButton>
              </ButtonToolbar>
            </div>
          ))}
        {filter.handler_field_present.value === "Yes" &&
          filter.value === "Any" &&
          filter.handler_field_any.map((multiFilter) => (
            <div key={filter.handler_field_any.indexOf(multiFilter)}>
              <ButtonToolbar>
                <div className="form-title">
                  &nbsp;&nbsp;{multiFilter.title}
                </div>
                <DropdownButton
                  title={multiFilter.value || "choose option"}
                  id={multiFilter.title}
                  className="combo-size-button dropdown-width-automobile"
                >
                  {multiFilter.options[0].values.map((val) => (
                    <MenuItem
                      key={val}
                      onSelect={() =>
                        userInputHandler(filter, val, multiFilter.filter_name)
                      }
                    >
                      {val}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </ButtonToolbar>
            </div>
          ))}
      </div>
    </div>
  );

  const getRadioContent = (filter, filterKey) => (
    <div className="col-md-6 mb20 target-segment-fields" key={filterKey}>
      <div className="form-title">
        {filter.title}&nbsp;&nbsp;&nbsp;
        <span
          className="glyphicon glyphicon-remove"
          onClick={() => handleTabChangeFunc(lite, filter)}
        ></span>
      </div>
      <div>
        <FormGroup>
          {filter.options.map((val) => (
            <label
              className="distribute distribute-freq"
              role="button"
              key={val.name}
            >
              <input
                type="radio"
                className=""
                name="radioGroup"
                checked={val.name === filter.value}
                onChange={() => userInputHandler(filter, val.name)}
              />
              <span className="v-align-middle"></span>
              <span className="dropdown-text radio-text active v-align-middle">
                {val.name}
              </span>
            </label>
          ))}
        </FormGroup>
      </div>
    </div>
  );

  const getSliderContent = (filter, filterKey) => {
    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    const log = (value, filter, id) => {
      userInputHandler(filter, [value, id]);
    };
    return (
      <div key={filterKey}>
        <div className="form-title">
          {filter.title}&nbsp;&nbsp;&nbsp;
          <span
            className="glyphicon glyphicon-remove"
            onClick={() => handleTabChangeFunc(lite, filter)}
          ></span>
        </div>
        {filter.optionsArray.map((range) => (
          <div key={filter.optionsArray.indexOf(range)}>
            <Range
              allowCross={false}
              dots
              max={Object.keys(range.tooltip).length - 1}
              step={1}
              defaultValue={[range.value[0], range.value[1]]}
              marks={range.tooltip}
              onAfterChange={(e) => log(e, filter, range.index)}
              tipFormatter={(e) => range.summaryOpt[e]}
            />
            <div className="range-width"></div>
          </div>
        ))}
        <br />
        <a
          href="#"
          className="add-filters"
          onClick={() => userInputHandler(filter, "1")}
        >
          add
        </a>
        &nbsp;&nbsp;&nbsp;
        {filter.optionsArray.length !== 1 && (
          <a
            href="#"
            className="add-filters"
            onClick={() => userInputHandler(filter, "0")}
          >
            remove
          </a>
        )}
        <div className="range-width"></div>
      </div>
    );
  };
  const getSingleSliderContent = (filter, filterKey) => {
    // const createSliderWithTooltip = Slider.createSliderWithTooltip;
    // const SingleSlider = createSliderWithTooltip(Slider);
    if (filter.title === "Shopping Styles") {
      return (
        <div key={filterKey}>
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => handleTabChangeFunc(lite, filter)}
            ></span>
          </div>

          <div className="slider-shopper">
            <Slider
              min={1}
              max={6}
              defaultValue={[
                Object.keys(filter.optionsArray.tooltip).find(
                  (key) => filter.optionsArray.tooltip[key] === filter.value
                ),
              ]}
              marks={filter.optionsArray.tooltip}
              step={null}
              onAfterChange={(e) =>
                userInputHandler(filter, filter.optionsArray.tooltip[e])
              }
              tipFormatter={(e) => filter.options[0].values[e] - 1}
            />
          </div>
          <div className="range-width"></div>
          <br />
        </div>
      );
    } else {
      return (
        <div key={filterKey}>
          <div className="form-title">
            {filter.title}&nbsp;&nbsp;&nbsp;
            <span
              className="glyphicon glyphicon-remove"
              onClick={() => handleTabChangeFunc(lite, filter)}
            ></span>
          </div>

          <div>
            <Slider
              min={1}
              max={99}
              defaultValue={[filter.value]}
              marks={filter.optionsArray.tooltip}
              step={null}
              onAfterChange={(e) => userInputHandler(filter, e)}
              tipFormatter={(e) => filter.options[0].values[e] - 1}
            />
          </div>
          <div className="range-width"></div>
          <br />
        </div>
      );
    }
  };

  const getLIfeStyleTableContent = (lite) => (
    <div key={`${type}-${lite.name}`}>
      <Table className="lifestyle-table">
        <thead>
          <tr>
            {/* <th></th> */}
            {/* <th>Name</th> */}
            {/* <th>Yes</th>
              <th>No</th> */}
          </tr>
        </thead>
        <tbody>
          {lite.template.filters.map((st, k) => (
            <tr key={k}>
              <td>
                <label className="checkbox-container mr10">
                  {st.title}
                  <input
                    type="checkbox"
                    checked={st.isTabSelected}
                    onChange={() => handleTabChangeFunc(lite, st)}
                  />
                  <span className="checkmark"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
  const getTemplateFiltersContent = () => {
    const templateFilterContentComp = [];
    if (
      lite &&
      lite.template.filters &&
      lite.template.filters.length &&
      lite.name === "Lifestyle"
    ) {
      templateFilterContentComp.push(getLIfeStyleTableContent(lite));
    } else if (
      lite &&
      lite.template.filters &&
      lite.template.filters.length &&
      lite.name !== "Lifestyle"
    ) {
      lite.template.filters.forEach((filter) => {
        const filterKey = `${type}-${filter.filter_name}`;
        if (
          filter.field_type === "dropdown" &&
          filter.isTabSelected &&
          (filter.title === "Brand Loyalists" ||
            filter.title === "Whats on Sale Shoppers" ||
            filter.title === "Shopping Styles")
        ) {
          templateFilterContentComp.push(
            getSingleSliderContent(filter, filterKey)
          );
        } else if (
          filter.field_type === "dropdown" &&
          filter.isTabSelected &&
          filter.title !== "Estimated Net worth"
        ) {
          templateFilterContentComp.push(getDropdownContent(filter, filterKey));
        } else if (
          filter.field_type === "checkbox" &&
          filter.isTabSelected &&
          filter.title !== "Annual Income"
        ) {
          templateFilterContentComp.push(getCheckboxContent(filter, filterKey));
        } else if (
          filter.field_type === "checkbox" &&
          filter.isTabSelected &&
          filter.title === "Annual Income"
        ) {
          templateFilterContentComp.push(getSliderContent(filter, filterKey));
        } else if (
          filter.field_type === "dropdown" &&
          filter.isTabSelected &&
          filter.title === "Estimated Net worth"
        ) {
          templateFilterContentComp.push(getSliderContent(filter, filterKey));
        } else if (
          filter.field_type === "combo" &&
          filter.filter_name !== "Children Age" &&
          filter.isTabSelected
        ) {
          templateFilterContentComp.push(getComboContent(filter, filterKey));
        } else if (
          filter.field_type === "combo" &&
          filter.filter_name === "Children Age" &&
          filter.isTabSelected
        ) {
          templateFilterContentComp.push(
            getComboContentForChildren(filter, filterKey)
          );
        } else if (filter.field_type === "radio" && filter.isTabSelected) {
          templateFilterContentComp.push(getRadioContent(filter, filterKey));
        }
      });
    }
    return templateFilterContentComp;
  };

  const getNonCreditCardContent = () => {
    const nonCreditCardContent = [];
    nonCreditCardContent.push(
      <div
        key={`${type}non_credit_content`}
        className="segment-filter-container-height"
      >
        <form>
          <div className="form-container">
            <div className="input-dir-wrapper form-row">
              {getTemplateFiltersContent()}
            </div>
            <div style={{ maxWidth: 250 }}>
              <div className="add-category-tab">
                {isAllCategoryNone() ? (
                  !["Personas", "Lifestyle"].includes(lite.name) && (
                    <a
                      href=""
                      className="add-filters segement-add-remove-button"
                      onClick={toggleAvailableFiltersModal}
                    >
                      Add/Remove Filters
                    </a>
                  )
                ) : (
                  <p>*select atleast one category</p>
                )}
              </div>
            </div>
          </div>
        </form>
        <AvailableFiltersModal
          showModal={availableFiltersModal}
          toggleModal={toggleAvailableFiltersModal}
          handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
          handleTabChangeFunc={handleTabChangeFunc}
          filterData={lite}
          type="non_credit"
        />
      </div>
    );
    return nonCreditCardContent;
  };

  return (
    <>
      {lite.name === "Credit" ? (
        <CreditCard
          credit={lite}
          handleAddRemoveFunc={handleAddRemoveFunc}
          handleTitleTabChangeForCredit={handleTitleTabChangeForCredit}
          handleTabChangeFunc={handleTabChangeFunc}
          handleUserInputFunc={handleUserInputFunc}
          handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
          handleSelectAllForCategories={handleSelectAllForCategories}
        />
      ) : (
        getNonCreditCardContent()
      )}
    </>
  );
};

FilterContainer.propTypes = {
  allFilters: PropTypes.array,
  lite: PropTypes.object,
  handleTabChangeFunc: PropTypes.func,
  handleUserInputFunc: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
  handleAddRemoveFunc: PropTypes.func,
  handleTitleTabChangeForCredit: PropTypes.func,
  handleSelectAllForCategories: PropTypes.func,
  type: PropTypes.string,
};

export default FilterContainer;
