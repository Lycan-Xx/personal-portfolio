import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // Add this import
import { Router } from 'itty-router';

const app = express();
const PORT = process.env.PORT || 5000;
const router = Router();

// Add CORS middleware
app.use(cors());

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
router.get('/api/github-contributions/:username', async ({ params }) => {
	const { username } = params;
	const GITHUB_TOKEN = SECRET_GITHUB_TOKEN;

	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`,
			variables: { login: username },
		}),
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), { status: 200 });
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
	async fetch(request) {
		return router.handle(request);
	},
};

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
