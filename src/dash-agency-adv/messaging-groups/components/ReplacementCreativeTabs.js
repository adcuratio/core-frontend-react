import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RepCreativeTabsCard = styled.div`
  .rep-creative-card {
    width: 196px;
    height: 78px;
    font-size: 11px;
    font-weight: bold;
    color: #26282a;
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    padding: 10px 8px;
    background-color: #faf2e6;
    border: 1px solid #e7e9ea;
    text-align: center;
  }
  .rep-creative-card-active {
    background: #faf2e6;
    border: 1px solid #eea32c;
  }
  .disabled-buttons {
    opacity: 0.8;
    background-color: #f5f5f5;
  }
`;

const ReplacementCreativeTabs = (props) => {
  const { repCreativeTabData, activeTabData, onChangeTabData } = props;

  const getReplacementCreativeTabs = () => {
    if (repCreativeTabData?.length) {
      const repCreativeTabComp = [];
      repCreativeTabData?.forEach((data) => {
        repCreativeTabComp?.push(
          <RepCreativeTabsCard key={data.id} onClick={(e) => onChangeTabData(data, e)}>
            <div
              className={
                activeTabData.id === data.id
                  ? 'rep-creative-card rep-creative-card-active'
                  : 'rep-creative-card disabled-buttons'
              }
            >
              {data.name}
            </div>
          </RepCreativeTabsCard>
        );
      });
      return repCreativeTabComp;
    }
    return null;
  };

  return <div className="flex">{getReplacementCreativeTabs()}</div>;
};

ReplacementCreativeTabs.propTypes = {
  repCreativeTabData: PropTypes.array,
  activeTabData: PropTypes.object,
  onChangeTabData: PropTypes.func,
};

ReplacementCreativeTabs.defaultProps = {
  repCreativeTabData: [],
  activeTabData: {},
  onChangeTabData: () => {},
};

export default ReplacementCreativeTabs;
