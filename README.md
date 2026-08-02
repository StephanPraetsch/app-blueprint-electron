# App Blueprint

Desktop app blueprint 
* for building cross-platform desktop apps with Electron
* using TypeScript, Node.js 26, Yarn
* with a SQLite database
* with configuration via menu bar
* with a React front-end (TODO)
* Vite for multi language support (TODO)

## Requirements

- Node.js 26.x
- Yarn 1.22.x

## Start in development mode

```bash
nvm use
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install
yarn dev
```

## Releasing a New Version

```bash
yarn version --patch && git push --follow-tags
```

### Linux:

#### .AppImage

requires
```bash
sudo apt install libfuse2
```

```bash
chmod +x AppBlueprint-0.1.0.AppImage
./AppBlueprint-0.1.0.AppImage
```

#### .deb

```bash
sudo dpkg -i app-blueprint_0.1.0_amd64.deb 
sudo apt remove app-blueprint
```

### macOS: .dmg

```bash
xattr -dr com.apple.quarantine "/Applications/AppBlueprint.app"
open "/Applications/AppBlueprint.app
```

I don't have a mac developer account, so I can't notarize the app, so I cannot sign it. see https://github.com/electron/notarize

### Windows: .exe

execute the `.exe` installer
