const productLinks = [
  'Features',
  'Pricing',
  'API Docs',
  'Changelog',
  'Integrations',
];

const resourceLinks = ['Blog', 'Help Center', 'Community', 'Webinars', 'Case Studies'];

const companyLinks = ['About', 'Careers', 'Legal', 'Contact', 'Press Kit'];

const compareLinks = ['vs SEMrush', 'vs Moz', 'vs Ahrefs', 'vs Screaming Frog'];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0d1318', padding: '80px 0 40px' }}>
      <div className="container mx-auto px-4">
        {/* Top area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
          {/* Brand column */}
          <div>
            <a href="#" className="flex items-center gap-0 text-white text-xl">
              <span className="font-bold">OUT</span>
              <span className="font-normal">Audits</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a4c6] ml-0.5 mt-1"></span>
            </a>
            <p
              className="mt-4"
              style={{
                fontSize: 14,
                lineHeight: '22px',
                color: '#44576a',
              }}
            >
              White-label SEO audit platform built for agencies. Generate
              reports in 30 seconds.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {['X', 'in', 'GH', 'YT'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:border-[#00a4c6] group"
                  style={{
                    border: '1px solid #374c63',
                  }}
                >
                  <span
                    className="text-xs font-medium transition-opacity duration-200 group-hover:opacity-100"
                    style={{ color: '#ffffff', opacity: 0.6 }}
                  >
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4
              className="text-white font-semibold mb-4"
              style={{ fontSize: 14, lineHeight: '20px' }}
            >
              Product
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors duration-200 hover:text-[#00a4c6]"
                    style={{
                      fontSize: 14,
                      lineHeight: '36px',
                      color: '#44576a',
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="text-white font-semibold mb-4"
              style={{ fontSize: 14, lineHeight: '20px' }}
            >
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors duration-200 hover:text-[#00a4c6]"
                    style={{
                      fontSize: 14,
                      lineHeight: '36px',
                      color: '#44576a',
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-white font-semibold mb-4"
              style={{ fontSize: 14, lineHeight: '20px' }}
            >
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors duration-200 hover:text-[#00a4c6]"
                    style={{
                      fontSize: 14,
                      lineHeight: '36px',
                      color: '#44576a',
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compare */}
          <div>
            <h4
              className="text-white font-semibold mb-4"
              style={{ fontSize: 14, lineHeight: '20px' }}
            >
              Compare
            </h4>
            <ul className="space-y-2">
              {compareLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors duration-200 hover:text-[#00a4c6]"
                    style={{
                      fontSize: 14,
                      lineHeight: '36px',
                      color: '#44576a',
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-16 max-md:my-10"
          style={{ height: 1, backgroundColor: '#374c63' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontSize: 12, color: '#44576a' }}>
            2025 OUTAudits. All rights reserved.
          </p>
          <div className="flex items-center gap-3" style={{ fontSize: 12, color: '#44576a' }}>
            <a href="#" className="hover:text-[#00a4c6] transition-colors">
              Privacy Policy
            </a>
            <span className="opacity-50">&middot;</span>
            <a href="#" className="hover:text-[#00a4c6] transition-colors">
              Terms of Service
            </a>
            <span className="opacity-50">&middot;</span>
            <a href="#" className="hover:text-[#00a4c6] transition-colors">
              Cookie Policy
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#44576a' }}>
            Made with <span className="text-[#00a4c6]">&#9829;</span> for agencies
            worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
