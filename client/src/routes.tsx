import type { JSX } from "react";
import Login from "./components/pages/Login";
import AppLayout from "./components/ui/Layout/AppLayout";
import Home from "./components/pages/Home";
import { HomeIcon, Inbox } from "lucide-react";
import Invoice from "./components/pages/Invoices";
import AddMaterialInvoice from "./components/ui/Invoice/AddMaterialInvoice";
import Dc from "./components/pages/Dc";
import AddDc from "./components/ui/dc/AddDc";
import Landing from "./components/pages/Landing";

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
    path: '/',
    element: <Landing />
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
    name: "Add Invoices",
    icon: <Inbox size={16} />,
  },
    {
    path: "/material-dc",
    element: <AppLayout>
      <Dc />
    </AppLayout>,
    menu: true,
    name: "Material Dc",
    icon: <Inbox size={16} />,
    activeFor: ['/add-dc']
  },
  {
    path: "/add-dc",
    element: <AppLayout>
      <AddDc />
    </AppLayout>,
    menu: false,
    name: "Add Dc",
    icon: <Inbox size={16} />,
  }
]