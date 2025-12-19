import React, { useState } from 'react';
import gloginpage from '../../assets/gloginpage.gif'
import { Link } from 'react-router-dom';
interface LoginScreenProps {
  onLogin: (email: string,password:string ) => void;
}
const  LoginPage:React.FC<LoginScreenProps>=({onLogin})=> {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
 
  // const handleSignIn = () => {
  //   if(email == "vishwa@gmail.com" && password == "vishwa@123"){
  //       navigator('dashboard')
  //   }else{
  //       alert("invalid  email & password ")
  //   }
  //   console.log('sign sucessfully ',  email, password,);
  // };

  // const handleGoogleSignIn = () => {
  //   console.log('Google sign in clicked');
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 shadow-[0_8px_30px_rgba(2,6,23,0.08)] ">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <div className=" bg-gradient-to-br from-purple-500 to-purple-600 rounded-full"> 
              <img src={gloginpage} className="w-14 h-14   cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Log in to your account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please enter your details.
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'signup'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign up
          </button>
          <button
            onClick={()=> setActiveTab('login')}
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
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
             
              
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="vishwa@gmail.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="vishwa@123"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember for 30 days</span>
            </label>
            <Link to='/forgot' className="text-sm font-medium text-purple-600 hover:text-purple-700">
              Forgot password
            </Link>
          </div>
          
          {/* Sign In Button */}
          <button
            onClick={()=>onLogin(email,password)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md"
          >
            Sign in
          </button>

          {/* Google Sign In Button */}
          <button
            
            className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.8055 10.2292C19.8055 9.55153 19.7501 8.86459 19.6296 8.19653H10.2002V12.0493H15.6014C15.3773 13.2911 14.6571 14.3898 13.6029 15.0875V17.5866H16.8252C18.7177 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
              <path d="M10.2002 20.0006C12.9515 20.0006 15.2664 19.1151 16.8294 17.5865L13.6071 15.0874C12.7096 15.6979 11.5503 16.0433 10.2044 16.0433C7.54243 16.0433 5.2869 14.2832 4.48894 11.9169H1.16797V14.4927C2.76929 17.6847 6.3114 20.0006 10.2002 20.0006Z" fill="#34A853"/>
              <path d="M4.48486 11.917C4.04494 10.6752 4.04494 9.32618 4.48486 8.08431V5.50854H1.16797C-0.390991 8.61263 -0.390991 12.3888 1.16797 15.4929L4.48486 11.917Z" fill="#FBBC04"/>
              <path d="M10.2002 3.95805C11.6246 3.93601 13.0008 4.47262 14.036 5.45722L16.8933 2.60046C15.1801 0.990847 12.9263 0.116943 10.2002 0.143885C6.3114 0.143885 2.76929 2.45979 1.16797 5.50854L4.48486 8.08431C5.27874 5.71385 7.53835 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-purple-600 hover:text-purple-700">
            Sign up
          </a>
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">Demo Accounts:</p>
            <p className="text-gray-600">Admin:vishwa@gmail.com  && password:vishwa@123</p>
            <p className="text-gray-600">Client: john@client.com && password:client@123</p>
          </div>
      </div>
    </div>
    
  );
}
export default LoginPage;