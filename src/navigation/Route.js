import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";
import ListEmployee from "../pages/employee/ListEmployee";
import ListCustomer from "../pages/customer/ListCustomer";
import ListGiftcard from "../pages/giftcards/ListGiftcard";
import ListTicket from "../pages/tickets/ListTicket";

const Routes = [
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
    path: "/employee",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListEmployee,
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
];

export default Routes;
