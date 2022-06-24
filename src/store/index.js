import UIStore from "./UIStore";
import CompanyStore from "./CompanyStore";
//import SegmentStore from "./SegmentStore";
import CampaignStore from "./CampaignStore";
import NetworkStore from "./NetworkStore";
import SuperAdminStore from "./SuperAdminStore";
import AdvSchStore from "./AdvSchStore";
import CreativesStore from "./CreativesStore";
import VizioStore from "./VizioStore";
import UserStore from "./UserStore";
import AccountManagementStore from "./AccountManagementStore";
import PostLogsStore from "./PostLogsStore";
import ManageCampaignStore from "./ManageCampaignStore";
import MessagingGroupStore from "./MessagingGroupStore";
import XandrStore from "./XandrStore";
import TradeStore from "./TradeStore";
import OperatorStore from "./OperatorStore";
import FoxVizioStore from "./FoxVizioStore";
import CreativesVideoStore from "./CreativesVideoStore";
import UnivisionStore from "./UnivisionStore";
import AuthStore from "./AuthStore";
import AggCampaignStore from "./AggCampaignStore";

class RootStore {
  constructor() {
    this.uiStore = new UIStore(this);
    this.companyStore = new CompanyStore(this);
    //this.segmentStore = new SegmentStore(this);
    this.campaignStore = new CampaignStore(this);
    this.networkStore = new NetworkStore(this);
    this.superAdminStore = new SuperAdminStore(this);
    this.advSchStore = new AdvSchStore(this);
    this.creativesStore = new CreativesStore(this);
    this.vizioStore = new VizioStore(this);
    this.userStore = new UserStore(this);
    this.accountManagementStore = new AccountManagementStore(this);
    this.postLogsStore = new PostLogsStore(this);
    this.messagingGroupStore = new MessagingGroupStore(this);
    this.xandrStore = new XandrStore(this);
    this.tradeStore = new TradeStore(this);
    this.operatorStore = new OperatorStore(this);
    this.foxVizioStore = new FoxVizioStore(this);
    this.creativesVideoStore = new CreativesVideoStore(this);
    this.manageCampaignStore = new ManageCampaignStore(this);
    this.univisionStore = new UnivisionStore(this);
    this.authStore = new AuthStore(this);
    this.aggCampaignStore = new AggCampaignStore(this);
  }
}

export default new RootStore();
