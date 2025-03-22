# Personal Portfolio Website built with React v16

[![Screenshot](/public/social-image.png?raw=true)](https://taniyow.vercel.app)

[![Website mctan.dev](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://mctan.dev)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/taniyow/taniyow-portfolio-react/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/taniyow/taniyow-portfolio-react/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

A clean and customizable ReactJS portfolio template for fellow developers. Credits to Jo Lienhoop!. View demo at [https://http://vercel.com//](https://taniyow.vercel.app)

-   built using [React](https://reactjs.org)
-   bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
-   styled with [Material-UI](https://material-ui.com)
-   deployed on vercel [Vercel](https://vercel.com)

Special thanks to [Jo Lienhoop](https://github.com/JoHoop), and [Cody Bennett](https://github.com/CodyJasonBennett) for the inspiration.

## Features

-   All of the personal information is populated from the resume.json file following the [JSON Resume](https://jsonresume.org) standard, a community driven open source initiative to create a JSON based standard for resumes. Discover the official schema [here](https://jsonresume.org/schema).
-   The toggle/switch for the dark mode syncs its state to the local storage.

#### Coming soon

-   Two beautiful resume page templates generated based on the data in the resume.json file -- a modern approach of the traditional printed CV.
-   Rich Google search results using structured data with [json-ld.org/](https://json-ld.org).

## Customization

Feel free to fork this project and customize it with your own information and style.

Refer to the [Material UI docs](https://material-ui.com/customization/theming) for guidance on how to quickly customize the themes, components and colors to suit your tastes.

If you improve the app in any way a pull request would be very much appreciated ✌️

## Available Scripts

In the project directory, you can run:

### `npm install`

to install the dependencies.

### `npm install-all`

Installs all dependencies for the root, frontend, and backend in one step:
1. Installs root-level dependencies.
2. Installs frontend dependencies by navigating to the `frontend` directory.
3. Installs backend dependencies by navigating to the `backend` directory.

### `npm run dev`

Runs both the frontend and backend servers concurrently:
- The frontend server runs on [http://localhost:3000](http://localhost:3000).
- The backend server runs on [http://localhost:5000](http://localhost:5000).

This is useful for development, as it allows you to work on both parts of the application simultaneously.

### `npm run frontend`

Starts only the frontend development server using Vite.  
The app will be available at [http://localhost:3000](http://localhost:3000).

### `npm run backend`

Starts only the backend server using Node.js.  
The backend API will be available at [http://localhost:5000](http://localhost:5000).

### `npm start`

to run the app in the development mode at [http://localhost:3000](http://localhost:3000)<br />

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the frontend for production to the `frontend/dist` folder.  
The build is optimized for performance and ready for deployment.

### `npm run deploy`

Deploys the frontend to GitHub Pages using the `gh-pages` package.

### `npm start`

Starts the backend server in production mode.  
This assumes the frontend build files have been copied to the backend directory (handled by the `postbuild` script).

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Inspirations 

Mark Christian Tan - https://github.com/taniyow
Bloggify - https://github.com/Bloggify/github-calendar
grubersjoe - https://github.com/grubersjoe/react-github-calendar
JoHoop  - https://github.com/JoHoop

## Setting up github contributions graph

- In the github-contributions-api, populate the .env file with your github PERSOANL ACCESS TOKEN

## Github contribution Logic

### GitHub Contribution Logic

The **GitHub Contributions** component works in conjunction with the **streakWorker.js** and the backend API (`index.js`) to fetch, process, and display GitHub contribution data. Here's how the entire flow works:

---

#### 1. **Fetching Data from the Backend API**
- The backend API (`index.js`) is responsible for querying GitHub's GraphQL API to retrieve contribution data for a specific user.
- When the frontend requests data (via `/api/github-contributions/:username`), the backend:
  1. Sends a GraphQL query to GitHub's API using the provided username.
  2. Processes the response to extract the total contributions and daily contributions for the past year.
  3. Returns a JSON object to the frontend with:
     - 

total

: Total contributions in the past year.
     - 

contributions

: An array of objects, each containing:
       - 

date

: The date of the contribution.
       - 

count

: The number of contributions on that date.

---

#### 2. **Receiving Data in the GitHubContributions Component**
- The **GitHubContributions.jsx** component fetches the data from the backend API using the 

fetchContributionData

 function.
- The component:
  1. Checks if the data is already cached in 

localStorage

 (to avoid unnecessary API calls).
  2. If not cached, it sends a request to the backend API and retrieves the JSON response.
  3. Stores the fetched data in the component's state (

contributionData

) and caches it for future use.

---

#### 3. **Processing Contribution Data**
- Once the data is received, the component processes it to calculate:
  1. **Total Contributions**: Directly retrieved from the backend response (

data.total

).
  2. **Current Streak**: The number of consecutive days with contributions, starting from the most recent day.
  3. **Longest Streak**: The longest consecutive streak of days with contributions in the past year.

- The streak calculations are performed using:
  1. **Web Worker (`streakWorker.js`)**: If the browser supports Web Workers, the contribution data is sent to the worker for processing. The worker:
     - Sorts the contributions by date.
     - Iterates through the data to calculate the current and longest streaks.
     - Sends the results back to the main thread.
  2. **Fallback Calculation**: If Web Workers are not supported, the component performs the same calculations directly in the main thread using the 

calculateStreaks

 function.

---

#### 4. **Displaying the Data**
- The processed data is displayed in the **GitHubContributions** component:
  1. **GitHub Calendar**: A visual representation of daily contributions using the `react-github-calendar` library.
  2. **Stats Boxes**: Three boxes showing:
     - Total contributions in the past year.
     - Longest streak (number of days and date range).
     - Current streak (number of days and date range).
  3. **Animations**: The stats and calendar are animated using Framer Motion for a smooth user experience.

---

#### 5. **Error Handling**
- If the API request fails or the data cannot be processed:
  1. An error message is displayed in the component.
  2. The user is given the option to retry fetching the data.

---

### Example Flow
1. The frontend sends a request to `/api/github-contributions/Lycan-Xx`.
2. The backend queries GitHub's API and returns:
   ```json
   {
     "total": 365,
     "contributions": [
       { "date": "2023-01-01", "count": 5 },
       { "date": "2023-01-02", "count": 3 },
       ...
     ]
   }
   ```
3. The frontend processes the data:
   - Total contributions: `365`
   - Current streak: 

10 days (Jan 1 - Jan 10)


   - Longest streak: 

50 days (Feb 1 - Mar 22)


4. The data is displayed in the GitHub Contributions section with animations and a calendar.

This logic ensures that the GitHub contribution data is fetched, processed, and displayed efficiently and interactively.



## Things i need to add 

configur and setup emailjs for mail delivery
A blog summary component that wll have my top 3 recent blogs (medium)

## Things to try

surge for the frontend and glitch for the backend
