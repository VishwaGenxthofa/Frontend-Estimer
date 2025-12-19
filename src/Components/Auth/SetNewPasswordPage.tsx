
import  { useState } from 'react';
import {  Lock } from 'lucide-react';
function SetNewPasswordPage({ onBackToLogin }:any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleResetPassword = () => {
    setPasswordError(false);
    setConfirmError(false);

    let hasError = false;

    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    } else if (!hasMinLength || !hasSpecialChar) {
      setPasswordError(true);
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmError(true);
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    alert('Password reset successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Set new password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your new password must be different to<br />previously used passwords.
        </p>

        {/* Form */}
        <div className="space-y-5">
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                passwordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
              }`}
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">
                {!password.trim() 
                  ? "Password is required" 
                  : "Password must meet all requirements"}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmError(false);
              }}
              className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                confirmError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
              }`}
              placeholder="••••••••"
            />
            {confirmError && (
              <p className="mt-1 text-sm text-red-500">
                {!confirmPassword.trim() 
                  ? "Please confirm your password" 
                  : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                hasMinLength ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {hasMinLength && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${hasMinLength ? 'text-gray-700' : 'text-gray-500'}`}>
                Must be at least 8 characters
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                hasSpecialChar ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                {hasSpecialChar && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${hasSpecialChar ? 'text-gray-700' : 'text-gray-500'}`}>
                Must contain one special character
              </span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetPassword}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md"
          >
            Reset password
          </button>
        </div>

        {/* Back to Login */}
        <button
          onClick={onBackToLogin}
          className="w-full mt-6 text-center text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2"
        >
          ← Back to log in
        </button>
      </div>
    </div>
  );
}
export default SetNewPasswordPage;