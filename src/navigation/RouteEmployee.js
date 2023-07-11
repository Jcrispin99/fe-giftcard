import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";
import ListCustomer from "../pages/customer/ListCustomer";
import ListGiftcard from "../pages/giftcards/ListGiftcard";
import ListTicket from "../pages/tickets/ListTicket";
import ListReport from "../pages/reports/ListReport";

const RouteEmployee = [
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
    path: "/customer",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListCustomer,
  },
  {
    path: "/giftcard",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListGiftcard,
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

export default RouteEmployee;
