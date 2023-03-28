import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/guard/ProtectedRoute";
import Routes from "./navigation/Route";
import Login from './pages/auth/LoginPage';
import Contacts from "./pages/dashboardPublic/Contacts";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/contacts" component={Contacts} />      
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
      </Router>
    </>
  );
}

export default App;
