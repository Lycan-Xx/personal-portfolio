import React, { useState } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaTelegram, FaDiscord, FaClipboard, FaExternalLinkAlt } from 'react-icons/fa';

const profiles = [
  { network: "LinkedIn", username: "mohammad-bello", url: "https://www.linkedin.com/in/mohammad-bello/", icon: FaLinkedin },
  { network: "GitHub", username: "Lycan-Xx", url: "https://github.com/Lycan-Xx", icon: FaGithub },
  { network: "Twitter", username: "LycanXx2", url: "https://x.com/LycanXx2", icon: FaTwitter },
  { network: "Telegram", username: "lycan_xx1", url: "https://t.me/lycan_xx1", icon: FaTelegram },
  { network: "Discord", username: "lycan_xx0", url: "https://discord.com/users/lycan_xx0", icon: FaDiscord },
];

export default function SocialLinks({ className = '' }) {
  const [copied, setCopied] = useState(null);

  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async (url, network) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(network);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // fallback: show a small UI change if clipboard fails (rare)
      setCopied('err');
      setTimeout(() => setCopied(null), 1400);
    }
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
              className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <Icon className="text-[var(--color-primary)] w-5 h-5" />
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
                  <FaExternalLinkAlt className="w-4 h-4 text-gray-200" />
                </button>

                <button
                  aria-label={`Copy ${p.network} link`}
                  onClick={() => handleCopy(p.url, p.network)}
                  className="p-2 rounded-md hover:bg-white/5 transition"
                >
                  <FaClipboard className="w-4 h-4 text-gray-200" />
                </button>
              </div>

              {/* simple inline feedback shown to the right when copied */}
              {copied === p.network && (
                <div className="ml-3 text-xs text-green-400 font-mono">Copied</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
