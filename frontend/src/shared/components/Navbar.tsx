import { NavLink } from 'react-router-dom';

export function Navbar() {
  const activeClass =
    'inline-flex items-center border-b-2 border-slate-900 px-1 pt-1 text-sm font-semibold text-slate-950';
  const inactiveClass =
    'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700';

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo và Tiêu đề */}
          <div className="flex flex-1 items-center justify-between md:justify-start gap-8">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-lg font-bold tracking-tight text-slate-950 flex items-center gap-1.5">
                <svg
                  className="h-5 w-5 text-slate-900"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                UtilityTrack
              </span>
            </div>

            {/* Links điều hướng ngang trên Desktop */}
            <div className="hidden md:flex md:space-x-6 h-16">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Tổng quan
              </NavLink>

              <div className="h-4 w-px bg-slate-200 self-center" />

              <NavLink
                to="/electricity-records"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                end
              >
                Quản lý điện
              </NavLink>



              <div className="h-4 w-px bg-slate-200 self-center" />

              <NavLink
                to="/vehicles"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                end
              >
                Quản lý xe
              </NavLink>

              <NavLink
                to="/vehicles/km-records"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Nhật ký KM
              </NavLink>

              <NavLink
                to="/vehicles/fuel-records"
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                Đổ xăng/dầu
              </NavLink>
            </div>
          </div>
        </div>

        {/* Links điều hướng cuộn ngang cho thiết bị di động */}
        <div className="flex md:hidden space-x-4 overflow-x-auto pb-3 pt-1 scrollbar-none border-t border-slate-100">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white'
                : 'whitespace-nowrap rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600'
            }
          >
            Tổng quan
          </NavLink>
          <NavLink
            to="/electricity-records"
            className={({ isActive }) =>
              isActive
                ? 'whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white'
                : 'whitespace-nowrap rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600'
            }
            end
          >
            Quản lý điện
          </NavLink>

          <NavLink
            to="/vehicles"
            className={({ isActive }) =>
              isActive
                ? 'whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white'
                : 'whitespace-nowrap rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600'
            }
            end
          >
            Quản lý xe
          </NavLink>
          <NavLink
            to="/vehicles/km-records"
            className={({ isActive }) =>
              isActive
                ? 'whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white'
                : 'whitespace-nowrap rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600'
            }
          >
            Nhật ký KM
          </NavLink>
          <NavLink
            to="/vehicles/fuel-records"
            className={({ isActive }) =>
              isActive
                ? 'whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white'
                : 'whitespace-nowrap rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600'
            }
          >
            Đổ xăng/dầu
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
