import React from "react";
import PropTypes from "prop-types";

const CustomLegend = (props) => {
  const { legendData, legendDataColors } = props;

  const getLegendsDisplay = () => {
    if (legendData && legendData.length) {
      const legendComp = [];
      legendData.forEach((data, dataIndex) => {
        legendComp.push(
          <div key={`${data.name}`} className="custom-legend-item">
            <div
              className="custom-legend-round"
              style={{ backgroundColor: legendDataColors[dataIndex] }}
            ></div>
            <p className="custom-legend-text">{data.name}</p>
          </div>
        );
      });
      return legendComp;
    }
    return null;
  };
  return <div className="custom-legend-wrapper">{getLegendsDisplay()}</div>;
};

CustomLegend.propTypes = {
  legendData: PropTypes.array,
  legendDataColors: PropTypes.array,
};

CustomLegend.defaultProps = {
  legendData: [],
  legendDataColors: [],
};

export default CustomLegend;
