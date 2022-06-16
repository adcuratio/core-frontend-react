import API from "../api";
import { action, makeObservable } from "mobx";

class AuthStore {
  constructor() {
    this.userObj = null;
    this.defaultOptions = {
      baseURL: `${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKEND_PORT}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    };
    makeObservable(this, {
      authenticate: action,
      forgotPassword: action,
      authenticateWithToken: action,
      resetPassword: action,
      getUser: action,
      _generateUserObj: action,
      validateResetToken: action,
      resetClientPassword: action,
    });
  }

  async authenticate(username, password) {
    // login call to server.
    //this.rootStore.uiStore.isLoading = true;
    const authUrl = "login/";
    
    try {
      const res = await API.post(authUrl, {
        username,
        password,
      }).then((response) => {
        if (response && response.data) {
          this.userObj = this._generateUserObj(response.data, username);

          window.sessionStorage.userObj = JSON.stringify(this.userObj);
          window.sessionStorage.oktaSession = false;
          localStorage.setItem("token", this.userObj.sessionToken);
          localStorage.setItem("userObj", JSON.stringify(this.userObj));
          return this.userObj;
        } else {
          throw "Something went wrong with your login, please try again.";
        }
      });
      return res;
    } catch (err) {
      if (err?.response?.status === 400) {
        throw "Incorrect login, please try again.";
      } else {
        throw "Something went wrong with your login, please try again.";
      }
    } finally {
      //this.rootStore.uiStore.isLoading = false;
    }
  }

  async forgotPassword(email) {
    const forgotUrl = "forgot_password/";
    try {
      const res = await API.post(forgotUrl, {
        email,
      }).then((response) => {
        if (response && response.data.success) {
          this.deleteSession();
          Promise.resolve();
        } else {
          throw response.data.message;
        }
      });
      return res;
    } catch (err) {
      if (err?.status === 400) {
        throw "Please try again.";
      } else {
        throw typeof err === "string"
          ? err
          : "Something went wrong, please try again.";
      }
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async authenticateWithToken(email, token) {
    const resetUrl = "reset_auth/";
    try {
      const res = await API.post(resetUrl, {
        email,
        token,
      }).then((response) => {
        if (response && response.data.token) {
          this.userObj = this._generateUserObj(response.data, email);

          // persist in session storage so this is available for page refreshes.
          window.sessionStorage.userObj = JSON.stringify(this.userObj);
          localStorage.setItem("token", this.userObj.sessionToken);
          localStorage.setItem("userObj", JSON.stringify(this.userObj));
          // Email and Username are kept same right now...Everything needs to be
          // migrated to email later in implementation

          return this.userObj;
        } else {
          throw "Something went wrong, please try again.";
        }
      });
      return res;
    } catch (err) {
      if (err?.status === 400) {
        throw "Please try again.";
      } else {
        throw "Something went wrong, please try again.";
      }
    }
  }

  async resetPassword(password) {
    const resetUrl = "reset_password/";
    try {
      const res = API.post(resetUrl, {
        password,
      }).then((response) => {
        if (response && response.data.success) {
          return this.userObj;
        } else {
          throw "Something went wrong, please try again.";
        }
      });
      return res;
    } catch (err) {
      if (err?.status === 400) {
        throw "Please try again.";
      } else {
        throw "Something went wrong, please try again.";
      }
    }
  }

  /**
   * Get authenticated user object
   * @return {Object} Authenticated user object.
   */
  getUser() {
    // first check if user object present in memory.
    if (this.userObj instanceof Object) {
      return this.userObj;
    }

    // next see if we can get it from session storage.
    if (window.sessionStorage.userObj) {
      this.userObj = JSON.parse(window.sessionStorage.userObj);
    } else if (localStorage.getItem("userObj")) {
      this.userObj = JSON.parse(localStorage.getItem("userObj"));
    }

    return this.userObj;
  }

  /**
   * Checks whether current session has authenticated user
   *
   * @return {boolean} Whether user is authenticated.
   */
  isAuthenticated() {
    return !!this.getUser();
  }

  _generateUserObj(data, userName) {
    return {
      sessionToken: data.token,
      userRole: data.role,
      userName,
      read_only: data.read_only,
      company_id: data.company_id,
      userFirstName: data.first_name,
      userLastName: data.last_name,

      // For Advertiser User & Advertiser Admin
      adv_sub_brand: data.adv_sub_brand,
      adv_brand: data.adv_brand,
      adv_company: data.adv_company,

      // For Agency Rep & Agency Admin
      companies: data.companies,

      // For NetworkAdmin
      related_data: data.related_data,

      //okta information
      oktaDetails: data.okta,
    };
  }

  isAgencyAdminUser() {
    return this.getUser() && this.getUser().userRole === "Agency Admin";
  }

  isAgencyRepUser() {
    return this.getUser() && this.getUser().userRole === "Agency Rep";
  }

  isAdvertiserAdminUser() {
    return this.getUser() && this.getUser().userRole === "Advertiser Admin";
  }

  isAdvertiserUserUser() {
    return this.getUser() && this.getUser().userRole === "Advertiser User";
  }

  isSuperAdminUser() {
    return this.getUser() && this.getUser().userRole === "Super Admin";
  }

  isQuantAdminUser() {
    return this.getUser() && this.getUser().userRole === "Quant Admin";
  }

  isNetworkAdminUser() {
    return this.getUser() && this.getUser().userRole === "Network Admin";
  }

  isOperatorAdminUser() {
    return this.getUser() && this.getUser().userRole === "Distributor Admin";
  }

  isUserReadOnly() {
    return this.getUser() && this.getUser().read_only;
  }

  isCbsNetworkAdminUser() {
    return (
      this.getUser() &&
      this.getUser().userRole === "Network Admin" &&
      ["Viacom cbs", "cbs"].includes(this.getUser().related_data.network.name)
    );
  }

  isFoxNetworkAdminUser() {
    return (
      this.getUser() &&
      this.getUser().userRole === "Network Admin" &&
      ["fox corporation", "fox"].includes(
        this.getUser().related_data.network.name
      )
    );
  }

  isUnivisionNetworkAdminUser() {
    return (
      this.getUser() &&
      this.getUser().userRole === "Network Admin" &&
      ["Univision", "univision communications inc"].includes(
        this.getUser().related_data.network.name
      )
    );
  }

  accessCheckForEntity(entity) {
    const user = this.getUser();
    if (this.isAgencyAdminUser() || this.isAgencyRepUser()) {
      return true;
    }
    if (user.adv_company && user.adv_brand && user.adv_sub_brand) {
      return entity.id === user.adv_sub_brand;
    } else if (user.adv_company && user.adv_brand && !user.adv_sub_brand) {
      return entity.id === user.adv_brand || entity.parent === user.adv_brand;
    } else if (user.adv_company && !user.adv_brand && !user.adv_sub_brand) {
      return (
        entity.id === user.adv_company || entity.company === user.adv_company
      );
    }
  }

  deleteSession() {
    this.userObj = null;
    window.sessionStorage.removeItem("userObj");
    localStorage.removeItem("userObj");
    return Promise.resolve();
  }

  async validateResetToken(reset_token) {
    this.rootStore.uiStore.isLoading = true;
    const validationUrl = `users/password/${reset_token}/`;
    try {
      const res = await API.get(validationUrl);
      return res;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async resetClientPassword(payload) {
    this.rootStore.uiStore.isLoading = true;
    const resetUrl = `users/password/`;
    try {
      const res = await API.post(resetUrl, payload);
      return res;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default AuthStore;
