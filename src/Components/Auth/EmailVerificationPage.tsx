import  { useState, useRef } from 'react';
import { Mail} from 'lucide-react';
import { Link } from 'react-router-dom';

// Page 1: Email Verification
function EmailVerificationPage({ onBackToLogin, userEmail }:any) {
  const [code, setCode] = useState(['', '', '', '']);
 const inputRefs = [
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
  useRef<HTMLInputElement>(null),
];



  const handleChange = (index:any, value:any) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index:any, e:any) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 4) {
      alert('Please enter all 4 digits');
      return;
    }
    alert(`Verification code ${enteredCode} submitted!`);
  };

  const handleResend = () => {
    alert('Verification code resent!');
    setCode(['', '', '', '']);
    inputRefs[0].current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Mail className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-center text-gray-600 mb-8">
          We sent a verification link to<br />
          <span className="font-medium">{userEmail}</span>
        </p>

        {/* Code Input */}
        <div className="flex justify-center gap-3 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-center text-3xl font-semibold text-purple-600 bg-white border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-md mb-6"
        >
          Verify email
        </button>

        {/* Resend Link */}
        <p className="text-center text-sm text-gray-600 mb-6">
          Didn't receive the email?{' '}
          <button 
            onClick={handleResend}
            className="font-medium text-purple-600 hover:text-purple-700"
          >
            Click to resend
          </button>
        </p>

        {/* Back to Login */}
       
        <button
          onClick={onBackToLogin}
          className="w-full text-center text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2"
        >
           <Link to='/login'>
          Back to log in
          </Link>
        </button>
        
      </div>
    </div>
  );
}
export default EmailVerificationPage;