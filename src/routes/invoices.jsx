import React from "react";
import { inject, observer } from "mobx-react";

const Invoices = inject(
  "authStore",
  "accountManagementStore"
)(
  observer((props) => {
    const { authStore, accountManagementStore } = props;

    authStore
      .authenticate("admin_univision@adcuratio.com", "Adcuratio@123")
      .then(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    console.log(authStore, accountManagementStore);
    return (
      <div>
        <h1>hey! i am random invoice</h1>
      </div>
    );
  })
);

export default Invoices;
