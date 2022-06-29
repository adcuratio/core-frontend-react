import { action, computed, observable, makeObservable } from "mobx";

class UIStore {
  isLoading = false;
  loaderText = "Waiting for server...";

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      isLoading: observable,
      loaderText: observable,
      showPageLoader: computed,
      setLoader: action,
    });
  }

  get showPageLoader() {
    return this.isLoading;
  }

  setLoader(input) {
    this.isLoading = input;
    if (!input) this.loaderText = "Waiting for server..."; // Set default loaderText for other pages
  }
}

export default UIStore;
