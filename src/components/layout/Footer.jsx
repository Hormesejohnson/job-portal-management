const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Hormese JobPortal</h3>
        <p className="mt-3 text-sm text-slate-400">Connect talent to opportunity with a smarter recruitment experience.</p>
      </div>
      <div>
        <h4 className="font-semibold text-white">Company</h4>
        <ul className="mt-3 space-y-2 text-sm">
          <li>About</li>
          <li>Jobs</li>
          <li>Categories</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Contact</h4>
        <ul className="mt-3 space-y-2 text-sm">
          <li>user@jobportal.com</li>
          <li>8078041997</li>
          <li>Remote friendly</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white">Follow</h4>
        <div className="mt-3 flex gap-3 text-sm text-slate-300">
          <span>LinkedIn</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-400">© 2026 Hormese JobPortal. All rights reserved.</div>
  </footer>
)

export default Footer
