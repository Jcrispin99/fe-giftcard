import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/LoginPage";
import ListEmployee from "../pages/employee/ListEmployee";
import ListCustomer from "../pages/customer/ListCustomer";
import ListGiftcard from "../pages/giftcards/ListGiftcard";
import ListTicket from "../pages/tickets/ListTicket";
import ListCategories from "../pages/categories/ListCategories";
import ManagerTickets from "../pages/tickets/ManagerTickets";
import OtherBussinessList from "../pages/otherBussiness/OtherBussinessList";
import ListReport from "../pages/reports/ListReport";

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
  {
    path: "/categories",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListCategories,
  },
  {
    path: '/tickets/:id',
    name: "",
    exact: true,
    pageTitle: "",
    component: ManagerTickets,
  },
  {
    path: "/other-bussiness",
    name: "",
    exact: true,
    pageTitle: "",
    component: OtherBussinessList,
  },
  {
    path: "/report",
    name: "",
    exact: true,
    pageTitle: "",
    component: ListReport,
  },
];

export default Routes;
