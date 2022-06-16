import React from 'react';
import { Tooltip } from 'react-bootstrap';

export const orderIntakeTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <div>
        <span className="f12">AD/ID : </span>
        <span className="f12">Add creative as per the creative identifier id.</span>
      </div>
      <div className="mt20">
        <span className="f12">AD Copy Rotation : </span>
        <span style={{ textAlign: 'left' }} className="f12">
          AdCopy rotation is a promotional campaign that consists of two or more separate advertisements that play in an
          agreed-upon transmission sequence.
        </span>
      </div>
    </div>
  </Tooltip>
);

export const priorityTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">
        Higher priority values are interpreted as being more important than lower priority values.If this value is not
        specified the default priority will be used.
      </span>
    </div>
  </Tooltip>
);

export const desiredImpressionTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">
        The number of impressions that the order should achieve during the period between the start and end date.
      </span>
    </div>
  </Tooltip>
);

export const targetAudienceTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">Specify the count of targeted audience that is required in order.</span>
    </div>
  </Tooltip>
);

export const skipWeekTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">
        Defines the period calculated from the beginning of a broadcast week when creative is not playable.
      </span>
    </div>
  </Tooltip>
);

export const showExclusionTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">You can select maximum of five shows to exclude.</span>
    </div>
  </Tooltip>
);

export const creativePreviewTooltip = (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">Click to preview creative.</span>
    </div>
  </Tooltip>
);

const rotationTooltipText = {
  Weighted:
    'The sum of the weights of all creative in the ad copy rotation group must not exceed 10. A weight of "2" creative will be shown twice as many times as an asset with a weight of 1.',
  WeightedPercentage: 'Add percentage to every creative.  Sum of every creative weight should equal 100.',
  Sequenced:
    'Assets will play out in the order specified in AdCopyRotation/AssetSequence, with any asset being valid starting point in the sequence. Missing assets may be skipped.',
  Storyboard: 'It is a strict version of sequenced. Assets must not be skipped',
};

export const getRotationTooltip = (type) => (
  <Tooltip id="standard-campaign-tooltip">
    <div>
      <span className="f12">
        {rotationTooltipText?.[type] ? rotationTooltipText?.[type] : 'No data for this rotation type.'}
      </span>
    </div>
  </Tooltip>
);
