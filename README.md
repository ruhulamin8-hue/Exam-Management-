# Barpeta Exam Management System - Windows EXE

This repository packages the supplied HTA application as a Windows desktop application.

## Important

The original HTA file is included unchanged in `app/`.

The wrapper does not redesign or rewrite the application's interface or application code.

## Build locally

1. Install Node.js LTS.
2. Open Command Prompt in this folder.
3. Run:

```text
npm install
npm run build
```

The Windows installer will be created in the `dist` folder.

## Build with GitHub

Push the repository to GitHub. The workflow in `.github/workflows/build-windows.yml` automatically builds the Windows installer.

You can also start it manually from:

GitHub → Actions → Build Windows EXE → Run workflow

The generated `.exe` is available under the workflow run's Artifacts.
