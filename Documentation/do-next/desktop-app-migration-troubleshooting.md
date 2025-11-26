# Desktop App Migration Troubleshooting Guide

## Common Issues & Solutions

### 1. Electron App Won't Start
- Check Node.js and Electron versions
- Ensure all dependencies are installed
- Review error logs for missing files or modules

### 2. Native Dialogs Not Working
- Ensure Electron APIs are used correctly
- Check platform-specific limitations

### 3. Filesystem Access Errors
- Verify app permissions
- Use Electron's `fs` module for file operations

### 4. Git/GitHub Integration Issues
- Ensure `git` is installed and available in PATH
- Check GitHub authentication and permissions

### 5. Packaging/Distribution Problems
- Use recommended packaging tools (electron-builder, electron-forge)
- Test installer on all target platforms

## Additional Resources
- Electron Documentation: https://www.electronjs.org/docs
- Electron IPC Guide: https://www.electronjs.org/docs/latest/tutorial/ipc
- Electron Security: https://www.electronjs.org/docs/latest/tutorial/security
