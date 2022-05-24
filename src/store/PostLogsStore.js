import { observable, action, makeObservable } from 'mobx';
import API from '../api';

class PostLogsStore {

  postLogsData = null;
  postLogsViewData = null;

  constructor(
    postLogsData,
    postLogsViewData
  ) {
    makeObservable(this, {
      postLogsData: observable,
      postLogsViewData: observable,
      getPostLogs: action,
      getPostLogFileDetail: action,
    })
  }

  

  getPostLogs() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/network/post_log/');
      if (res.status === 200) {
        this.postLogsData = res.data.results;
      }
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getPostLogFileDetail(id) {
    try {
      const res = await API.get(`/network/get_postlog_file_detail/?postlog_file_id=${id}`);
      if (res.status === 200) {
        this.postLogsViewData = res.data?.post_log_file_track;
      }
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default PostLogsStore;
