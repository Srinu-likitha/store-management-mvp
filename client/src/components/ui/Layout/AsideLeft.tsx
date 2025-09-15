import { Link2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes";

export default function AsideLeft() {
  const location = useLocation();

  return (
    <aside className="bg-gradient-to-b from-cyan-900 to-cyan-800 w-full h-screen overflow-x-hidden overflow-y-auto text-white rounded-r-2xl">
      <div className="flex items-center gap-3 p-5 border-b border-cyan-700/50">
        <img src="/logo.png" className="h-9 filter brightness-0 invert" />
        <h1 className="text-xl font-bold tracking-wide">NEXSYNC</h1>
      </div>
      
      <div className="flex flex-col mt-8 px-3">
        {routes.map((route) => {
          if (!route.menu) return null;

          const isActive = getIsActive(route.path, location.pathname);

          return (
            <Link
              key={route.path}
              to={route.path}
              className={`relative flex items-center gap-3 py-3 px-4 my-1 rounded-xl transition-all duration-200 text-sm font-medium
                ${isActive 
                  ? 'bg-white text-cyan-800 shadow-lg' 
                  : 'text-cyan-100 hover:bg-cyan-700/50 hover:text-white'
                }`}
            >
              {route.icon || <Link2 className="w-5 h-5" />}
              <span>{route.name || route.path.replace('/', '')}</span>
              
              {isActive && (
                <div className="absolute -left-2 w-1 h-6 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

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