import { useState} from 'react';
import {  Key, } from 'lucide-react';


// Page 2: Forgot Password
function ForgotPasswordPage({ onBackToLogin }:any) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleResetPassword = () => {
    setEmailError(false);

    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Key className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Forgot password?
        </h1>
        <p className="text-center text-gray-600 mb-8">
          No worries, we'll send you reset instructions.
        </p>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              emailError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
            }`}
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-500">Email is required</p>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetPassword}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md mb-6"
        >
          Reset password
        </button>

        {/* Back to Login */}
        <button
          onClick={onBackToLogin}
          className="w-full text-center text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2"
        >
          ← Back to log in
        </button>
      </div>
    </div>
  );
}
export default ForgotPasswordPage;