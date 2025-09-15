import { Link2, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../../routes";
import { localKey } from "../../../lib/api";
import { userStore } from "../../../state/global";

export default function AsideLeft() {
  const location = useLocation();
  const role = userStore(state => state.role);
  const email = userStore(state => state.email);

  return (
    <aside className="flex flex-col justify-between bg-gradient-to-b from-cyan-900 to-cyan-800 w-full h-screen overflow-x-hidden overflow-y-auto text-white rounded-r-2xl">
      <div className="h-fit w-full">
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
      </div>
      {/* // profile section */}
      <div className="h-fit w-full p-5 bg-white/10 flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-700 rounded-full flex items-center justify-center text-white font-bold">
            {email ? email.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-sm font-semibold">{email}</p>
            <p className="text-xs">{role?.replace("_", " ")}</p>
          </div>
        </div>
        <div>
          <button
            className="w-full mt-4 bg-pink-100 hover:bg-pink-200 text-pink-500 text-sm font-medium py-2 px-4 rounded-full"
            onClick={() => {
              localStorage.removeItem(localKey.token);
              window.location.href = "/login";
            }}
          >
            <LogOut size={12} />
          </button>
        </div>
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