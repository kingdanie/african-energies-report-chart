# Building and Compiling the AER Charts Plugin

This guide explains how to build and compile the plugin for deployment on a WordPress site.

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Composer (for PHP dependencies)

## Step-by-Step Build Process

### 1. Install Dependencies

First, install all required dependencies:

```bash
# Install Node.js dependencies (React, Vite, etc.)
npm install

# Install PHP dependencies (Composer packages)
composer install
```

### 2. Build Frontend Assets

Build the React applications for both admin and frontend:

```bash
# Build all assets (admin + frontend + blocks)
npm run build
```

This command will:
- Build the admin React app → `assets/admin/dist/`
- Build the frontend React app → `assets/frontend/dist/`
- Build Gutenberg blocks → `assets/blocks/`

### 3. Create Release Package

Create a production-ready release package:

```bash
# Build assets and create release package
npm run release
```

This command will:
1. Run `npm run build` to compile all assets
2. Run `grunt release` which:
   - Copies all necessary files to `release/wordpress-plugin-boilerplate/`
   - Creates a zip file: `release/wordpress-plugin-boilerplate.zip`
   - Creates a versioned zip: `release/wordpress-plugin-boilerplate-1.0.0.zip`
   - Excludes development files (node_modules, .git, tests, etc.)

## Installation on WordPress

### Option 1: Upload via WordPress Admin

1. Go to your WordPress admin dashboard
2. Navigate to **Plugins → Add New**
3. Click **Upload Plugin**
4. Choose the `release/wordpress-plugin-boilerplate.zip` file
5. Click **Install Now**
6. Activate the plugin

### Option 2: Manual Installation

1. Extract the zip file: `release/wordpress-plugin-boilerplate.zip`
2. Upload the extracted folder to `/wp-content/plugins/` on your server
3. Go to **Plugins** in WordPress admin
4. Find "African Energies Report Chart Plugin" and click **Activate**

## What Gets Included in the Release

The release package includes:
- ✅ All PHP files (`includes/`, `libs/`, `config/`, etc.)
- ✅ Built JavaScript/CSS assets (`assets/admin/dist/`, `assets/frontend/dist/`)
- ✅ Database migrations and seeders
- ✅ Composer vendor directory (PHP dependencies)
- ✅ Plugin main file (`aer-chart-plugin.php`)
- ✅ Views and templates

The release package excludes:
- ❌ `node_modules/` (development dependencies)
- ❌ Source files (`src/`)
- ❌ Development config files (`.gitignore`, `package.json`, `vite.config.js`, etc.)
- ❌ Documentation and tests
- ❌ Source maps (`.js.map` files)

## Development vs Production Builds

### Development Build
```bash
npm run dev
```
- Runs Vite dev server with hot reload
- Source maps enabled
- Not optimized for production

### Production Build
```bash
npm run build
```
- Minified and optimized code
- Code splitting enabled
- Production-ready assets

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install && composer install`
- Check Node.js version: `node --version` (should be v18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Assets Not Loading
- Verify assets were built: Check `assets/admin/dist/` and `assets/frontend/dist/` exist
- Ensure WordPress can access the plugin directory
- Check file permissions on the server

### Plugin Activation Errors
- Check PHP version (should be 7.4+)
- Verify Composer dependencies are included in release
- Check WordPress error logs for specific issues

## Quick Reference

```bash
# Full build and release process
npm install              # Install Node dependencies
composer install         # Install PHP dependencies
npm run build           # Build all assets
npm run release         # Create release package

# The zip file will be at:
# release/wordpress-plugin-boilerplate.zip
```

