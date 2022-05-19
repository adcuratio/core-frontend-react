import { action, computed, observable } from 'mobx';

class UIStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable isLoading = false;
  @observable loaderText = 'Waiting for server...';

  @computed get showPageLoader() {
    return this.isLoading;
  }

  @action setLoader(input) {
    this.isLoading = input;
    if (!input) this.loaderText = 'Waiting for server...'; // Set default loaderText for other pages
  }
}

export default UIStore;
