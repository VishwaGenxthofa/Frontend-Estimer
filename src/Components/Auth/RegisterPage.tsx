import{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Error states
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  // Password validation
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleGetStarted = () => {
    // Reset all errors
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);

    // Validate all fields
    let hasError = false;
    
    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }
    
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }
    
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    } else if (!hasMinLength || !hasSpecialChar) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // If all validations pass
    alert("Account created successfully!");
    console.log('Registration successful', { name, email, password });
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  const handleLoginClick = () => {
    alert("Redirecting to login page...");
    // In your actual app: navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create an account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Start your 30-day free trial.
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={()=>setActiveTab('signup')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign up
          </button>
          <button
            onClick={()=>setActiveTab('login')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Log in
          </button>
        </div>

        {/* Form Container */}
        <div className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
              className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                nameError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-purple-500 focus:border-transparent'
              }`}
              placeholder="Enter your name"
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-500">Name is required</p>
            )}
          </div>

          {/* Email Input */}
          <div>
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
              placeholder="Create a password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">
                {!password.trim() 
                  ? "Password is required" 
                  : "Password must meet all requirements"}
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

          {/* Get Started Button */}
          <button
            onClick={handleGetStarted}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md"
          >
            Get started
          </button>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.8055 10.2292C19.8055 9.55153 19.7501 8.86459 19.6296 8.19653H10.2002V12.0493H15.6014C15.3773 13.2911 14.6571 14.3898 13.6029 15.0875V17.5866H16.8252C18.7177 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2002 20.0006C12.9515 20.0006 15.2664 19.1151 16.8294 17.5865L13.6071 15.0874C12.7096 15.6979 11.5503 16.0433 10.2044 16.0433C7.54243 16.0433 5.2869 14.2832 4.48894 11.9169H1.16797V14.4927C2.76929 17.6847 6.3114 20.0006 10.2002 20.0006Z" fill="#34A853"/>
              <path d="M4.48486 11.917C4.04494 10.6752 4.04494 9.32618 4.48486 8.08431V5.50854H1.16797C-0.390991 8.61263 -0.390991 12.3888 1.16797 15.4929L4.48486 11.917Z" fill="#FBBC04"/>
              <path d="M10.2002 3.95805C11.6246 3.93601 13.0008 4.47262 14.036 5.45722L16.8933 2.60046C15.1801 0.990847 12.9263 0.116943 10.2002 0.143885C6.3114 0.143885 2.76929 2.45979 1.16797 5.50854L4.48486 8.08431C5.27874 5.71385 7.53835 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={handleLoginClick}
            className="font-medium text-purple-600 hover:text-purple-700"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}