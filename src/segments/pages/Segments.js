import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Row, Col, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
import withStore from '../../hocs/WithStore';

import { getEntityType } from '../../common/utils';
import { PageTitle, PaneTitle } from '../../components/Typography';
import { MainContent, PageHeader, PageContent } from '../../components/PageLayout';
import CustomButton from '../../components/CustomButton';

import Tree from '../../components/TreeCompany';
import Loader from '../../components/ReactLoader';

import ArchivedSegmentsModal from '../containers/ArchivedSegmentsModal';
import SegmentInfoCard from '../components/SegmentInfoCard';
import { getFilterJSONText } from '../components/FilterJSONText';

import '../Segments.css';
import '../../../styles/unwantedGroup.css';

const StyledFileExplorer = styled.div`
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
`;

const TreeWrapper = styled.div`
  width: 100%;
`;

const RightCol = styled(Col)`
  border-left: 1px solid grey;
`;

const NoDataFoundWrapper = styled.p`
  margin-top: 100px;
  text-align: center;
`;

@inject('companyStore')
@inject('segmentStore')
@inject('uiStore')
@inject('authStore')
@observer
class Segments extends React.Component {
  constructor(props) {
    super(props);
    const userAgency = props.authStore.isAgencyAdminUser();
    this.state = {
      segments: [], //selected company's all segment
      selectedCompany: {}, //selected company from the tree
      userAgency,
      selectedCompanyName: '', //selected company name
      selectedNodeData: {}, //selected company's brand subrand or advertiser's data
      showCreateSegment: false, //to go to create new segment page
      showArchivedSegmentsModal: false, //archived modal
      isPageLoading: true,
    };
  }

  componentDidMount() {
    this.onInit();
  }

  onInit = () => {
    this.props.companyStore.getAllCompanies().then(() => {
      let selectedNodeData = {};
      if (this.props.$state.params?.selectedNodeData !== null) {
        selectedNodeData = this.props.$state.params?.selectedNodeData;
      } else {
        selectedNodeData = this.props.companyStore?.companies[0]?.company;
      }
      if (selectedNodeData) {
        this.setState({
          ...this.state,
          selectedCompany: this.props.$state.params?.selectedCompany || this.props.companyStore.companies[0],
          selectedCompanyName: this.props.$state.params?.selectedCompanyName || selectedNodeData.name,
          selectedNodeData,
        });
        this.getAllSegmentsApi(selectedNodeData);
      } else {
        this.props.util.showAckErrorMessage({ message: 'No Data Found.' });
        this.setState({ ...this.state, isPageLoading: false });
      }
    });
  };

  onSelect = (selectedNodeData) => {
    // on selecting node data from tree
    this.setState({
      selectedNodeData,
      isPageLoading: true,
    });
    this.getAllSegmentsApi(selectedNodeData);
  };

  onSelectCompany = (selectedCompany) => {
    const selectedNodeData = selectedCompany.company;
    this.setState({
      selectedCompany,
      selectedCompanyName: selectedNodeData.name,
      selectedNodeData,
      isPageLoading: true,
    });
    this.getAllSegmentsApi(selectedNodeData);
  };

  onCreateSegment = () => {
    if (Object.keys(this.state.selectedNodeData).length === 0) {
      this.props.util.showAckErrorMessage({ message: 'Unable to Create Segment!' });
      return;
    }
    this.props.navigationService.goToCreateNewSegments(
      this.state.selectedCompany?.company?.id,
      this.state.selectedNodeData,
      getEntityType(this.state.selectedNodeData),
      this.state.selectedCompany,
      this.state.selectedCompanyName
    );
  };

  toggleArchivedSegmentsModal = () => {
    const _newStatus = !this.state.showArchivedSegmentsModal;
    if (_newStatus)
      this.props.segmentStore
        .getAllArchivedSegments(getEntityType(this.state.selectedNodeData), this.state.selectedNodeData.id)
        .then(() => this.setState({ showArchivedSegmentsModal: _newStatus }));
    else this.setState({ showArchivedSegmentsModal: _newStatus });
  };

  goToSegmentsAndReset = () => {
    // used to reset while triggering cancel button of create new segment
    const { selectedNodeData } = this.state;
    this.setState({
      ...this.state,
      isPageLoading: true,
    });
    this.getAllSegmentsApi(selectedNodeData);
  };

  getAllSegmentsApi = (selectedNodeData) => {
    // to get all the segments associated with selected tree node
    this.props.segmentStore.getAllSegments('wanted', selectedNodeData, getEntityType(selectedNodeData)).then(() => {
      this.setState({
        ...this.state,
        isPageLoading: false,
      });
    });
  };

