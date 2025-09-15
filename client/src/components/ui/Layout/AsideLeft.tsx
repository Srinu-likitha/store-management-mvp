import { Link2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes";

export default function AsideLeft() {
  const location = useLocation();

  return (
    <aside className="bg-indigo-50 w-full h-screen overflow-x-hidden overflow-y-auto">
      <div className="flex items-center gap-4 p-6">
        <img src="/logo.png" className="h-[40px]" />
        <h1 className="text-xl">NEXSYNC</h1>
      </div>
      <div className="flex flex-col mt-6">
        {
          routes.map((route) => {
            if (!route.menu) return null;

            const isActive = getIsActive(route.path, location.pathname);

            return (
              <Link
                key={route.path}
                to={route.path}
                className={isActive ? activeStyle : defaultStyle}
              >
                {route.icon || <Link2 className="w-4 h-4" />}
                {route.name || route.path.replace('/', '')}
              </Link>
            );
          })
        }
      </div>
    </aside>
  );
}

const defaultStyle = 'text-gray-700 p-4 px-6 rounded-l-md hover:bg-white transition-colors flex items-center gap-2 text-sm capitalize';
const activeStyle = 'text-primary bg-white p-4 px-[calc(var(--spacing)*6-8px)] rounded-l-md hover:bg-white transition-colors border-l-8 border-primary flex items-center gap-2 text-sm capitalize font-semibold';

function getIsActive(routePath: string, currentPath: string): boolean {
  // Exact match
  if (routePath === currentPath) return true;

  const route = routes.find(r => r.path === routePath);
  if (!route) return false;

  // Check if currentPath starts with routePath (e.g., /tasks and /project/tasks)
  if (currentPath.startsWith(routePath)) return true;

  // Check activeFor paths
  return (route.activeFor || []).some(path => currentPath.startsWith(path));
}

