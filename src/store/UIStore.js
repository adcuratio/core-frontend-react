import { action, computed, observable, makeObservable } from 'mobx';

class UIStore {

  isLoading = false;
  loaderText = 'Waiting for server...';
  showPageLoader = null;
  setLoader = null;

  constructor(
    rootStore,
    isLoading,
    loaderText,
    showPageLoader,
    setLoader
  ) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isLoading: observable,
      loaderText: observable,
      showPageLoader: computed,
      setLoader: action,
    });
  }

  isLoading = false;
  loaderText = 'Waiting for server...';

  get showPageLoader() {
    return this.isLoading;
  }

  setLoader(input) {
    this.isLoading = input;
    if (!input) this.loaderText = 'Waiting for server...'; // Set default loaderText for other pages
  }
}

export default UIStore;
