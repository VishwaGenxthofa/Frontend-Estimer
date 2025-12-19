// src/components/common/Header.tsx
import React from 'react';
import {  LogOut } from 'lucide-react';
import type { User } from '../../types/Index';
import glogo from '../../assets/glogo.gif'
interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
           <img src={glogo} className="w-14 h-14   cursor-pointer" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GenXthofa Technologies</h1>
            <p className="text-xs text-gray-500">Estimer</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            {/* <p className="text-sm font-semibold text-gray-900">{user.email}</p> */}
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;