import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You do not have permission to view this page. If you believe this is an error,
          please contact an administrator or sign in with an account that has the required access.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            Home
          </Link>
          <Link to="/dashboard" className="px-4 py-2 rounded border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
