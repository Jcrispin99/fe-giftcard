import "./App.css";
import { BrowserRouter as Router, Switch, Route, HashRouter} from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Routes from "./navigation/Route";
import RouteDefault from "./navigation/RouteDefault";
import RouteEmployee from "./navigation/RouteEmployee";
import RoutePartner from "./navigation/RoutePartner";
import Login from './pages/auth/LoginPage';
import LoginPageCustomer from "./pages/auth/LoginPageCustomer";
import Home from "./pages/dashboardPublic/Home";
import CustomerNewPassword from "./pages/auth/CustomerNewPassword";
import RoutesCustomer from "./navigation/RouteCustomer";
import ProtectedCustomerRoute from "./components/guard/ProtectedCustomerRoute";
import { connect } from "react-redux";
import store from "./redux/store";

function App() {

  const state = store.getState();
  let routesAvailables = [];

  if(state && ('role' in state.user) && state.user.role !== ''){
    if(state.user?.role === 'PARTNER_ROLE'){
      if(state.user.partner === '643cc88d275ca4adfd709dfc'){
        routesAvailables = [...RouteEmployee];
      }else{
        routesAvailables = [...RoutePartner];
      }
    }
    if(state.user.role === 'ADMIN_ROLE'){
      routesAvailables = [...Routes];
    }
    if(state.user.role === 'EMPLOYEE_ROLE'){
      routesAvailables = [...RouteEmployee];
    }
  }else{
    routesAvailables = RouteDefault;
  }

  console.log('routesAvailables',routesAvailables);

  return (
    <>
      <Router>
        <HashRouter>
          <Switch>
            <Route exact path="/gift-card-customer" component={LoginPageCustomer} />
            <Route exact path="/customer-new-password" component={CustomerNewPassword} />
            <Route exact path="/home" component={Home} />      
            <Route exact path="/login" component={Login} />
            {routesAvailables.map((layout, i) => {
              return (
                <ProtectedRoute
                  key={i}
                  exact={layout.exact}
                  path={layout.path}
                  component={layout.component}
                  name={layout.name}
                />
              );
            })}

            {RoutesCustomer.map((layout, i) => {
              return (
                <ProtectedCustomerRoute
                  key={i}
                  exact={layout.exact}
                  path={layout.path}
                  component={layout.component}
                  name={layout.name}
                />
              );
            })}
          </Switch>
        </HashRouter>
      </Router>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(App);
