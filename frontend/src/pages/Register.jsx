import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => {
    setLocalError('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) navigate('/');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-sm font-bold">SB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-400 mt-1">Join Shopping Bhandar today</p>
          </div>

          {displayError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name',        name: 'name',     type: 'text',     placeholder: 'Your full name' },
              { label: 'Email',            name: 'email',    type: 'email',    placeholder: 'you@example.com' },
              { label: 'Password',         name: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', name: 'confirm',  type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-widest">
                  {label}
                </label>
                <input
                  type={type} name={name} required
                  value={form[name]} onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-medium hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
