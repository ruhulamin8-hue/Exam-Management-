# Barpeta Exam Management System - Windows EXE

The original HTA file is included unchanged in `app/`.

The Electron wrapper does not redesign or rewrite the embedded application. It extracts the embedded HTML from the original HTA and serves it at `http://localhost:8765/`, matching the original HTA launcher and preserving the localhost origin required by the existing Google Drive OAuth code.

Build with GitHub Actions using `.github/workflows/build-windows.yml`.
