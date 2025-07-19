# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build Commands
- `npm run build` - Builds the project by cleaning dist directory, compiling TypeScript, and copying icon files
- `npm run dev` - Runs TypeScript compiler in watch mode for development

### Code Quality Commands
- `npm run lint` - Runs ESLint on nodes, credentials, and package.json
- `npm run lintfix` - Automatically fixes ESLint errors where possible
- `npm run format` - Formats code using Prettier for nodes and credentials directories

### Publishing
- `npm run prepublishOnly` - Runs before publishing to npm (builds and lints with special prepublish rules)

## Architecture Overview

This is an n8n community node package starter template for creating custom n8n nodes and credentials.
Now we will transform it to become an n8n nodes for OVH. You should help you with n8n documentation for custom node to code : https://docs.n8n.io/integrations/creating-nodes/overview/

### Directory Structure
- `/nodes/` - Contains custom n8n node implementations
  - Each node has its own directory (e.g., `/nodes/ExampleNode/`)
  - Node files follow the pattern `*.node.ts`
  - Icons should be SVG format in the same directory
- `/credentials/` - Contains credential type definitions
  - Credential files follow the pattern `*.credentials.ts`
- `/dist/` - Build output directory (TypeScript compiled to JavaScript)

### Node Development Pattern
Nodes implement the `INodeType` interface from `n8n-workflow`:
- `description` property defines node metadata, inputs/outputs, and parameters
- `execute` method contains the main logic
- Error handling uses `NodeOperationError` with proper context
- Nodes iterate over input items and process them individually

### Credential Development Pattern
Credentials implement the `ICredentialType` interface:
- Define properties that users need to provide
- Support authentication configuration via `authenticate` property
- Can include test configuration to verify credentials work

### Build Process
1. TypeScript compilation to CommonJS (targets ES2019)
2. Gulp task copies icon files from source to dist
3. Strict TypeScript settings enforced
4. ESLint with n8n-specific rules for nodes and credentials

### Important Conventions
- Node class names must match their file names
- Nodes should handle errors properly with `continueOnFail` support
- All strings in node/credential descriptions should follow n8n's style guide (enforced by ESLint)
- Icon files must be SVG format
- Package must be published to npm to be usable in n8n