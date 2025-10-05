import React from 'react'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const links = {
    product: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'API Documentation', href: '#' },
      { name: 'Data Sources', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    resources: [
      { name: 'Help Center', href: '#' },
      { name: 'Research Papers', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Methodology', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Data Use Policy', href: '#' },
      { name: 'Open Source', href: '#' },
    ],
    connect: [
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Contact', href: '#', icon: Mail },
    ],
  }

  return (
    <footer className="bg-deep-space/50 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-black gradient-text mb-4">SKYPHORIA</h3>
            <p className="text-white/60 mb-4 max-w-sm">
              From EarthData to Action. Democratizing air quality information through cutting-edge technology and open science.
            </p>
            <p className="text-sm text-white/40">
              Built for NASA Space Apps Challenge 2025
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-bright-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-bright-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-bright-cyan transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners */}
        <div className="py-8 border-t border-white/10 mb-8">
          <p className="text-center text-white/40 text-sm mb-4">Powered by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-white/60 text-sm font-semibold">NASA TEMPO</div>
            <div className="text-white/60 text-sm font-semibold">OpenAQ</div>
            <div className="text-white/60 text-sm font-semibold">EPA AirNow</div>
            <div className="text-white/60 text-sm font-semibold">Pandora Network</div>
            <div className="text-white/60 text-sm font-semibold">NOAA</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>© 2025 Skyphoria. Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for clean air</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {links.connect.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/60 hover:text-bright-cyan transition-colors"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer