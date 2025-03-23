import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Add this import
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Add CORS middleware
app.use(cors());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Helper function to query GitHub GraphQL API
const queryGitHub = async (query, variables = {}) => {
	try {
		if (!process.env.GITHUB_TOKEN) {
			throw new Error('GitHub token not found in environment variables');
		}

		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.GITHUB_TOKEN.trim()}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`GitHub API responded with status ${response.status}: ${errorText}`);
		}

		const data = await response.json();

		if (data.errors) {
			throw new Error(data.errors[0].message);
		}

		return data;
	} catch (error) {
		console.error('Error fetching GitHub data:', error.message);
		throw error;
	}
};

// GraphQL query to get contribution data
const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

// API endpoint: /api/github-contributions/:username
app.get('/api/github-contributions/:username', async (req, res) => {
	const { username } = req.params;

	try {
		const data = await queryGitHub(CONTRIBUTIONS_QUERY, { login: username });

		if (!data.data?.user) {
			return res.status(404).json({
				error: 'User not found',
				message: `GitHub user ${username} not found`
			});
		}

		const calendar = data.data.user.contributionsCollection.contributionCalendar;
		let contributions = [];

		calendar.weeks.forEach((week) => {
			week.contributionDays.forEach((day) => {
				contributions.push({
					date: day.date,
					count: day.contributionCount,
				});
			});
		});

		const responseData = {
			total: calendar.totalContributions,
			contributions,
		};

		res.json(responseData);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
});

// Handle SPA routing - return index.html for all routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
