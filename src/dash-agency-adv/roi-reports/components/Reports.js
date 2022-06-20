import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { observer, useLocalStore } from 'mobx-react';

import ReactLoader from '../../../components/ReactLoader';

import { hasProperty, showAckErrorMessage } from '../../../common/utils';
import API from '../../../api';

const { tableau } = window;
const url = `https://10az.online.tableau.com/t/advertisertest/views/\
Book1_16103683329270/Dashboard1?:iid=4:embed=y&:customViews=no\
&:toolbar=top&:subscriptions=no&:showShareOptions=true&:alerts=no\
&:linktarget=_blank&:showAppBanner=false&:showAskData=false`;

const options = {
  width: '100%',
  height: '850px',
  device: 'desktop',
};

const SegmentReports = observer((props) => {
  const { filterJson } = props;
  const ref = useRef(null);
  let viz = null;

  // Create a tableau container
  const init = ({ ref, url, options }) => {
    if (ref && ref.current) {
      viz = new tableau.Viz(ref.current, url, options);
      return viz;
    }
  };

  useEffect(() => {
    init({ url, options, ref });

    return () => {
      viz ? viz.dispose() : null; // cleanup vizualization
    };
  }, []);

  // Update reports
  useEffect(() => {
    if (Object.keys(filterJson).length > 0) {
      store.updateReports(filterJson);
    }
  }, [filterJson]);

  // UpdateReports calls the api
  // That updates reports using tableau methods
  const store = useLocalStore(
    () => ({
      isLoading: false,
      updateReports: async (filterJson) => {
        try {
          store.isLoading = true;

          const formData = new FormData();
          formData.append('filter', JSON.stringify(filterJson));
          const response = await API.post(`roi_reports/`, formData);
          if (response?.data && hasProperty(response.data, 'Success')) {
            setTimeout(() => {
              viz ? viz.refreshDataAsync() : null;
              store.isLoading = false;
            }, 2000);
          } else {
            store.isLoading = false;
            showAckErrorMessage({ message: response?.data?.Error || null });
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            showAckErrorMessage({ message: error.response.data?.detail });
          } else {
            showAckErrorMessage();
          }
          store.isLoading = false;
        }
      },
    }),
    props
  );

  return (
    <>
      <div className="col-md-12" ref={ref}></div>
      <ReactLoader isLoading={store.isLoading} />
    </>
  );
});

SegmentReports.propTypes = {
  filterJson: PropTypes.object,
};

SegmentReports.defaultProps = {
  filterJson: {},
};

export default SegmentReports;
