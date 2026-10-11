import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { aiRoadmapOutputSchema } from '../schemas/planSchemas.js';
import { weeklyReviewOutputSchema } from '../schemas/reviewSchemas.js';

function getGenAI() {
  if (config.geminiApiKey) {
    return new GoogleGenerativeAI(config.geminiApiKey);
  }
  return null;
}

// ----------------------------------------------------
// Expansive Progressive Curriculum Catalog for Unique Tasks
// ----------------------------------------------------
const MERN_BEGINNER_CURRICULUM = [
  // Phase 1: Web & Programming Fundamentals (HTML, CSS, JS Logic, DOM)
  { category: 'Frontend (React & UI)', title: 'HTML5 Fundamentals, Semantic Tags & Page Structure', desc: 'Learn HTML document structure, tags, headings, lists, links, images, and semantic layout.', resource: { title: 'MDN HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' } },
  { category: 'Frontend (React & UI)', title: 'HTML Forms, Input Types & Accessibility Basics', desc: 'Build accessible forms with labels, text inputs, radio buttons, checkboxes, dropdowns, and submit buttons.', resource: { title: 'MDN HTML Forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' } },
  { category: 'Frontend (React & UI)', title: 'CSS Fundamentals: Colors, Typography & Box Model', desc: 'Master CSS selectors, colors, font styling, margin, border, padding, and box-sizing.', resource: { title: 'MDN CSS Box Model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' } },
  { category: 'Frontend (React & UI)', title: 'CSS Flexbox & Responsive Layouts', desc: 'Build flexible responsive layouts using flex-direction, justify-content, align-items, and media queries.', resource: { title: 'CSS Tricks Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Basics: Variables (let/const), Data Types & Console', desc: 'Write your first JavaScript scripts learning numbers, strings, booleans, null, undefined, and console logging.', resource: { title: 'JavaScript.info Variables', url: 'https://javascript.info/variables' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Operators, Comparisons & Conditional Logic', desc: 'Master arithmetic operators, comparison operators (=== vs ==), and if / else if / else statements.', resource: { title: 'JavaScript.info Conditionals', url: 'https://javascript.info/iff' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Functions: Parameters, Returns & Scope', desc: 'Create reusable functions, understand parameter passing, return values, and local vs global scope.', resource: { title: 'MDN Functions Guide', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Loops: for, while & Iteration Logic', desc: 'Practice repeat execution logic using for loops, while loops, break, and continue statements.', resource: { title: 'JavaScript.info Loops', url: 'https://javascript.info/while-for' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Arrays & Basic Operations', desc: 'Learn array creation, indexing, push, pop, shift, unshift, and length properties.', resource: { title: 'MDN Arrays Guide', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'JavaScript Objects & Key-Value Storage', desc: 'Build objects representing real-world entities, access properties with dot notation, and iterate over keys.', resource: { title: 'JavaScript.info Objects', url: 'https://javascript.info/object' } },
  { category: 'Frontend (React & UI)', title: 'DOM Manipulation 101: Selecting & Modifying Elements', desc: 'Use document.querySelector and document.getElementById to dynamically update text, HTML, and CSS classes.', resource: { title: 'MDN DOM Intro', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'DOM Events: Click Listeners & Form Submissions', desc: 'Attach event listeners (addEventListener) for click events, input changes, and prevent form reloads with preventDefault.', resource: { title: 'MDN Introduction to Events', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Browser Web Storage: LocalStorage & SessionStorage', desc: 'Save and retrieve user preferences and JSON data across page refreshes using localStorage.', resource: { title: 'MDN Web Storage API', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Beginner Milestone Project: Vanilla JS Interactive Application', desc: 'Combine HTML, CSS, and DOM JavaScript to build a fully working To-Do List or Interactive Quiz app.', resource: { title: 'Vanilla JS DOM Projects', url: 'https://javascript.info' } },

  // Phase 2: ES6+ Features & React UI Foundations
  { category: 'Frontend (React & UI)', title: 'Modern ES6+ Features: Template Literals & Arrow Functions', desc: 'Refactor functions to ES6 arrow syntax and template literal strings for clean code formatting.', resource: { title: 'JS.info Arrow Functions', url: 'https://javascript.info/arrow-functions-basics' } },
  { category: 'Frontend (React & UI)', title: 'ES6+ Array Methods: map, filter & find', desc: 'Transform data arrays using map and filter out items using functional boolean callbacks.', resource: { title: 'JavaScript.info Array Methods', url: 'https://javascript.info/array-methods' } },
  { category: 'Frontend (React & UI)', title: 'ES6+ Destructuring & Rest/Spread Operators', desc: 'Extract values cleanly using array/object destructuring and clone data using the spread (...) operator.', resource: { title: 'MDN Destructuring Assignment', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Asynchronous JavaScript: Callbacks, Promises & Fetch API', desc: 'Understand asynchronous execution, HTTP requests with fetch(), and handling JSON API responses.', resource: { title: 'MDN Fetching Data from Server', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Modern Async/Await Syntax & Error Handling', desc: 'Write clean asynchronous code using async/await and try...catch blocks for API call error resilience.', resource: { title: 'JavaScript.info Async Await', url: 'https://javascript.info/async-await' } },
  { category: 'Frontend (React & UI)', title: 'Tailwind CSS Utility Classes: Spacing, Flexbox & Styling', desc: 'Set up Tailwind CSS to style modern components quickly using utility class names.', resource: { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com' } },
  { category: 'Frontend (React & UI)', title: 'Modern Frontend Development: Node.js & React Overview', desc: 'Understand why we use Node.js runtime, npm package manager, and Vite for building React apps.', resource: { title: 'Vite React Guide', url: 'https://vitejs.dev' } },
  { category: 'Frontend (React & UI)', title: 'React Basics: JSX Syntax, Components & Props', desc: 'Build functional React components, return JSX, and pass customizable data props down to child elements.', resource: { title: 'React Docs: Your First Component', url: 'https://react.dev/learn/your-first-component' } },
  { category: 'Frontend (React & UI)', title: 'React State Management with useState', desc: 'Manage interactive component state using the useState hook to trigger UI re-renders on user actions.', resource: { title: 'React useState Reference', url: 'https://react.dev/reference/react/useState' } },
  { category: 'Frontend (React & UI)', title: 'React Form Handling & Controlled Inputs', desc: 'Bind input values to React state for real-time validation and form submission handling.', resource: { title: 'React Controlled Components', url: 'https://react.dev/learn/sharing-state-between-components' } },
  { category: 'Frontend (React & UI)', title: 'React Side Effects & Data Fetching with useEffect', desc: 'Fetch API data on component mount and handle cleanup functions using the useEffect hook.', resource: { title: 'React Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' } },
  { category: 'Frontend (React & UI)', title: 'Rendering Lists & Conditional Rendering in React', desc: 'Map over data arrays to render dynamic lists using unique keys and ternary conditional elements.', resource: { title: 'React Rendering Lists', url: 'https://react.dev/learn/rendering-lists' } },
  { category: 'Frontend (React & UI)', title: 'React Router v6: Multi-Page SPA Navigation', desc: 'Configure client-side routing with BrowserRouter, Routes, Route, and Link components.', resource: { title: 'React Router v6', url: 'https://reactrouter.com' } },
  { category: 'Frontend (React & UI)', title: 'React Beginner Project: Weather & Movie Search Dashboard', desc: 'Build a multi-page React SPA consuming external REST APIs with state, effects, and responsive UI.', resource: { title: 'React Beginner Projects', url: 'https://react.dev' } },

  // Phase 3: Backend Basics (Node.js, Express & MongoDB)
  { category: 'Backend (Node & Express)', title: 'Introduction to Node.js & Server-Side JavaScript', desc: 'Understand how Node.js runs JavaScript on the server, global objects, and core module imports.', resource: { title: 'Node.js Getting Started', url: 'https://nodejs.org' } },
  { category: 'Backend (Node & Express)', title: 'Node.js ES Modules & npm Package Management', desc: 'Initialize package.json, install third-party npm packages, and manage dependencies.', resource: { title: 'npm Documentation', url: 'https://docs.npmjs.com' } },
  { category: 'Backend (Node & Express)', title: 'Creating an Express.js Web Server & Basic Routes', desc: 'Set up an Express server listening on port 5000 and create simple GET route responses.', resource: { title: 'Express Hello World', url: 'https://expressjs.com' } },
  { category: 'Backend (Node & Express)', title: 'Express Middleware & Request Body Parsing', desc: 'Use express.json() middleware to read JSON payloads from HTTP requests.', resource: { title: 'Express Middleware Guide', url: 'https://expressjs.com/en/guide/using-middleware.html' } },
  { category: 'Backend (Node & Express)', title: 'RESTful API Architecture: GET, POST, PUT, DELETE', desc: 'Design clean REST endpoints handling CRUD resources with standard HTTP status codes.', resource: { title: 'REST API Tutorial', url: 'https://restfulapi.net' } },
  { category: 'Database (MongoDB)', title: 'Introduction to MongoDB & NoSQL Document Databases', desc: 'Understand collections, JSON-like BSON documents, and basic database setup.', resource: { title: 'MongoDB University Basics', url: 'https://www.mongodb.com/docs/' } },
  { category: 'Database (MongoDB)', title: 'Connecting Express to MongoDB using Mongoose ODM', desc: 'Establish mongoose.connect database connection and handle connection events.', resource: { title: 'Mongoose Quick Start', url: 'https://mongoosejs.com' } },
  { category: 'Database (MongoDB)', title: 'Creating Mongoose Schemas & Data Models', desc: 'Define schemas with field types (String, Number, Boolean, Date), required constraints, and defaults.', resource: { title: 'Mongoose Schemas', url: 'https://mongoosejs.com/docs/schemas.html' } },
  { category: 'Database (MongoDB)', title: 'Mongoose CRUD Operations: Create & Read Documents', desc: 'Save documents with Model.create() and query data with find() and findById().', resource: { title: 'Mongoose Queries', url: 'https://mongoosejs.com/docs/queries.html' } },
  { category: 'Database (MongoDB)', title: 'Mongoose CRUD Operations: Update & Delete Documents', desc: 'Modify existing documents with findOneAndUpdate() and remove data with findByIdAndDelete().', resource: { title: 'Mongoose CRUD', url: 'https://mongoosejs' } },
  { category: 'Backend (Node & Express)', title: 'Express Centralized Error Handling & Status Codes', desc: 'Create global error middleware catching bad requests, 404 resource missing, and 500 server failures.', resource: { title: 'Express Error Handling', url: 'https://expressjs.com' } },
  { category: 'Backend (Node & Express)', title: 'User Password Hashing with bcryptjs', desc: 'Secure passwords using bcrypt.hash and bcrypt.compare before persisting to database.', resource: { title: 'OWASP Password Hashing', url: 'https://cheatsheetseries.owasp.org' } },
  { category: 'Backend (Node & Express)', title: 'JSON Web Token (JWT) Authentication Basics', desc: 'Sign JWT tokens upon login and create auth middleware to verify token authorization.', resource: { title: 'JWT Introduction', url: 'https://jwt.io' } },
  { category: 'Backend (Node & Express)', title: 'Backend Milestone Project: RESTful Tasks API with Auth', desc: 'Build a complete Express + MongoDB REST microservice with user registration, login, and task CRUD.', resource: { title: 'Node REST API Project', url: 'https://expressjs.com' } },

  // Phase 4: Full-Stack Integration & Internship Readiness
  { category: 'Full-Stack Integration', title: 'Connecting React UI to Express Backend with Axios', desc: 'Configure Axios instance with baseURL to send HTTP requests from React components to Express backend.', resource: { title: 'Axios Docs', url: 'https://axios-http.com' } },
  { category: 'Full-Stack Integration', title: 'Managing API Loading, Success & Error Feedback in UI', desc: 'Display loading spinners, error alerts, and success messages during async HTTP requests.', resource: { title: 'React UI Feedback Patterns', url: 'https://react.dev' } },
  { category: 'Full-Stack Integration', title: 'Full-Stack Auth Flow: Login & Signup Forms to Backend', desc: 'Connect React Auth forms to backend login/signup endpoints and save user session tokens.', resource: { title: 'Full Stack MERN Auth', url: 'https://react.dev' } },
  { category: 'Full-Stack Integration', title: 'Global Auth Context: Protecting Private Routes', desc: 'Use React Context API to manage logged-in user state and restrict access to protected pages.', resource: { title: 'React Context API', url: 'https://react.dev' } },
  { category: 'Full-Stack Integration', title: 'Full-Stack CRUD Integration: React UI + MongoDB Database', desc: 'Synchronize React state with MongoDB database records for real-time item creation and deletion.', resource: { title: 'MERN Stack Tutorial', url: 'https://developer.mozilla.org' } },
  { category: 'DSA & System Design', title: 'Introduction to Problem Solving: Thinking in Code & Pseudocode', desc: 'Deconstruct coding problems step-by-step using pseudocode and dry-running logic on paper.', resource: { title: 'FreeCodeCamp Problem Solving', url: 'https://www.freecodecamp.org' } },
  { category: 'DSA & System Design', title: 'Basic DSA: String Manipulation & Palindrome Problems', desc: 'Solve fundamental string reversal, character frequency counting, and palindrome check problems.', resource: { title: 'LeetCode Easy Strings', url: 'https://leetcode.com' } },
  { category: 'DSA & System Design', title: 'Basic DSA: Array Search, Two-Sum & Max Subarray', desc: 'Solve classic beginner array problems using loops and simple hash map lookups.', resource: { title: 'NeetCode Arrays', url: 'https://neetcode.io' } },
  { category: 'Full-Stack Integration', title: 'Git & GitHub Basics: Repository Version Control', desc: 'Learn git init, add, commit, branch, push, and create GitHub repositories for portfolio projects.', resource: { title: 'GitHub Handbook', url: 'https://guides.github.com' } },
  { category: 'Full-Stack Integration', title: 'Deploying MERN App: Vercel Frontend & Render Backend', desc: 'Deploy React SPA to Vercel and Express server with MongoDB Atlas connection string to Render.', resource: { title: 'Vercel & Render Deployment', url: 'https://vercel.com/docs' } },
  { category: 'Full-Stack Integration', title: 'Capstone MERN Project: Internship-Ready Portfolio App Part 1', desc: 'Plan database schemas, API routes, and wireframe layout for your capstone MERN application.', resource: { title: 'MERN Capstone Architecture', url: 'https://react.dev' } },
  { category: 'Full-Stack Integration', title: 'Capstone MERN Project: Internship-Ready Portfolio App Part 2', desc: 'Implement full-stack features, authentication, dark mode UI, and error boundaries.', resource: { title: 'MERN Capstone UI', url: 'https://tailwindcss.com' } },
  { category: 'Full-Stack Integration', title: 'Capstone MERN Project: Final Polish, Testing & Deployment', desc: 'Test end-to-end user workflows, clean up console logs, deploy to production, and add GitHub README.', resource: { title: 'Portfolio Best Practices', url: 'https://github.com' } },
  { category: 'DSA & System Design', title: 'Internship Resume & GitHub Portfolio Optimization', desc: 'Craft clean resume bullet points, host live project links, and showcase your GitHub contribution heatmap.', resource: { title: 'Developer Resume Guide', url: 'https://www.techinterviewhandbook.org' } }
];

const MERN_CURRICULUM = [
  { category: 'Frontend (React & UI)', title: 'JavaScript ES6+ Fundamentals & Destructuring', desc: 'Master const/let, arrow functions, destructuring, rest/spread operators, and template literals with code exercises.', resource: { title: 'JS.info ES6+ Core', url: 'https://javascript.info' } },
  { category: 'Frontend (React & UI)', title: 'Promises, Async/Await & Event Loop', desc: 'Understand single-threaded execution, microtasks, event loop phases, and async promise handling.', resource: { title: 'MDN Asynchronous JS', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Array Higher-Order Functions (map, filter, reduce)', desc: 'Practice functional data transformations using map, filter, reduce, find, and flatMap.', resource: { title: 'JavaScript Array Methods', url: 'https://javascript.info/array-methods' } },
  { category: 'Frontend (React & UI)', title: 'DOM Manipulation & Web API Storage', desc: 'Build interactive scripts consuming localStorage, sessionStorage, and IndexedDB for offline state.', resource: { title: 'MDN Web Storage API', url: 'https://developer.mozilla.org' } },
  { category: 'Frontend (React & UI)', title: 'Modern React Setup & JSX Component Hierarchy', desc: 'Set up Vite + React project, understand JSX compilation, virtual DOM, and component composition.', resource: { title: 'React Official Docs', url: 'https://react.dev' } },
  { category: 'Frontend (React & UI)', title: 'React State Management with useState & Forms', desc: 'Build controlled form components, manage complex nested state, and handle input events.', resource: { title: 'React useState Guide', url: 'https://react.dev/reference/react/useState' } },
  { category: 'Frontend (React & UI)', title: 'Component Lifecycle & Side Effects with useEffect', desc: 'Handle side-effects, cleanup functions, API fetching, and avoid infinite effect loops.', resource: { title: 'Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' } },
  { category: 'Frontend (React & UI)', title: 'Performance Tuning with useMemo, useCallback & React.memo', desc: 'Optimize heavy re-renders, memoize expensive calculations, and optimize child props.', resource: { title: 'React Performance Guide', url: 'https://react.dev' } },
  { category: 'Frontend (React & UI)', title: 'Custom React Hooks & Reusable Utility Logic', desc: 'Extract custom hooks for window resize, debounced values, API queries, and local storage state.', resource: { title: 'Reusing Logic with Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' } },
  { category: 'Frontend (React & UI)', title: 'Tailwind CSS Layouts, Flexbox, Grid & Responsive UI', desc: 'Master mobile-first responsive design, flexbox alignment, CSS grid, and dark mode configuration.', resource: { title: 'Tailwind CSS Documentation', url: 'https://tailwindcss.com' } },
  { category: 'Frontend (React & UI)', title: 'Context API & Global State Architecture', desc: 'Implement global theme and authentication context providers without prop drilling.', resource: { title: 'React Context API', url: 'https://react.dev/learn/passing-data-deeply-with-context' } },
  { category: 'Frontend (React & UI)', title: 'React Router v6 Dynamic Routing & Protected Routes', desc: 'Configure BrowserRouter, Nested Routes, URL Params, Navigate redirects, and Auth Guards.', resource: { title: 'React Router v6 Docs', url: 'https://reactrouter.com' } },
  { category: 'Frontend (React & UI)', title: 'Form Validation with React Hook Form & Zod Schemas', desc: 'Build accessible forms with strict type validation, custom error messages, and submission handlers.', resource: { title: 'React Hook Form + Zod', url: 'https://react-hook-form.com' } },
  { category: 'Frontend (React & UI)', title: 'Mid-Phase Project: Responsive UI Component Library', desc: 'Build an interactive dashboard component library featuring modals, drawers, tabs, and toast alerts.', resource: { title: 'UI Component Architecture', url: 'https://tailwindcss.com' } },
  { category: 'Backend (Node & Express)', title: 'Node.js Architecture, Event Emitter & Streams', desc: 'Understand V8 engine, non-blocking I/O, Event Emitter class, readable/writable streams, and buffer operations.', resource: { title: 'Node.js Official Documentation', url: 'https://nodejs.org' } },
  { category: 'Backend (Node & Express)', title: 'Express Server Setup, Middleware Pipelines & Helmet', desc: 'Set up Express app with json body parsers, URL encoding, CORS, and Helmet security headers.', resource: { title: 'Express Security Best Practices', url: 'https://expressjs.com' } },
  { category: 'Backend (Node & Express)', title: 'Designing RESTful API Endpoints & Controller Patterns', desc: 'Implement standard HTTP methods (GET, POST, PATCH, DELETE), status codes, and modular controllers.', resource: { title: 'REST API Design Guidelines', url: 'https://restfulapi.net' } },
  { category: 'Database (MongoDB)', title: 'MongoDB Schema Design: Embedding vs Referencing', desc: 'Compare normalized relational schemas vs denormalized document models and 1-to-N relationships.', resource: { title: 'MongoDB Data Modeling Guide', url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/' } },
  { category: 'Database (MongoDB)', title: 'Mongoose CRUD Operations, Schemas & Validators', desc: 'Create Mongoose models with strict type validation, custom field validators, and default timestamps.', resource: { title: 'Mongoose JS Documentation', url: 'https://mongoosejs.com' } },
  { category: 'Database (MongoDB)', title: 'MongoDB Indexing Strategies & Query Optimization', desc: 'Build compound indexes, unique constraints, explain query execution plans, and optimize read speeds.', resource: { title: 'MongoDB Indexing Guide', url: 'https://www.mongodb.com/docs/manual/indexes/' } },
  { category: 'Backend (Node & Express)', title: 'JWT Authentication Architecture & HTTP-Only Cookies', desc: 'Implement JSON Web Token signing, verification middleware, and secure httpOnly cookie storage.', resource: { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org' } },
  { category: 'Backend (Node & Express)', title: 'Password Hashing with bcrypt & Salt Rounds', desc: 'Hash user passwords with bcryptjs, handle salt rounds, and prevent timing attacks.', resource: { title: 'OWASP Password Storage', url: 'https://cheatsheetseries.owasp.org' } },
  { category: 'Backend (Node & Express)', title: 'Centralized Error Middleware & Custom HTTP Errors', desc: 'Create global error handling middleware catching Zod, CastError, duplicate keys, and 500 errors.', resource: { title: 'Express Error Handling', url: 'https://expressjs.com/en/guide/error-handling.html' } },
  { category: 'Backend (Node & Express)', title: 'Rate Limiting & Request Throttling Middleware', desc: 'Implement express-rate-limit to protect auth and API endpoints against brute force attacks.', resource: { title: 'Express Rate Limit', url: 'https://github.com/express-rate-limit' } },
  { category: 'Database (MongoDB)', title: 'MongoDB Aggregation Pipelines: $match, $group, $sort', desc: 'Build analytical aggregation pipelines calculating totals, averages, and group distributions.', resource: { title: 'MongoDB Aggregations', url: 'https://www.mongodb.com/docs/manual/aggregation/' } },
  { category: 'Database (MongoDB)', title: 'Advanced Aggregations: $lookup Relational Joins & $unwind', desc: 'Perform multi-collection relational joins with $lookup and unwind nested document arrays.', resource: { title: 'MongoDB $lookup Stage', url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/' } },
  { category: 'Backend (Node & Express)', title: 'File Uploads with Express, Multer & Cloud Storage', desc: 'Handle multipart/form-data requests, validate file types, size limits, and save to storage.', resource: { title: 'Multer Express Middleware', url: 'https://github.com/expressjs/multer' } },
  { category: 'Backend (Node & Express)', title: 'Mid-Phase Project: Build Auth & User Management Microservice', desc: 'Create an independent authentication REST microservice with user registration, login, profile updates, and role guards.', resource: { title: 'Node Microservice Patterns', url: 'https://microservices.io' } },
  { category: 'Full-Stack Integration', title: 'Connecting React to Backend with Axios Interceptors', desc: 'Configure global Axios client with base URL, credentials, request headers, and error interceptors.', resource: { title: 'Axios API Documentation', url: 'https://axios-http.com' } },
  { category: 'Full-Stack Integration', title: 'TanStack Query (React Query): Fetching & Cache Sync', desc: 'Implement useQuery hooks for background refetching, stale time management, and cache key strategies.', resource: { title: 'TanStack Query Overview', url: 'https://tanstack.com/query' } },
  { category: 'Full-Stack Integration', title: 'Optimistic UI Mutations & Cache Updating Patterns', desc: 'Implement useMutation with onMutate optimistic updates, rollback handlers, and query invalidation.', resource: { title: 'TanStack Query Mutations', url: 'https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates' } },
  { category: 'Full-Stack Integration', title: 'Toast Notification Systems & Micro-Interactions', desc: 'Build accessible, animated toast notifications providing real-time feedback on user actions.', resource: { title: 'UI Feedback Patterns', url: 'https://react.dev' } },
  { category: 'Full-Stack Integration', title: 'Error Boundaries & Graceful Fallback UIs', desc: 'Implement React Error Boundaries to catch component render errors without crashing the application.', resource: { title: 'React Error Boundaries', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' } },
  { category: 'Full-Stack Integration', title: 'Environment Config & Multi-Stage Envs', desc: 'Configure dotenv for backend and import.meta.env for Vite frontend across dev and prod.', resource: { title: 'Vite Env Variables', url: 'https://vitejs.dev/guide/env-and-mode.html' } },
  { category: 'Full-Stack Integration', title: 'Full-Stack CRUD Integration: Synchronizing Local & Remote State', desc: 'Build a full-stack feature connecting form inputs to backend REST endpoints with live state updates.', resource: { title: 'Full Stack MERN Guide', url: 'https://developer.mozilla.org' } },
  { category: 'Full-Stack Integration', title: 'Unit Testing React Components with Vitest & Testing Library', desc: 'Write component tests verifying user interactions, state changes, and mock API calls.', resource: { title: 'React Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/' } },
  { category: 'Full-Stack Integration', title: 'Backend Integration Testing with Supertest', desc: 'Write integration tests asserting Express route status codes, response headers, and database state.', resource: { title: 'Supertest Express Testing', url: 'https://github.com/ladjs/supertest' } },
  { category: 'Full-Stack Integration', title: 'Web Security Hardening: XSS, CSRF & Input Sanitization', desc: 'Sanitize user inputs against HTML injection, configure SameSite cookie policies, and prevent CSRF.', resource: { title: 'OWASP Top 10 Web Risks', url: 'https://owasp.org/www-project-top-ten/' } },
  { category: 'Full-Stack Integration', title: 'Containerizing MERN Application with Docker', desc: 'Write multi-stage Dockerfiles for client and server and orchestrate containers with Docker Compose.', resource: { title: 'Docker Compose Guide', url: 'https://docs.docker.com/compose/' } },
  { category: 'Full-Stack Integration', title: 'Automated CI/CD Workflows with GitHub Actions', desc: 'Build GitHub Actions workflow executing linting, unit tests, and production builds on push.', resource: { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' } },
  { category: 'Full-Stack Integration', title: 'Production Deployment: Vercel & Cloud Hosting', desc: 'Deploy React SPA to Vercel and Express API with MongoDB connection string to cloud provider.', resource: { title: 'Vercel Deployment Guide', url: 'https://vercel.com/docs' } },
  { category: 'Full-Stack Integration', title: 'Production Monitoring, Logging & Health Checks', desc: 'Set up health check routes, structured JSON logging, and error tracking tools.', resource: { title: 'Express Production Best Practices', url: 'https://expressjs.com' } },
  { category: 'DSA & System Design', title: 'Big O Notation: Time & Space Complexity Analysis', desc: 'Analyze algorithm efficiency, loop iterations, recursion depth, and space trade-offs.', resource: { title: 'Big O Cheat Sheet', url: 'https://www.bigocheatsheet.com' } },
  { category: 'DSA & System Design', title: 'DSA Arrays & Hashing: Two-Sum, Group Anagrams & Top K', desc: 'Solve LeetCode 1, 49, and 347 using HashMaps for O(N) lookup efficiency.', resource: { title: 'NeetCode Arrays & Hashing', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Two-Pointers: Valid Palindrome & Container With Most Water', desc: 'Solve LeetCode 125, 167, and 11 optimizing array scanning from opposite ends.', resource: { title: 'NeetCode Two Pointers', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Sliding Window: Best Time to Buy Stock & Longest Substring', desc: 'Solve LeetCode 121 and 3 using dynamic window boundaries for contiguous subarray problems.', resource: { title: 'NeetCode Sliding Window', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Stack & Queue: Valid Parentheses & Min Stack', desc: 'Solve LeetCode 20, 155, and 739 leveraging LIFO stack structures.', resource: { title: 'NeetCode Stack', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Binary Search: Search in Rotated Sorted Array', desc: 'Solve LeetCode 704, 33, and 153 dividing search space in O(log N) time.', resource: { title: 'NeetCode Binary Search', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Linked List: Reverse Linked List & Merge Two Sorted Lists', desc: 'Solve LeetCode 206, 21, and 141 manipulating node pointers and dummy heads.', resource: { title: 'NeetCode Linked List', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Binary Trees: Max Depth, Invert Tree & Lowest Common Ancestor', desc: 'Solve LeetCode 226, 104, and 235 using recursive tree traversals.', resource: { title: 'NeetCode Binary Tree', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Tree BFS & DFS: Binary Tree Level Order Traversal & Validate BST', desc: 'Solve LeetCode 102 and 98 using Queue BFS and Range-checked DFS.', resource: { title: 'LeetCode Tree Patterns', url: 'https://leetcode.com' } },
  { category: 'DSA & System Design', title: 'DSA Graphs: Number of Islands & Max Area of Island', desc: 'Solve LeetCode 200 and 695 using 2D grid matrix DFS/BFS traversals.', resource: { title: 'NeetCode Graphs', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'DSA Graph Algorithms: Course Schedule & Topological Sort', desc: 'Solve LeetCode 207 detecting directed graph cycles using Kahn\'s BFS algorithm.', resource: { title: 'Graph Topological Sort', url: 'https://leetcode.com' } },
  { category: 'DSA & System Design', title: 'DSA 1D Dynamic Programming: Climbing Stairs & House Robber', desc: 'Solve LeetCode 70 and 198 comparing top-down memoization vs bottom-up tabulation.', resource: { title: 'NeetCode 1-D DP', url: 'https://neetcode.io' } },
  { category: 'DSA & System Design', title: 'System Design 101: Client-Server, Load Balancing & Horizontal Scaling', desc: 'Design scalable web architectures using round-robin load balancers and stateless app servers.', resource: { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' } },
  { category: 'DSA & System Design', title: 'System Design 102: Caching Architecture with Redis', desc: 'Implement Cache-Aside, Write-Through patterns, LRU eviction, and Redis memory management.', resource: { title: 'Redis Caching Patterns', url: 'https://redis.io/docs/manual/client-side-caching/' } },
  { category: 'DSA & System Design', title: 'System Design 103: Database Sharding & Replication', desc: 'Master Master-Slave replication, database partitioning, ACID vs BASE, and CAP Theorem.', resource: { title: 'Database Scalability Guide', url: 'https://github.com/donnemartin/system-design-primer' } },
  { category: 'DSA & System Design', title: 'Placement Behavioral Prep: STAR Method Answers', desc: 'Prepare structured Situation-Task-Action-Result stories for technical leadership interviews.', resource: { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org' } },
  { category: 'DSA & System Design', title: 'Technical Mock Interview: End-to-End System Architecture Assessment', desc: 'Conduct a timed mock interview whiteboarding full-stack architecture and live coding.', resource: { title: 'Mock Technical Interview', url: 'https://www.pramp.com' } },
  { category: 'DSA & System Design', title: 'Portfolio & Resume Optimization for Placements', desc: 'Polish GitHub repositories, format STAR bullet points, and highlight live deployed links.', resource: { title: 'Engineering Resume Guide', url: 'https://www.techinterviewhandbook.org' } }
];

export class AIService {
  /**
   * AI Career Guidance Counselor - Consultation before choosing path
   */
  static async getCareerGuidance({ background = '', currentSkills = '', interests = '', targetType = 'job' }) {
    const genAIInstance = getGenAI();

    if (!config.geminiApiKey || !genAIInstance) {
      console.log('🤖 Using Fallback Engine for AI Career Guidance Consultation');
      return this.generateDeterministicCareerGuidance({ background, currentSkills, interests, targetType });
    }

    try {
      console.log('✨ Invoking Gemini API for AI Career Guidance...');
      const model = genAIInstance.getGenerativeModel({ model: 'gemini-3.8-flash' });

      const prompt = `You are a senior tech career advisor and placement strategist.
Analyze the following student profile:
- Educational / Experience Background: "${background || 'Student preparing for tech roles'}"
- Current Skills & Knowledge: "${currentSkills || 'Basic programming fundamentals'}"
- Interests & Passions: "${interests || 'Building web applications and solving problems'}"
- Target Placement Type: "${targetType}"

Provide personalized career advice, skill gap analysis, and 3 recommended career paths.
You MUST respond strictly with valid raw JSON adhering to this schema:
{
  "counselorAdvice": "string (3-4 inspiring, personalized sentences advising them on their best career strategy)",
  "skillGapAnalysis": [
    "string (point 1 on skill gaps to address)",
    "string (point 2)",
    "string (point 3)"
  ],
  "recommendedPaths": [
    {
      "roleId": "string (e.g., MERN Full Stack, Data Analyst, Java Backend, Python & AI Engineer, DevOps & Cloud)",
      "title": "string (Descriptive Role Title)",
      "fitScore": number (80 to 98),
      "reasoning": "string (1-2 sentences explaining why this path matches their background)",
      "estimatedWeeks": number (4, 8, 12, or 16),
      "keyFocusCategories": ["string"]
    }
  ]
}

Respond ONLY with raw JSON without markdown formatting.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');

      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini Career Guidance API error:', err.message);
      return this.generateDeterministicCareerGuidance({ background, currentSkills, interests, targetType });
    }
  }

  static generateDeterministicCareerGuidance({ background, currentSkills, interests, targetType }) {
    const combined = `${background} ${currentSkills} ${interests}`.toLowerCase();
    
    let primaryPath = {
      roleId: 'MERN Full Stack',
      title: 'MERN Full Stack Engineer',
      fitScore: 95,
      reasoning: 'High industry demand, versatile JavaScript ecosystem, and fast portfolio turnaround.',
      estimatedWeeks: 8,
      keyFocusCategories: ['Frontend (React & UI)', 'Backend (Node & Express)', 'Database (MongoDB)', 'DSA & System Design']
    };

    if (combined.includes('data') || combined.includes('python') || combined.includes('ai') || combined.includes('analyst')) {
      primaryPath = {
        roleId: 'Data Analyst',
        title: 'Data Analyst & ML Practitioner',
        fitScore: 96,
        reasoning: 'Strong fit for data-driven analytical problem solving, SQL, and predictive modeling.',
        estimatedWeeks: 8,
        keyFocusCategories: ['SQL & Database Querying', 'Python & Data Wrangling', 'Data Visualization & BI', 'Applied Statistics & ML']
      };
    }

    return {
      counselorAdvice: `Based on your profile in ${background || 'software engineering'}, you have strong potential to land a high-paying ${targetType === 'internship' ? 'internship' : 'placement'} role. Focus on mastering full-stack architectural fundamentals and building 2 production-ready portfolio projects.`,
      skillGapAnalysis: [
        'Bridge theory with hands-on RESTful API integration and database indexing.',
        'Build consistency in solving 3-4 targeted algorithmic problems weekly.',
        'Develop confidence in explaining system design tradeoffs during technical interviews.'
      ],
      recommendedPaths: [
        primaryPath,
        {
          roleId: 'MERN Full Stack',
          title: 'Full Stack Web Developer',
          fitScore: 90,
          reasoning: 'Excellent market flexibility with rapid hiring across startups and tech firms.',
          estimatedWeeks: 8,
          keyFocusCategories: ['React UI', 'Node Microservices', 'REST APIs']
        },
        {
          roleId: 'Java Backend',
          title: 'Java Enterprise Backend Developer',
          fitScore: 88,
          reasoning: 'Ideal for enterprise software companies, Spring Boot architecture, and high scalability.',
          estimatedWeeks: 12,
          keyFocusCategories: ['Java Core', 'Spring Boot', 'SQL Databases']
        }
      ]
    };
  }

  /**
   * Generates structured roadmap either via Gemini API or Deterministic Engine with 100% unique daily tasks
   */
  static async generateRoadmap(params) {
    const { field, level, hoursPerDay, targetType, totalWeeks = 8 } = params;
    const totalDays = totalWeeks * 7;
    const genAIInstance = getGenAI();

    if (!config.geminiApiKey || !genAIInstance) {
      console.log(`🤖 Using Unique Curriculum Engine for field: "${field}" (${totalDays} days)`);
      return this.generateDeterministicMockRoadmap(params);
    }

    try {
      console.log(`✨ Calling Google Gemini API for field: "${field}" (${totalDays} days)...`);
      const model = genAIInstance.getGenerativeModel({ model: 'gemini-3.8-flash' });

      let levelGuidance = '';
      if (level === 'beginner') {
        levelGuidance = `
SPECIAL BEGINNER LEVEL INSTRUCTIONS:
- The student is a COMPLETE BEGINNER with zero prior JavaScript or web programming knowledge.
- DO NOT start with advanced ES6+, promises, React state, or Node architecture on Day 1.
- Phase 1 MUST start with web & programming basics: HTML5, CSS layout (Flexbox), JS variables (let/const), primitive data types, control flow (if/else), functions, loops, and basic DOM manipulation.
- Pace the learning gradually: HTML/CSS/Vanilla JS first -> React UI basics next -> Node/Express/MongoDB next -> Full-stack integration & basic problem solving last.`;
      } else if (level === 'intermediate') {
        levelGuidance = `
SPECIAL INTERMEDIATE LEVEL INSTRUCTIONS:
- Focus on ES6+, React state management (useState, useEffect, custom hooks), Tailwind CSS, Express REST API architecture, Mongoose schemas/indexing, JWT auth, TanStack Query, and placement DSA patterns.`;
      } else {
        levelGuidance = `
SPECIAL ADVANCED LEVEL INSTRUCTIONS:
- Focus on scalable full-stack architecture, microservices, Docker, Redis caching, MongoDB aggregation pipelines, CI/CD, system design fundamentals, and advanced LeetCode tree/graph/DP patterns.`;
      }

      const prompt = `You are a world-class senior engineering mentor and placement strategist.
Generate a structured preparation roadmap for a student targeting:
- Field / Domain: "${field}"
- Experience Level: "${level}"
- Target Type: "${targetType}"
- Daily Availability: ${hoursPerDay} hours per day
- Total Duration: ${totalWeeks} weeks (${totalDays} total days)

CRITICAL INSTRUCTIONS:
${levelGuidance}
1. Every single day from dayNumber 1 to dayNumber ${totalDays} MUST have a completely UNIQUE title, UNIQUE detailed description, and distinct progressive learning topic.
2. Do NOT repeat titles or generic descriptions across days. Every day must represent a distinct step forward in the curriculum.
3. Daily total estMinutes must roughly match ${hoursPerDay * 60} minutes.

You MUST respond strictly with valid JSON conforming to this schema:
{
  "title": "string (Compelling, inspiring roadmap title)",
  "aiSummary": "string (2-3 sentences overview of the learning journey)",
  "weightage": [
    { "category": "string", "percentage": number (sum of percentages must equal 100), "reasoning": "string" }
  ],
  "phases": [
    {
      "phaseNumber": number (1, 2, 3...),
      "name": "string",
      "description": "string",
      "startDay": number,
      "endDay": number,
      "goals": ["string"]
    }
  ],
  "dailyTasks": [
    {
      "dayNumber": number (1 to ${totalDays}),
      "phaseNumber": number,
      "category": "string (must match one of weightage categories)",
      "title": "string (Actionable, specific title)",
      "description": "string (Clear instructions for the task)",
      "estMinutes": number (estimated minutes, between 30 and ${hoursPerDay * 60}),
      "resourceLinks": [
        { "title": "string", "url": "string (valid URL)", "type": "documentation|article|video|practice|github|other" }
      ]
    }
  ]
}

Return ONLY the raw JSON object, without markdown triple backticks.`;

      let attempts = 0;
      let rawText = '';
      while (attempts < 2) {
        attempts++;
        const result = await model.generateContent(prompt);
        rawText = result.response.text();
        let cleaned = rawText.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');

        try {
          const parsed = JSON.parse(cleaned);
          const validated = aiRoadmapOutputSchema.parse(parsed);
          return validated;
        } catch (parseError) {
          console.warn(`Gemini parse/validation failed (Attempt ${attempts}): ${parseError.message}`);
          if (attempts >= 2) break;
        }
      }

      console.warn('Falling back to unique curriculum generator due to Gemini API response schema variation.');
      return this.generateDeterministicMockRoadmap(params);
    } catch (err) {
      console.error(`Gemini API error: ${err.message}. Falling back to unique curriculum generator.`);
      return this.generateDeterministicMockRoadmap(params);
    }
  }

  static generateDeterministicMockRoadmap(params) {
    const { field = 'Full Stack Developer', level = 'intermediate', hoursPerDay = 3, targetType = 'job', totalWeeks = 8 } = params;
    const totalDays = totalWeeks * 7;

    const phasesCount = totalWeeks <= 4 ? 2 : totalWeeks <= 8 ? 4 : 5;
    const daysPerPhase = Math.floor(totalDays / phasesCount);

    const weightage = level === 'beginner' ? [
      { category: 'Frontend (React & UI)', percentage: 45, reasoning: 'Foundational HTML, CSS, JavaScript programming, DOM manipulation, and React UI.' },
      { category: 'Backend (Node & Express)', percentage: 30, reasoning: 'Core Node.js, Express server setup, RESTful APIs, and basic authentication.' },
      { category: 'Database (MongoDB)', percentage: 15, reasoning: 'MongoDB setup, Mongoose schemas, and basic database CRUD operations.' },
      { category: 'DSA & System Design', percentage: 10, reasoning: 'Basic problem-solving logic, string/array operations, and Git portfolio setup.' }
    ] : [
      { category: 'Frontend (React & UI)', percentage: 35, reasoning: 'Critical for crafting modern responsive web apps and mastering state management.' },
      { category: 'Backend (Node & Express)', percentage: 30, reasoning: 'Core RESTful API design, middleware patterns, and authentication architectures.' },
      { category: 'Database (MongoDB)', percentage: 15, reasoning: 'Schema modeling, indexing, aggregations, and query optimization.' },
      { category: 'DSA & System Design', percentage: 20, reasoning: 'Vital for technical interviews, time complexity analysis, and scalable architecture.' }
    ];

    const allPhases = level === 'beginner' ? [
      { phaseNumber: 1, name: 'Phase 1: Web & JavaScript Programming Foundations', description: 'HTML5, CSS layout, JavaScript logic (variables, loops, functions), and DOM manipulation.', startDay: 1, endDay: Math.min(14, daysPerPhase), goals: ['Master HTML5 & CSS Flexbox', 'Write JS loops and functions', 'Build interactive Vanilla JS DOM apps'] },
      { phaseNumber: 2, name: 'Phase 2: Modern ES6+ & React UI Foundations', description: 'ES6+ syntax, React JSX, components, useState, useEffect, and API fetching.', startDay: Math.min(14, daysPerPhase) + 1, endDay: Math.min(28, daysPerPhase * 2), goals: ['Master ES6+ arrow functions & destructuring', 'Build React component state', 'Fetch API data in React'] },
      { phaseNumber: 3, name: 'Phase 3: Backend Basics with Node.js, Express & MongoDB', description: 'Node.js, Express REST APIs, Mongoose schemas, MongoDB CRUD, and JWT authentication.', startDay: Math.min(28, daysPerPhase * 2) + 1, endDay: Math.min(45, daysPerPhase * 3), goals: ['Create Express REST servers', 'Connect MongoDB with Mongoose', 'Implement password hashing & JWT auth'] },
      { phaseNumber: 4, name: 'Phase 4: Full-Stack MERN Integration & Internship Readiness', description: 'Connect React to Express, full-stack CRUD, basic problem solving, Git, Vercel/Render deployment, and resume polish.', startDay: Math.min(45, daysPerPhase * 3) + 1, endDay: totalDays, goals: ['Connect React frontend to Express backend', 'Solve easy string/array DSA problems', 'Deploy capstone project & build resume'] }
    ] : [
      { phaseNumber: 1, name: 'Phase 1: Modern JavaScript Mastery & Frontend Foundations', description: 'ES6+, React fundamentals, state management, Tailwind CSS, and component architecture.', startDay: 1, endDay: Math.min(14, daysPerPhase), goals: ['Master ES6+ Async/Await', 'Build reusable React component libraries', 'Integrate Tailwind CSS'] },
      { phaseNumber: 2, name: 'Phase 2: Scalable Backend & MongoDB Data Modeling', description: 'Express REST APIs, JWT authentication in httpOnly cookies, Mongoose schemas, and indexing.', startDay: Math.min(14, daysPerPhase) + 1, endDay: Math.min(28, daysPerPhase * 2), goals: ['Build robust Express REST APIs', 'Secure JWT authentication', 'Implement Mongoose aggregations'] },
      { phaseNumber: 3, name: 'Phase 3: Full-Stack Integration & Production Deployment', description: 'Connect React with backend APIs via TanStack Query, Dockerization, and cloud deployment.', startDay: Math.min(28, daysPerPhase * 2) + 1, endDay: Math.min(45, daysPerPhase * 3), goals: ['State synchronization with TanStack Query', 'Implement optimistic mutations', 'Deploy project to cloud'] },
      { phaseNumber: 4, name: 'Phase 4: Placement DSA Patterns & Mock Interviews', description: 'Placement-focused DSA (Arrays, Strings, Trees, Graphs, DP) and System Design fundamentals.', startDay: Math.min(45, daysPerPhase * 3) + 1, endDay: totalDays, goals: ['Solve 75+ targeted LeetCode questions', 'Master Two-Pointer & Graph BFS/DFS', 'Conduct mock technical interviews'] }
    ];

    const generatedPhases = allPhases.slice(0, phasesCount);
    generatedPhases[generatedPhases.length - 1].endDay = totalDays;

    const dailyTasks = [];
    const pool = level === 'beginner' ? MERN_BEGINNER_CURRICULUM : MERN_CURRICULUM;

    for (let day = 1; day <= totalDays; day++) {
      const phase = generatedPhases.find((p) => day >= p.startDay && day <= p.endDay) || generatedPhases[0];
      const item = pool[(day - 1) % pool.length];
      const cycleCount = Math.floor((day - 1) / pool.length);
      const cycleTag = cycleCount > 0 ? ` (Advanced Module ${cycleCount + 1})` : '';

      const taskMinutes = Math.min(hoursPerDay * 60, Math.max(45, 60 + ((day * 7) % 60)));

      dailyTasks.push({
        dayNumber: day,
        phaseNumber: phase.phaseNumber,
        category: item.category,
        title: `Day ${day}: ${item.title}${cycleTag}`,
        description: `${item.desc}${cycleTag ? ` Deep dive iteration ${cycleCount + 1}.` : ''} (Targeting ${field} ${level} level). Focus on hands-on code delivery and documenting core takeaways.`,
        estMinutes: taskMinutes,
        resourceLinks: [
          {
            title: item.resource.title,
            url: item.resource.url,
            type: 'article'
          }
        ]
      });
    }

    return {
      title: `${field} ${targetType === 'internship' ? 'Internship' : 'Placement & Career'} Mastery Roadmap`,
      aiSummary: `Tailored ${totalWeeks}-week preparation path designed specifically for ${level} level developers aiming for ${targetType} roles in ${field}.`,
      weightage,
      phases: generatedPhases,
      dailyTasks
    };
  }

  /**
   * Generates intelligent weekly review insights based on user activity logs
   */
  static async generateWeeklyReview({ completedTasks, totalMinutes, activeDays, completionRate, role = 'Software Engineer' }) {
    const genAIInstance = getGenAI();
    if (!config.geminiApiKey || !genAIInstance) {
      return this.generateDeterministicWeeklyReview({ completedTasks, totalMinutes, activeDays, completionRate, role });
    }

    try {
      const model = genAIInstance.getGenerativeModel({ model: 'gemini-3.8-flash' });
      const prompt = `You are an elite career mentor analyzing a student's past 7 days of preparation for ${role}.
Stats:
- Completed tasks: ${completedTasks}
- Active days this week: ${activeDays} / 7
- Total hours logged: ${(totalMinutes / 60).toFixed(1)} hours
- Weekly completion rate: ${completionRate}%

Generate a constructive, motivating weekly review in strict JSON format conforming to this schema:
{
  "period": "Last 7 Days",
  "summary": "string (engaging 2-sentence summary of performance)",
  "completionRate": ${completionRate},
  "hoursLogged": ${(totalMinutes / 60).toFixed(1)},
  "wins": ["string (2-3 highlights or achievements)"],
  "gapAnalysis": [
    { "area": "string", "observation": "string", "severity": "low|medium|high" }
  ],
  "recommendations": [
    { "title": "string", "action": "string", "priority": "urgent|important|bonus" }
  ],
  "quote": "string (inspiring quote)"
}

Respond ONLY with raw JSON without markdown.`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');

      const parsed = JSON.parse(text);
      return weeklyReviewOutputSchema.parse(parsed);
    } catch (err) {
      console.warn('Falling back to deterministic weekly review:', err.message);
      return this.generateDeterministicWeeklyReview({ completedTasks, totalMinutes, activeDays, completionRate, role });
    }
  }

  static generateDeterministicWeeklyReview({ completedTasks, totalMinutes, activeDays, completionRate, role }) {
    const hours = (totalMinutes / 60).toFixed(1);
    const isHighPerformer = completionRate >= 75;

    return {
      period: 'Past 7 Days',
      summary: isHighPerformer
        ? `Outstanding momentum! You completed ${completedTasks} tasks across ${activeDays} active days, clocking in ${hours} hours of dedicated practice for ${role}.`
        : `Steady progress this week with ${completedTasks} tasks completed and ${hours} hours invested. Let's refine consistency in the upcoming sprint.`,
      completionRate: Math.round(completionRate),
      hoursLogged: parseFloat(hours),
      wins: [
        `Maintained an active streak of ${activeDays} days this week`,
        `Logged over ${hours} focused learning hours`,
        `Consistently completed core milestones in ${role} preparation`
      ],
      gapAnalysis: [
        {
          area: 'Deep Work Consistency',
          observation: activeDays >= 5 ? 'Excellent daily cadence maintained throughout the week.' : 'Target at least 5 active study days to avoid knowledge decay.',
          severity: activeDays >= 5 ? 'low' : 'medium'
        },
        {
          area: 'Speed & Problem Solving Retention',
          observation: 'Ensure you review previously solved problem patterns before starting new concepts.',
          severity: 'low'
        }
      ],
      recommendations: [
        {
          title: 'Morning Momentum Block',
          action: 'Complete your primary technical task within the first 2 hours of your study block.',
          priority: 'important'
        },
        {
          title: 'Active Recall Session',
          action: 'Spend 15 minutes at the end of each day documenting 3 key insights in your notes.',
          priority: 'bonus'
        }
      ],
      quote: 'Consistency is not about perfection; it is about refusing to let zero-days become a habit.'
    };
  }
}
