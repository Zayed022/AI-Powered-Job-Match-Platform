import { NavLink } from 'react-router-dom';
import {
  Home,
  UserRound,
  Briefcase,
  Compass, 
} from 'lucide-react'; 
import clsx from 'clsx';

const LinkItem = ({ to, icon: Icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'group flex flex-col items-center gap-1 rounded-xl py-3 transition w-full',
        isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'
      )
    }
  >
    <div className="relative">
      <Icon size={24} strokeWidth={2} className="transition" />
      {badge ? (
        <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold leading-none text-white">
          {badge}
        </span>
      ) : null}
    </div>
    <span className="text-xs">{label}</span>
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col items-center w-[120px] shrink-0 border-r border-gray-200 px-2 pt-6">
      <LinkItem to="/"         icon={Home}       label="Home"       />
      <LinkItem to="/profile"  icon={UserRound}  label="Profile"    />
      <LinkItem to="/jobs"     icon={Briefcase}  label="Jobs"       />
      <LinkItem to="/search"   icon={Compass}    label="Search Jobs"/>
    </aside>
  );
};

export default Sidebar;
