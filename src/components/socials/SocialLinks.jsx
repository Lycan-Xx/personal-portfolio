import React, { useState } from 'react';
import { Icons } from '../../utils/iconMap';

const profiles = [
  { network: "LinkedIn", username: "mohammad-bello", url: "https://www.linkedin.com/in/mohammad-bello/", icon: Icons.linkedin },
  { network: "GitHub", username: "Lycan-Xx", url: "https://github.com/Lycan-Xx", icon: Icons.github },
  { network: "X (formerly twitter)", username: "LycanXx0", url: "https://x.com/LycanXx0", icon: Icons.twitter },
  { network: "Discord", username: "lycan_xx0", url: "https://discord.com/users/lycan_xx0", icon: Icons.discord },
];


export default function SocialLinks({ className = '' }) {
  const [copied, setCopied] = useState(null);

  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`contact-socials ${className}`}>
      <h4 className="text-cyan-400 font-bold mb-3">Socials</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {profiles.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.network}
              className="flex items-center justify-between bg-gray-900/50 border border-secondary rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-[var(--color-primary)]" />
                <div>
                  <div className="text-sm font-mono text-white">{p.network}</div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-300 hover:underline"
                  >
                    {p.username}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label={`Open ${p.network}`}
                  onClick={() => handleOpen(p.url)}
                  className="p-2 rounded-md hover:bg-white/5 transition"
                >
                  <Icons.external size={16} className="text-gray-200" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
