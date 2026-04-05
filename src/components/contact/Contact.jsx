import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

/* ─── Social links data ─────────────────────────────────── */
// Replace SocialLinks component dump with explicit pill rows
const socials = [
  { platform: 'GitHub',   handle: 'Lycan-Xx',        href: 'https://github.com/Lycan-Xx',                   icon: '⌥' },
  { platform: 'LinkedIn', handle: 'mohammad-bello',  href: 'https://linkedin.com/in/mohammad-bello',         icon: '⌘' },
  { platform: 'Twitter',  handle: 'LycanXx2',        href: 'https://twitter.com/LycanXx2',                  icon: '✦' },
  { platform: 'Discord',  handle: 'lycan_xx0',       href: 'https://discord.com/users/lycan_xx0',            icon: '◈' },
  { platform: 'Medium',   handle: '@lycan-xx',       href: 'https://medium.com/@lycan-xx',                  icon: '◉' },
  { platform: 'Dev.to',   handle: 'lycan_xx',        href: 'https://dev.to/lycan_xx',                       icon: '◎' },
];

/* ─── Shared motion variants ────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/* ─── Inline form field ─────────────────────────────────── */
const Field = ({ label, name, type = 'text', rows, required }) => (
  <div className="flex flex-col gap-1">
    <label
      htmlFor={name}
      className="text-[10px] uppercase tracking-widest text-cyan-400/60"
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      {label}
    </label>
    {rows ? (
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        className="bg-black/30 border border-cyan-400/15 rounded-xl px-4 py-3
                   text-sm text-slate-200 placeholder-slate-600
                   focus:outline-none focus:border-cyan-400/50 focus:bg-black/40
                   transition-all duration-200 resize-none"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
        placeholder={`// ${label.toLowerCase()}`}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="bg-black/30 border border-cyan-400/15 rounded-xl px-4 py-3
                   text-sm text-slate-200 placeholder-slate-600
                   focus:outline-none focus:border-cyan-400/50 focus:bg-black/40
                   transition-all duration-200"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
        placeholder={`// ${label.toLowerCase()}`}
      />
    )}
  </div>
);

/* ─── Main component ────────────────────────────────────── */
export const Contact = () => {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied]             = useState(false);

  const [refSection, inViewSection] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [refCards,   inViewCards]   = useInView({ triggerOnce: true, threshold: 0.08 });

  /* Email send */
  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        'service_8bezxog',
        'template_jmsk313',
        formRef.current,
        'knwNTK4YU4K30HYMd'
      );
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: "I'll get back to you soon.",
        showConfirmButton: false,
        timer: 2000,
        background: '#1e293b',
        color: '#fff',
      });
      formRef.current.reset();
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Try again later.',
        background: '#1e293b',
        color: '#fff',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Copy email */
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('msbello514@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section
      ref={refSection}
      id="contact"
      className="relative min-h-screen py-16 sm:py-20 px-0 md:px-4 z-20"
    >
      <div className="w-full max-w-[86rem] mx-auto relative">
        {/* Glass container */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-none md:rounded-3xl shadow-lg shadow-cyan-400/5" />
        <div className="absolute inset-0 bg-black/50 rounded-none md:rounded-3xl" />

        <div className="relative p-6 md:p-10 z-10">

          {/* ── Header ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inViewSection ? 'visible' : 'hidden'}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-12"
          >
            <h2
              className="text-white relative inline-block pb-2
                         after:content-[''] after:absolute after:bottom-0 after:left-0
                         after:w-2/3 after:h-[2px] after:bg-cyan-400"
              style={{ fontFamily: 'ChocoCooky', fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              {'< Contact Me />'}
            </h2>
            <p
              className="mt-3 text-slate-400 text-xs"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {`// open to: collaborations, contracts, interesting problems`}
            </p>
          </motion.div>

          {/* ── Two-column grid: asymmetric ── */}
          <div
            ref={refCards}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >

            {/* ── Left: contact info + form (3 cols) ── */}
            <motion.div
              variants={cardVariant}
              initial="hidden"
              animate={inViewCards ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-3 bg-black/20 backdrop-blur-md rounded-2xl
                         border border-white/8 hover:border-cyan-400/35
                         transition-colors duration-300 overflow-hidden"
            >
              {/* Terminal header strip */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-400/10 bg-black/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span
                  className="ml-3 text-[10px] text-slate-500"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  sani@lycan-xx ~ contact.sh
                </span>
              </div>

              <div className="p-6">
                {/* Info row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6
                               border-b border-cyan-400/10">
                  <div className="flex-1 space-y-2">
                    {/* Email with copy */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] text-cyan-400/60 uppercase tracking-widest"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        email
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        className="text-xs text-slate-300 hover:text-cyan-400
                                   transition-colors duration-200 cursor-pointer"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        msbello514@gmail.com
                      </button>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: copied ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] text-cyan-400"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        ✓ copied
                      </motion.span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] text-cyan-400/60 uppercase tracking-widest"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        location
                      </span>
                      <span
                        className="text-xs text-slate-300"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        Adamawa, Nigeria
                      </span>
                    </div>
                  </div>

                  {/* Availability badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                                  bg-green-400/8 border border-green-400/20 self-start sm:self-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span
                      className="text-[10px] text-green-400"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      open to work
                    </span>
                  </div>
                </div>

                {/* Contact form */}
                <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name"    name="user_name"    required />
                    <Field label="Email"   name="user_email"   type="email" required />
                  </div>
                  <Field label="Subject" name="subject" />
                  <Field label="Message" name="message" rows={5} required />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2
                               px-6 py-3 rounded-xl
                               bg-cyan-400/10 hover:bg-cyan-400/20
                               border border-cyan-400/30 hover:border-cyan-400/60
                               text-cyan-400 transition-all duration-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               active:scale-95"
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-cyan-400/40
                                         border-t-cyan-400 rounded-full animate-spin" />
                        sending...
                      </>
                    ) : (
                      <>
                        <span>▸</span>
                        send_message()
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* ── Right: social links (2 cols) ── */}
            <motion.div
              variants={cardVariant}
              initial="hidden"
              animate={inViewCards ? 'visible' : 'hidden'}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:col-span-2 bg-black/20 backdrop-blur-md rounded-2xl
                         border border-white/8 hover:border-cyan-400/35
                         transition-colors duration-300 overflow-hidden"
            >
              {/* Terminal header strip */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-400/10 bg-black/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span
                  className="ml-3 text-[10px] text-slate-500"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  sani@lycan-xx ~ socials.conf
                </span>
              </div>

              <div className="p-6">
                <p
                  className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-5"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  // find me online
                </p>

                <div className="space-y-2">
                  {socials.map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 16 }}
                      animate={inViewCards ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl
                                 bg-black/20 border border-transparent
                                 hover:border-cyan-400/25 hover:bg-cyan-400/5
                                 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-cyan-400/40 group-hover:text-cyan-400
                                     transition-colors text-sm"
                        >
                          {s.icon}
                        </span>
                        <span
                          className="text-xs text-slate-300 group-hover:text-white
                                     transition-colors"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {s.platform}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] text-slate-600 group-hover:text-slate-400
                                     transition-colors"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {s.handle}
                        </span>
                        <span
                          className="text-slate-600 group-hover:text-cyan-400
                                     transition-colors text-xs"
                        >
                          ↗
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Bottom note */}
                <p
                  className="mt-6 text-[10px] text-slate-600 leading-relaxed"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {`/* I don't like being the centre of attention.\n   I just love learning, growing,\n   and sharing what I know. */`}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};