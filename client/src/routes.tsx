import type { JSX } from "react";
import Login from "./components/pages/Login";
import AppLayout from "./components/ui/Layout/AppLayout";
import Home from "./components/pages/Home";
import { HomeIcon, Inbox } from "lucide-react";
import Invoice from "./components/pages/Invoices";
import AddMaterialInvoice from "./components/ui/Invoice/AddMaterialInvoice";

type Route = {
  path: string;
  element: JSX.Element;
  menu?: boolean;
  name?: string;
  icon?: JSX.Element;
  activeFor?: string[];
}[]

export const routes: Route = [
  {
    path: '*',
    element: <div>Sorry not found</div>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <AppLayout>
      <Home />
    </AppLayout>,
    menu: true,
    name: "Dashboard",
    icon: <HomeIcon size={16} />,
  },
  {
    path: "/material-invoices",
    element: <AppLayout>
      <Invoice />
    </AppLayout>,
    menu: true,
    name: "Invoices",
    icon: <Inbox size={16} />,
    activeFor: ['/add-invoice']
  },
  {
    path: "/add-invoice",
    element: <AppLayout>
      <AddMaterialInvoice />
    </AppLayout>,
    menu: false,
    name: "Invoices",
    icon: <Inbox size={16} />,
  }
]