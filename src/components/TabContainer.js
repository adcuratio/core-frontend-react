import React from "react";
import PropTypes from "prop-types";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TabContainer = (props) => {
  const { tabList, activeTab, onTabChange, showIcon, showCount } = props;

  return (
    <ul className="nav nav-tabs" role="tablist">
      {tabList.map((tab) => (
        <li
          key={tab.id}
          role="presentation"
          className={
            activeTab?.id === tab.id
              ? "active cursor-pointer"
              : "cursor-pointer"
          }
        >
          <a
            aria-controls={tab.id}
            role="tab"
            data-toggle="tab"
            className={activeTab?.id !== tab.id ? "non-active-tab" : ""}
            onClick={() => onTabChange(tab)}
            style={{ padding: "7px" }}
          >
            {tab.name}
            {showIcon ? (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="advInvTooltip1">{tab.tooltipContent}</Tooltip>
                }
              >
                {
                  <i
                    className="glyphicon glyphicon-info-sign ml5"
                    aria-hidden="true"
                  />
                }
              </OverlayTrigger>
            ) : null}
            {showCount ? <span className="ml5">({tab.count || 0})</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
};

TabContainer.propTypes = {
  tabList: PropTypes.array,
  onTabChange: PropTypes.func,
  activeTab: PropTypes.object,
  showIcon: PropTypes.bool,
  showCount: PropTypes.bool,
};

export default TabContainer;
