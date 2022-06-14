import React from 'react';
import { Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import CustomButton from '../../../../components/CustomButton';
import withStore from '../../../../hocs/WithStore';

import CreativesSelection from './CreativesSelection';
import { showAckErrorMessage } from '../../../../common/utils';

const CampaignDetails = inject('aggCampaignStore')(
  observer((props) => {
    const { afterValidation, selectedCompanyData, levelData, setLevelData } = props;

    const completeStep = (event) => {
      const obj = { ...levelData };

      // Level 1 checks (campaign details):
      if (!levelData?.campaign_name) {
        showAckErrorMessage({ message: 'Enter Campaign Name.' });
        return;
      }
      if (!(levelData?.start_date && levelData?.end_date)) {
        showAckErrorMessage({ message: 'Enter Flight Details.' });
        return;
      }
      if (!(levelData?.number_of_targeting && levelData?.number_of_targeting >= 1)) {
        showAckErrorMessage({ message: 'Add atleast one orderline to continue.' });
        return;
      }

      // Level 2 checks (Orderline details):
      let errorFlag = 0;
      let orderlineNum = 0;
      let errorFieldName = 'all the non optional fields';

      for (let i = 0; i < obj?.targeting_data?.length; i++) {
        if (!obj?.targeting_data?.[i]?.creative_selection_type) {
          errorFieldName = 'appropriate order type';
          orderlineNum = i + 1;
          errorFlag = 1;
          break;
        }
        if (obj?.targeting_data?.[i]?.creative_selection_type === 'adid' && !obj?.targeting_data?.[i]?.adid) {
          errorFieldName = 'appropriate creative name/identifier';
          orderlineNum = i + 1;
          errorFlag = 2;
          break;
        }
        if (obj?.targeting_data?.[i]?.creative_selection_type === 'ad_copy_rotation') {
          if (
            !(
              obj?.targeting_data?.[i]?.ad_copy_rotation?.type &&
              ['Weighted', 'WeightedPercentage', 'Sequenced', 'Storyboard'].includes(
                obj?.targeting_data?.[i]?.ad_copy_rotation?.type
              )
            )
          ) {
            errorFieldName = 'rotation type';
            orderlineNum = i + 1;
            errorFlag = 31;
            break;
          }
          if (!obj?.targeting_data?.[i]?.ad_copy_rotation?.duration) {
            errorFieldName = 'rotation ad length';
            orderlineNum = i + 1;
            errorFlag = 32;
            break;
          }
          if (!(obj?.targeting_data?.[i]?.number_of_creatives && obj?.targeting_data?.[i]?.number_of_creatives > 0)) {
            errorFieldName = 'number of creatives';
            orderlineNum = i + 1;
            errorFlag = 33;
            break;
          }
          let internalflag = false;
          for (let j = 0; j < obj?.targeting_data?.[i]?.ad_copy_rotation?.assets?.length; j++) {
            if (!obj?.targeting_data?.[i]?.ad_copy_rotation?.assets?.[j]?.adid) {
              internalflag = true;
              break;
            }
          }
          if (internalflag) {
            errorFieldName = 'all the creatives';
            orderlineNum = i + 1;
            errorFlag = 34;
            break;
          }
        }

        if (!obj?.targeting_data?.[i]?.segment?.data_provider) {
          errorFieldName = 'appropriate data provider';
          orderlineNum = i + 1;
          errorFlag = 4;
          break;
        }
        if (!obj?.targeting_data?.[i]?.segment?.segment_id) {
          errorFieldName = 'appropriate segment';
          orderlineNum = i + 1;
          errorFlag = 5;
          break;
        }
        if (!obj?.targeting_data?.[i]?.desired_impression) {
          errorFieldName = 'desired impressions';
          orderlineNum = i + 1;
          errorFlag = 6;
          break;
        }
        if (!obj?.targeting_data?.[i]?.cpm) {
          errorFieldName = 'CPM';
          orderlineNum = i + 1;
          errorFlag = 7;
          break;
        }
      }

      if (errorFlag > 0) {
        showAckErrorMessage({ message: `Please select ${errorFieldName} in Audience Target ${orderlineNum}` });
        return;
      }

      let index_flag = 0;
      let num_creatives = 0;
      let audienceId = 0;

      obj?.targeting_data?.forEach((target, ind) => {
        if (target?.creative_selection_type === 'ad_copy_rotation') {
          if (target?.ad_copy_rotation?.type === 'Sequenced' || target?.ad_copy_rotation?.type === 'Storyboard') {
            // Selected indexes should be distinct and in range (1 to number of creatives)
            const idx_dup_chk = Object.create(null);
            target?.ad_copy_rotation?.assets?.forEach((asset) => {
              if (Object.prototype.hasOwnProperty.call(asset, 'index')) {
                if (asset?.index in idx_dup_chk) {
                  index_flag = 1;
                  audienceId = ind + 1;
                  num_creatives = target?.number_of_creatives;
                }
                idx_dup_chk[asset?.index] = true;
                if (asset?.index < 1 || asset?.index > target?.number_of_creatives) {
                  index_flag = 1;
                  audienceId = ind + 1;
                  num_creatives = target?.number_of_creatives;
                }
              } else {
                index_flag = 1;
                audienceId = ind + 1;
                num_creatives = target?.number_of_creatives;
              }
            });
          } else if (target?.ad_copy_rotation?.type === 'WeightedPercentage') {
            // Sum of selected percentage values should be equal to 100
            let percentageSum = 0;
            target?.ad_copy_rotation?.assets?.forEach((asset) => {
              if (Object.prototype.hasOwnProperty.call(asset, 'weighted_percentage')) {
                percentageSum += asset?.weighted_percentage;
              } else {
                index_flag = 2;
                audienceId = ind + 1;
              }
            });
            if (percentageSum !== 100) {
              index_flag = 2;
              audienceId = ind + 1;
            }
          } else if (target?.ad_copy_rotation?.type === 'Weighted') {
            // Selected weight should not be equal to 0.
            target?.ad_copy_rotation?.assets?.forEach((asset) => {
              if (Object.prototype.hasOwnProperty.call(asset, 'weight')) {
                if (!asset?.weight) {
                  index_flag = 3;
                  audienceId = ind + 1;
                }
              } else {
                index_flag = 3;
                audienceId = ind + 1;
              }
            });
          }
        }
      });
      if (index_flag === 1) {
        showAckErrorMessage({
          message: `Sequence/Storyboard indexes should be distinct and in range (1 to ${num_creatives}) for Audience Target ${audienceId}`,
        });
        return;
      } else if (index_flag === 2) {
        showAckErrorMessage({
          message: `Sum of selected percentage values should be equal to 100 for Audience Target ${audienceId}`,
        });
        return;
      } else if (index_flag === 3) {
        showAckErrorMessage({
          message: `Selected weight for a creative should be greater than 0 for Audience Target ${audienceId}`,
        });
        return;
      }

      afterValidation();
      event?.preventDefault();
    };

    return (
      <div>
        <Row>
          <CreativesSelection
            selectedCompanyData={selectedCompanyData}
            levelData={levelData}
            setLevelData={setLevelData}
          />
        </Row>
        <div style={{ marginTop: '15px', float: 'right' }}>
          <CustomButton
            type="primary"
            buttonText="Next"
            handleButtonClick={(event) => completeStep(event)}
            buttonClassName="custom-btn-style"
          />
        </div>
      </div>
    );
  })
);

CampaignDetails.propTypes = {
  afterValidation: PropTypes.func,
  selectedCompanyData: PropTypes.object,
  levelData: PropTypes.object,
  setLevelData: PropTypes.func,
};

export default withStore(CampaignDetails);
