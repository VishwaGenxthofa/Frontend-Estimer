// src/components/common/LoginScreen.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';
import type { User } from '../../types/Index';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <Briefcase className="w-20 h-20 mx-auto text-blue-600 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900">GenXthofa Technologies</h1>
          <p className="text-lg text-gray-600 mt-3">Project Management System</p>
        </div>

        <div className="space-y-5">
          <button
            onClick={() => onLogin({ email: 'admin@genxthofa.com', role: 'Admin' })}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-semibold text-lg shadow-md"
          >
            Login as Admin
          </button>

          <button
            onClick={() => onLogin({ email: 'client@techcorp.com', role: 'Client' })}
            className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition font-semibold text-lg shadow-md"
          >
            Login as Client
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Demo app • No credentials required
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;