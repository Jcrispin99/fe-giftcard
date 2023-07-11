import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";
import ListTicket from "../pages/tickets/ListTicket";
import ListReport from "../pages/reports/ListReport";

const RoutePartner = [
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
    path: "/ticket",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListTicket,
  },
  {
    path: "/report",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListReport,
  },
  {
    path: '/tickets/:id',
    name: "",
    exact: true,
    pageTitle: "",
    component: ManagerTickets,
  },
];

export default RoutePartner;
