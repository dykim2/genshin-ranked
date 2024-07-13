# Genshin Ranked

## Table of Contents:
- Installation And Running Locally
- Repository Standards

## Installation And Running Locally
Make sure your Node version is `v20.15.1`. 
```bash
node -v # v20.15.1
```

Clone the repository:
```
git clone git@github.com:dykim2/genshin-ranked.git
```
In `genshin-ranked/frontend` and `genshin-ranked/backend`:

```bash
# Install needed dependencies:
npm install

# Run locally:
npm run dev
```

Configure any necessary environment variables in `/config.json`

## Repository Standards

We use `Prettier` and `ESLint` to keep a consistent code style and reduce code smell.

When you `npm install` you'll have these packages installed locally. However, it is also helpful to set these tools up on your IDE as well. These following steps will be on the context of Visual Studio Code.

1. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions.
2. Go to settings in Visual Studio Code (`⌘ + ,` or `Ctrl + ,`).
3. Search for the `Format On Save` setting and enable it.
4. Search for the `Default Formatter` setting and set it to `Prettier - Code formatter`.
5. Search for the `Editor: Format On Save Mode` setting and adjust it however you like. It is recommended to keep the default, `file`.

Please ensure that before making a pull request, you eliminate all ESLint errors and ensure that your files are formatted correctly.
