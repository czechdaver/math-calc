# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CLAUDE.md - Comprehensive AI development guidelines
- Enhanced project documentation structure
- TypeScript gradual strict mode preparation

### Changed
- Complete README.md rewrite with comprehensive project overview
- Updated documentation for better AI model understanding

## [1.1.0] - 2024-12-07 - Major Cleanup Release

### 🧹 Major Cleanup & Consolidation

#### Added
- **CLAUDE.md** - AI development guidelines and project context
- **Enhanced README.md** - Comprehensive project overview with all calculators listed
- **Environment variable support** - Proper configuration for Google Analytics and AdSense
- **Improved error handling** - Development vs production logging patterns

#### Changed
- **✅ Localization Configuration** - Consolidated from 3 files to single `i18n.ts` with proper fallbacks
- **✅ Package.json Structure** - Organized dependencies into proper `dependencies` and `devDependencies`
- **✅ Documentation Structure** - Optimized for AI model comprehension and consistency
- **✅ Error Logging** - Replaced debug console.log with conditional development logging
- **✅ TypeScript Configuration** - Prepared foundation for gradual strict mode implementation

#### Removed
- **✅ Backup Files Cleanup** - Removed all `.bak`, `.obsolete`, and temporary files
- **✅ Duplicate Calculator Directories** - Consolidated 12 duplicate directories
- **✅ Duplicate i18n Configuration** - Removed duplicate config files
- **✅ Development Console Logs** - Cleaned up debug statements

#### Technical Debt Reduction
- **Repository Size** - Significantly reduced by removing duplicate directories and backup files
- **Code Maintainability** - Single source of truth for configurations
- **Development Experience** - Cleaner file structure without confusing duplicates
- **Documentation Consistency** - Unified documentation approach for AI development

## [1.0.0] - 2024-11-XX - Initial Release

### Added
- 20+ specialized calculators across multiple categories
- Czech and English internationalization
- Next.js 15 with App Router
- Responsive design with Tailwind CSS
- SEO optimization with structured data
- Accessibility features (WCAG 2.1 AA)