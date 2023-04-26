import "./App.css";
import { BrowserRouter as Router, Switch, Route, HashRouter} from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Routes from "./navigation/Route";
import Login from './pages/auth/LoginPage';
import GiftCardCustomer from "./pages/dashboardPublic/GiftCardCustomer";

function App() {

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
