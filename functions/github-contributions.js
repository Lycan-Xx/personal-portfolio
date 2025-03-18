import { Router } from 'itty-router';

// Create a router instance
const router = Router();

// Your GraphQL query and helper function rewritten to use the global fetch
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

router.get('/api/github-contributions/:username', async request => {
	const { username } = request.params;
	// Ensure your secret is available (see Step 4)
	const GITHUB_TOKEN = SECRET_GITHUB_TOKEN;
	if (!GITHUB_TOKEN) {
		return new Response('GitHub token not set', { status: 500 });
	}

	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${GITHUB_TOKEN.trim()}`
			},
			body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: username } })
		});
		if (!response.ok) {
			const errorText = await response.text();
			return new Response(
				`GitHub API error: ${response.status} ${errorText}`,
				{ status: response.status }
			);
		}
		const data = await response.json();

		if (!data.data?.user) {
			return new Response(JSON.stringify({
				error: 'User not found',
				message: `GitHub user ${username} not found`
			}), { status: 404, headers: { 'Content-Type': 'application/json' } });
		}

		// Process the weeks into a flat contributions array.
		const calendar = data.data.user.contributionsCollection.contributionCalendar;
		let contributions = [];
		calendar.weeks.forEach(week => {
			week.contributionDays.forEach(day => {
				contributions.push({ date: day.date, count: day.contributionCount });
			});
		});

		const responseData = {
			total: calendar.totalContributions,
			contributions,
		};

		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }







		});
	} catch (error) {
		return new Response(JSON.stringify({
			error: 'Internal server error',
			message: error.message
		}), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
});

// Catch-all for unmatched routes.
router.all('*', () => new Response('Not Found', { status: 404 }));

addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request));
});