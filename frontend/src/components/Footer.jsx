import { Link } from 'react-router-dom';

const LINKS = {
  Shop:    [{ label: 'All Products', to: '/products' }, { label: 'New Arrivals', to: '/products?keyword=new' }, { label: 'Featured', to: '/products?featured=true' }],
  Account: [{ label: 'Login',    to: '/login' }, { label: 'Register', to: '/register' }, { label: 'My Orders', to: '/orders' }],
  Support: [{ label: 'Contact Us', to: '#' }, { label: 'FAQ',        to: '#' }, { label: 'Returns',    to: '#' }],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">SB</span>
              </div>
              <span className="font-semibold text-base">Shopping Bhandar</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium products delivered to your door. Quality you can trust.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-300 hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Shopping Bhandar. All rights reserved.</p>
          <p className="text-xs text-gray-500">Payments secured by Razorpay 🔒</p>
        </div>
      </div>
    </footer>
  );
}
