import React from "react";
import { inject, observer } from "mobx-react";

import { PageTitle } from "../../components/Typography";
import { MainContent, PageHeader } from "../../components/PageLayout";
import { MainWrapper } from "../../components/ops-user-flow/UserFlowLayout";
import ReactLoader from "../../components/ReactLoader";

//import withStore from '../../hocs/WithStore';

const PingReports = inject("uiStore")(
  observer((props) => {
    const { uiStore } = props;

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Ping Reports</PageTitle>
        </PageHeader>
        <MainWrapper className="row">
          <iframe
            style={{ width: "100%" }}
            id="kibanaPingViz"
            height="100%"
            src="https://kibana.adcuratio.net/univision"
          ></iframe>
        </MainWrapper>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default PingReports;