  handleArchiveButton = (seg) => {
    this.props.segmentStore.archiveSegments(seg).then((res) => {
      if (res.status) this.props.util.showAckMessage({ message: 'Segment successfully archived.' });
      else this.props.util.showAckErrorMessage({ message: res.message || '' });
    });
  };

  getNoDataFoundData = () => {
    const { isPageLoading } = this.state;
    if (!isPageLoading) {
      return <NoDataFoundWrapper>No data found</NoDataFoundWrapper>;
    }
    return <></>;
  };

  onRefresh = () => {
    const { selectedNodeData } = this.state;
    this.getAllSegmentsApi(selectedNodeData);
  };

  renderSegmentsListingComp = () => {
    const { userAgency, selectedCompanyName, selectedCompany, selectedNodeData, isPageLoading } = this.state;
    const { segments } = this.props.segmentStore;
    const { companies } = this.props.companyStore;
    const { util, uiStore } = this.props;

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle>Segments</PageTitle>
            <div className="flex-container2">
              {userAgency && (
                <ButtonToolbar className="segments-dropdown-btn">
                  <DropdownButton className="dropdownSeg mr10" title={selectedCompanyName || 'All'} id="company_name">
                    {companies?.map((company) => (
                      <MenuItem key={company.company.id} onSelect={() => this.onSelectCompany(company)}>
                        {company.company.name}
                      </MenuItem>
                    ))}
                  </DropdownButton>
                </ButtonToolbar>
              )}
              <CustomButton
                type="primary"
                buttonText="Create New Segment"
                buttonClassName="mr10"
                handleButtonClick={this.onCreateSegment}
                isDisabled={this.props.authStore.userObj?.read_only}
              />
              <CustomButton
                type="primary"
                buttonText="View Archived Segments"
                buttonClassName="mr10"
                handleButtonClick={this.toggleArchivedSegmentsModal}
              />
              <CustomButton type="primary" buttonText="Refresh" buttonClassName="" handleButtonClick={this.onRefresh} />
            </div>
          </div>
        </PageHeader>
        <PageContent>
          <Row>
            <Col md={4} className="segment-scrollbar">
              <PaneTitle>Select Company/Brand/Sub-Brand</PaneTitle>
              <StyledFileExplorer>
                {Object.keys(selectedCompany).length ? (
                  <TreeWrapper>
                    <Tree
                      onSelect={this.onSelect}
                      treeData={selectedCompany}
                      preSelectedNode={selectedNodeData ?? null}
                    />
                  </TreeWrapper>
                ) : (
                  ''
                )}
              </StyledFileExplorer>
            </Col>
            <RightCol md={8} className="segment-scrollbar">
              {segments?.length ? (
                <div className="card-wrapper group-wrapper-table">
                  {segments.map((segment) => (
                    <SegmentInfoCard
                      key={segment.id}
                      segmentData={segment}
                      type="archive"
                      handleButtonFunc={this.handleArchiveButton}
                      filterJSONText={getFilterJSONText(
                        segment?.filter_title ? segment.filter_title : segment?.filter_json
                      )}
                      isReadonly={this.props.authStore.userObj?.read_only}
                    />
                  ))}
                </div>
              ) : (
                this.getNoDataFoundData()
              )}
            </RightCol>
          </Row>
          <ArchivedSegmentsModal
            showModal={this.state.showArchivedSegmentsModal}
            toggleModal={this.toggleArchivedSegmentsModal}
            getSegmentFilterJson={getFilterJSONText}
            nodeData={this.state.selectedNodeData}
            showAckErrorMessage={util.showAckErrorMessage}
            showAckMessage={util.showAckMessage}
            isLoading={this.props.uiStore.isLoading}
            getArchivedSegments={this.onRefresh}
          />
        </PageContent>

        <Loader isLoading={isPageLoading || uiStore.isLoading} />
      </MainContent>
    );
  };

  render() {
    return <>{this.renderSegmentsListingComp()}</>;
  }
}

Segments.propTypes = {
  audienceGroupsService: PropTypes.object,
  companyService: PropTypes.object,
  companyStore: PropTypes.object,
  segmentStore: PropTypes.object,
  util: PropTypes.object,
  authStore: PropTypes.object,
  uiStore: PropTypes.object,
  placementforTooltip: PropTypes.any,
  $state: PropTypes.object,
  navigationService: PropTypes.object,
};

export default withStore(Segments);
