# Front-end

The front-end for TUPIT!

## Setup instructions

The following are some basic “getting started” instrucitons! Don't worry if you don’t know how to do
some of these things - we can walk you through it!

1. Prerequisite: install Node.js >= 16 (a great way to do this is with `nvm`; see Tyler, Jackson, or Luke for help!)
2. Open a terminal in the `frontend` folder
3. Run `npm ci` to install all packages and dependencies
4. Install the recommended VSCode extensions, Prettier and ESLint
5. Run `npm run dev` to start developing!

## Features

Some cool features of our development environemnt:

- CSS modules: these keep your styles scoped to a single component to make sure the styles you write
  for one component don't affect other components. See the homepage (`pages/index.jsx`) for an
  example of how to use this.
- Absolute imports: import JavaScript files using `import X from components/...` (or the same for
  any folder that's directly inside the `src` folder)
- Prettier: files are automatically formatted with a consistent style when you save them and when
-           you commit them.
- Eslint: like spell check for your code! Automatically puts scary-looking underlines under your
-         mistakes.
