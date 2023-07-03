import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";

const RouteDefault = [
  {
    path: "/",
    name: "login",
    exact: true,
    pageTitle: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "",
    exact: true,
    pageTitle: "",
    component: Dashboard,
  }
];

export default RouteDefault;
