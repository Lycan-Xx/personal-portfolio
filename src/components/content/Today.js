import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { format } from "date-fns";
import "./Today.css"; // Import the CSS styling

export const Today = () => {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [displayedGreeting, setDisplayedGreeting] = useState("");
	const [displayedTimeOfDay, setDisplayedTimeOfDay] = useState("");

	// Update the current time every second
	useEffect(() => {
		const timerId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timerId);
	}, []);

	// Typewriter effect for the greeting with a 10-second replay
	useEffect(() => {
		const animateGreeting = () => {
			const now = new Date();
			const hour = now.getHours();
			let timeOfDay = "";
			if (hour < 4) timeOfDay = "Nocturnal Protocols";
			else if (hour < 12) timeOfDay = "AM Bitstream";
			else if (hour < 18) timeOfDay = "Midday Matrix";
			else if (hour < 22) timeOfDay = "Evening Algorithm";
			else timeOfDay = "Nocturnal Protocols";

			// Nerdy welcome message including time-of-day context
			const fullGreeting = `Greetings, digital traveler!`;
			setDisplayedGreeting(""); // Reset the greeting
			setDisplayedTimeOfDay(""); // Reset the time of day
			let index = 0;
			const intervalId = setInterval(() => {
				if (index < fullGreeting.length) {
					setDisplayedGreeting((prev) => prev + fullGreeting.charAt(index));
				} else if (index < fullGreeting.length + timeOfDay.length) {
					setDisplayedTimeOfDay((prev) => prev + timeOfDay.charAt(index - fullGreeting.length));
				}
				index++;
				if (index >= fullGreeting.length + timeOfDay.length) {
					clearInterval(intervalId);
				}
			}, 100); // 100ms per character
		};

		animateGreeting(); // Run on mount

		// Replay the animation every 10 seconds
		const greetingInterval = setInterval(() => {
			animateGreeting();
		}, 10000);

		return () => clearInterval(greetingInterval);
	}, []);

	// Format the time as a 24-hour clock with seconds
	const formattedTime = format(currentTime, "HH:mm:ss");
	// Format the date in a more detailed format
	const formattedDate = format(currentTime, "EEEE, MMMM do, yyyy");

	return (
		<Card className="card" elevation={3}>
			<CardContent className="card-content">
				<Typography variant="h4" className="greeting">
					{displayedGreeting}
				</Typography>
				<Typography variant="h5" className="time-of-day">
					{displayedTimeOfDay}
				</Typography>
				<Typography variant="h3" className="time">
					{formattedTime}
				</Typography>
				<Typography variant="body1" className="date">
					{formattedDate}
				</Typography>
			</CardContent>
		</Card>
	);
};
