import React from "react";
import "./App.scss";
import DatabaseProvider from "@nozbe/watermelondb/DatabaseProvider";
import database from "./models/database";
import Login from "./screens/login/Login";
import Home from "./screens/home/Home";
import Register from "./screens/register/Register";
import VerifySMS from "./screens/verifySMS/Verify_sms";
import Dashboard from "./screens/dashboard/Dasboard";

import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import paths from "./utilities/paths";
import GetStarted from "./screens/getStarted/GetStarted";
import AddProducts from "./screens/onboarding/addProducts/AddProducts";
import CategorySetup from "./screens/onboarding/categorySetup/CategorySetup";
import Cart from "./screens/sell/cart/Cart";
import ResetPassword from "./screens/forgotPassword/sections/ResetPassword";
import ForgottenPassword from "./screens/forgotPassword/ForgottenPassword";
import Admin from "./screens/admin/Admin";
import AddWarehouse from "./screens/admin/warehouse/AddWarehouse";
import ChangeStoreInformation from "./screens/admin/storeInformation/ChangeStoreInformation";
import AccountInformation from "./screens/admin/accountInformation/AccountInformation";
import VerifyPhone from "./screens/admin/accountInformation/VerifyPhone";
import ChangePrice from "./screens/admin/changePrice/ChangePrice";


function NoMatch() {
  let location = useLocation();

  return (
    <div
      status="404"
      title="404"
      subTitle={`Sorry, the page ${location.pathname} does not exist.`}
      extra={
        <button type="primary" onClick={() => (window.location.href = "/")}>
          Back Home
        </button>
      }
    />
  );
}

function setPageBackground(backgroundColor = "#fff") {
  document.body.style.backgroundColor = backgroundColor;
}

class App extends React.Component {
  setTitle(title) {
    document.title = title;
  }

  render() {
    const appName = "El-Parah Retail App";

    return (
      <DatabaseProvider database={database}>
        <div className="App">
          <Router>
            <Switch>
              <Route
                exact
                path={paths.login}
                render={() => {
                  this.setTitle(`Login | ${appName}`);
                  return <Login />;
                }}
              />
              <Route
                exact
                path={paths.cart}
                render={() => {
                  this.setTitle(`Cart | ${appName}`);
                  return <Cart />;
                }}
              />
              <Route
                path={paths.register}
                render={() => {
                  this.setTitle(`Registration | ${appName}`);
                  setPageBackground();
                  return <Register />;
                }}
              />
                <Route
                path={paths.reset_password}
                render={() => {
                  this.setTitle(`Reset Password | ${appName}`);
                  setPageBackground();
                  return <ResetPassword />;
                }}
              />
                <Route
                    path={paths.forgot_password}
                    render={() => {
                        this.setTitle(`Forgot Password | ${appName}`);
                        setPageBackground();
                        return <ForgottenPassword />;
                    }}
                />
              <Route
                path={paths.home}
                render={() => {
                  setPageBackground();
                  this.setTitle(`Home | ${appName}`);
                  return <Home />;
                }}
              />
                <Route
                    path={paths.verify_sms}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Verify contact | ${appName}`);
                        return <VerifySMS />;
                    }}
                />
                <Route
                    path={paths.dashboard}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Dashboard | ${appName}`);
                        return <Dashboard />;
                    }}
                />
                <Route
                    path={paths.get_started}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Getting Started | ${appName}`);
                        return <GetStarted/>;
                    }}
                />
                <Route
                    path={paths.category_setup}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Add shop categories | ${appName}`);
                        return <CategorySetup/>;
                    }}
                />
                <Route
                    path={paths.add_products}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Add products | ${appName}`);
                        return <AddProducts/>;
                    }}
                />
                <Route
                    path={paths.admin}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <Admin />;
                    }}
                />
                <Route
                    path={paths.add_warehouse}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <AddWarehouse />;
                    }}
                />
                <Route
                    path={paths.change_store_info}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <ChangeStoreInformation />;
                    }}
                />
                <Route
                    path={paths.account_info}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <AccountInformation />;
                    }}
                />
                <Route
                    path={paths.verify_phone}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <VerifyPhone />;
                    }}
                />
                <Route
                    path={paths.change_price}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <ChangePrice />;
                    }}
                />
                <Route
                    path={paths.generate_barcode}
                    render={() => {
                        setPageBackground();
                        this.setTitle(`Admin | ${appName}`);
                        return <ChangePrice />;
                    }}
                />
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </Router>
        </div>
      </DatabaseProvider>
    );
  }
}

export default App;
