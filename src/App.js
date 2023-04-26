import "./App.css";
import { BrowserRouter as Router, Switch, Route, HashRouter} from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Routes from "./navigation/Route";
import RoutesPartner from "./navigation/RoutePartner";
import Login from './pages/auth/LoginPage';
import GiftCardCustomer from "./pages/dashboardPublic/GiftCardCustomer";
import store from "./redux/store";

function App() {

  const state = store.getState();
  let routes = [];
  if(state && state.user.role !== ''){
    if(state.user.role === 'PARTNER_ROLE'){
      routes = RoutesPartner;
    }
    if(state.user.role === 'ADMIN_ROLE' || 
       state.user.role === 'EMPLOYEE_ROLE')
    {
      routes = Routes;
    }
  }

  return (
    <>
      <Router>
        <HashRouter>
          <Switch>
            <Route exact path="/gift-card-customer/:id" component={GiftCardCustomer} />      
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
          </Switch>
        </HashRouter>
      </Router>
    </>
  );
}

export default App;
