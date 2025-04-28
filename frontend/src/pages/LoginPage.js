import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const navigate = useNavigate();
  
  // Demo account credentials
  const demoCredentials = {
    email: 'demo@bdacademic.org',
    password: 'demo123'
  };

  // Pre-fill with demo account if coming from the demo notice
  useEffect(() => {
    const useDemoAccount = localStorage.getItem('useDemoAccount');
    if (useDemoAccount === 'true') {
      setEmail(demoCredentials.email);
      setPassword(demoCredentials.password);
      localStorage.removeItem('useDemoAccount');
      setShowDemoNotice(true);
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock login functionality (replace with actual API call in production)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (in a real app, you would call your API)
      if ((email === 'admin@example.com' && password === 'password') || 
          (email === demoCredentials.email && password === demoCredentials.password)) {
        
        // Demo or admin successful login
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Store user info in localStorage
        const userInfo = {
          id: email === demoCredentials.email ? 'demo-user-id' : 'admin-user-id',
          name: email === demoCredentials.email ? 'Demo User' : 'Admin User',
          email: email,
          role: email === demoCredentials.email ? 'academic' : 'admin',
          isDemo: email === demoCredentials.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const useDemoAccount = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setShowDemoNotice(true);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center pt-12">
      <div className="w-full max-w-md px-8 py-10 bg-black bg-opacity-50 backdrop-blur-md rounded-xl shadow-xl border border-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to your account</p>
        </div>
        
        {/* Demo Account Notice */}
        <div className="mb-6">
          <div className="bg-blue-900 bg-opacity-50 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg flex items-start">
            <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm">
                <span className="font-semibold">Demo Account Available:</span> Use the button below to try our platform with a demo account.
              </p>
              <button 
                onClick={useDemoAccount}
                className="mt-2 bg-blue-600 text-xs text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Use Demo Account
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900 bg-opacity-50 text-green-200 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}
        
        {showDemoNotice && (
          <div className="bg-yellow-900 bg-opacity-50 text-yellow-200 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">
              <span className="font-semibold">Demo credentials loaded!</span> Click "Log In" to access the dashboard.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 bg-opacity-80 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex items-center mb-6">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-700 rounded focus:ring-blue-500 bg-gray-900"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-300 text-sm">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Create one
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800">
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-transparent text-white hover:bg-gray-800 transition-colors mb-3"
            onClick={() => {
              setEmail('google@example.com');
              setPassword('google123');
              setShowDemoNotice(true);
            }}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Continue with Google
          </button>
          
          <button
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-transparent text-white hover:bg-gray-800 transition-colors"
            onClick={() => {
              setEmail('linkedin@example.com');
              setPassword('linkedin123');
              setShowDemoNotice(true);
            }}
          >
            <svg className="h-5 w-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>
        </div>
        
        {/* Demo Account Instructions */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <h3 className="text-sm font-medium text-white mb-2">Demo Account Information:</h3>
          <div className="text-gray-400 text-xs space-y-2">
            <p>Email: <span className="text-blue-400 font-mono">{demoCredentials.email}</span></p>
            <p>Password: <span className="text-blue-400 font-mono">{demoCredentials.password}</span></p>
            <p className="italic">Use these credentials to access all features without registration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;