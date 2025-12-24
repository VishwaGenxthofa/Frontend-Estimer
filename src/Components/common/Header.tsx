// src/components/common/Header.tsx
import React, { useState } from 'react';
import { LogOut, Bell, Settings, User as UserIcon } from 'lucide-react';
import type { User } from '../../types/Index';
import glogo from '../../assets/logo.png';
import genx from '../../assets/glogo.gif'
import estimerlogo from '../../assets/estimer-logo.png'
import estimericon from '../../assets/estimer-icon.png'
interface HeaderProps {
  user: User;
  onLogout: () => void;
}
const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm   relative">
      <div className="flex items-center justify-between px-4 py-3">

        
       <div className="flex items-center gap-4">

  <img src={glogo} alt="Logo" className="hidden sm:block cursor-pointer  " />

 
  <img src={genx} className="block sm:hidden cursor-pointer w-12 h-12"  />
</div>
         <div className='flex items-center gap-4'>
          <img src={estimericon} alt="Logo" className="block sm:hidden cursor-pointer w-14 h-14 " />
        <img src={estimerlogo} className="hidden sm:block cursor-pointer" width={180}height={170} />
         </div>
        {/* Right */}
        <div className="flex items-center gap-4 relative">
          

          {/* Icons */}
          <div className='w-12 h-12 flex items-center justify-center rounded-full bg-green-100'>
          <button onClick={() => setOpenMenu(!openMenu)}>
            <Bell className="w-5 h-5 text-gray-600 hover:text-green-500 cursor-pointer" />
          </button>
          </div>
          <div  className='w-12 h-12 flex items-center justify-center rounded-full bg-gray-100'>
          <button onClick={() => setOpenMenu(!openMenu)}>
            <Settings className="w-5 h-5 text-gray-600 hover:text-gray-500 cursor-pointer" />
          </button>
          </div>
           <div className='w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100'>
             <button onClick={() => setOpenMenu(!openMenu)}>
            <UserIcon className="w-6 h-6 text-gray-600 hover:text-yellow-500 cursor-pointer" />
          </button>
           </div>
          

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
