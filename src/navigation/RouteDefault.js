import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";
import ManagerTickets from "../pages/tickets/ManagerTickets";

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
  },
  {
    path: '/tickets/:id',
    name: "",
    exact: true,
    pageTitle: "",
    component: ManagerTickets,
  },
];

export default RouteDefault;
