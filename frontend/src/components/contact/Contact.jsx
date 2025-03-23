import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const Contact = () => {
	const form = useRef();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isHighPerformance, setIsHighPerformance] = useState(false);

	useEffect(() => {
		// Check device performance
		const checkPerformance = () => {
			const highEnd = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			setIsHighPerformance(highEnd);
		};
		checkPerformance();
	}, []);

	const sendEmail = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await emailjs.sendForm(
				"service_8bezxog",
				"template_jmsk313",
				form.current,
				"knwNTK4YU4K30HYMd"
			);

			Swal.fire({
				icon: "success",
				title: "Message Sent!",
				text: "I'll get back to you as soon as possible.",
				showConfirmButton: false,
				timer: 2000,
				background: "#1e293b",
				color: "#fff",
			});

			e.target.reset();
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Something went wrong. Please try again later.",
				background: "#1e293b",
				color: "#fff",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contact"
			style={{ fontFamily: "ChocoCooky" }}
			className="relative min-h-screen py-20 px-4 md:px-8"
		>
			<div className="max-w-7xl mx-auto">
				{/* Section Heading */}
				<div className="text-start mb-12">
					<h1
						className={`text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-900 bg-clip-text text-transparent mb-4 ${isHighPerformance ? 'slide-up' : ''}`}
					>
						Contact me
					</h1>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Information */}
					<div className={`glass-card p-8 text-left ${isHighPerformance ? 'slide-in-right delay-200' : ''}`}>
						<h2 className="text-2xl font-bold text-white mb-6">Let's Connect </h2>
						<p className="text-lg text-gray-300 mb-6">
							Reach out if you have a project idea, want to collaborate, or just say hello. I'm excited to hear your thoughts and explore how we might create something exceptional together.</p>
						<div className="space-y-4">
							<p className="flex items-center gap-2 text-lg text-gray-300">
								<span className="text-cyan-400">Email:</span>
								msbello514@gmail.com
							</p>
							<p className="flex items-center gap-2 text-lg text-gray-300">
								<span className="text-cyan-400">Location:</span>
								Adamawa, Nigeria
							</p>
						</div>
					</div>

					{/* Contact Form */}
					<div className={`glass-card p-8 ${isHighPerformance ? 'slide-in-left' : ''}`}>
						<form ref={form} onSubmit={sendEmail} className="space-y-6">
							<div>
								<input
									type="text"
									name="name"
									id="name"
									required
									className="w-full px-4 py-3 rounded-lg bg-dark-lighter/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-400 transition-colors text-lg"
									placeholder="Your name"
								/>
							</div>

							<div>
								<input
									type="email"
									name="email"
									id="email"
									required
									className="w-full px-4 py-3 rounded-lg bg-dark-lighter/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-400 transition-colors text-lg"
									placeholder="your.email@example.com"
								/>
							</div>

							<div>
								<textarea
									name="message"
									id="message"
									required
									rows="5"
									className="w-full px-4 py-3 rounded-lg bg-dark-lighter/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-400 transition-colors resize-none text-lg"
									placeholder="Your message..."
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className={`glass-button w-full flex items-center justify-center ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
							>
								{isSubmitting ? (
									<span className="flex items-center">
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Sending...
									</span>
								) : (
									"Send Message"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
