import "./App.css";
import { BrowserRouter as Router, Switch, Route, HashRouter} from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Routes from "./navigation/Route";
import Login from './pages/auth/LoginPage';
import LoginPageCustomer from "./pages/auth/LoginPageCustomer";
import Home from "./pages/dashboardPublic/Home";
import CustomerNewPassword from "./pages/auth/CustomerNewPassword";
import RoutesCustomer from "./navigation/RouteCustomer";
import ProtectedCustomerRoute from "./components/guard/ProtectedCustomerRoute";

function App() {

  return (
    <>
      <Router>
        <HashRouter>
          <Switch>
            <Route exact path="/gift-card-customer" component={LoginPageCustomer} />
            <Route exact path="/customer-new-password" component={CustomerNewPassword} />
            <Route exact path="/home" component={Home} />      
            <Route exact path="/login" component={Login} />
            {Routes.map((layout, i) => {
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

export default App;
