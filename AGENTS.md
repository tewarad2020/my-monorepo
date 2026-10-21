# AGENTS.md

Guidance for AI coding agents working in this repository.

## Overview

Nx monorepo (`@my-monorepo/source`) with a TypeScript and Go mix:

- `apps/api`: Node API built with Nx `@nx/js` and webpack (`serve`, `build`, `prune`).
- `apps/api-e2e`: e2e tests for `api` (Jest).
- `apps/go-api`: Go service (module `apps/go-api`, Go 1.26), wired in through `@nx-go/nx-go` and `go.work`.
- `apps/web`: React 19 app built with Vite (targets inferred by `@nx/vite`).
- `libs/shared-types`: shared TypeScript types, imported as `@my-monorepo/shared-types` (path alias in `tsconfig.base.json`).
- `tmp/`: generated build output. Do not edit.

## Tooling

- Package manager: Bun (`bun.lockb`). Install with `bun install`.
- Run Nx through Bun or npx, e.g. `bun nx <target> <project>` or `npx nx <target> <project>`.
- Common targets: `serve`, `build`, `test`, `typecheck`, `dev` (web/Vite), `preview`.
- Run all projects with a target: `bun nx run-many -t <target>`.
- Inspect a project's targets: `npx nx show project <name>`.
- Tests use Vitest (`vitest.config.mts` at the root collects project configs). The `test` target runs in watch mode locally; use `test-ci` in CI.
- Go: run `go` commands from `apps/go-api` (or the workspace root, which uses `go.work`).

## Conventions

- Use the Nx project graph to decide what to build or test. Prefer `nx affected` over running everything.
- Put code shared between apps in `libs/`, and import it through the `@my-monorepo/*` path aliases. Do not use relative imports across project boundaries.
- Keep shared types in `libs/shared-types/src/lib/` and export them from `libs/shared-types/src/index.ts`.
- Respect `tsconfig.base.json` settings (`strict` is off, `moduleResolution` is `bundler`). Do not change them without a reason.
- Do not edit `node_modules/`, `tmp/`, `dist/`, or lockfiles by hand. Change dependencies with Bun.
- Nx generators (`npx nx g @nx/<plugin>:<generator>`) are the preferred way to create new apps and libraries.

## Before finishing a change

1. Run the affected project's `test` (or `test-ci`) and `build` targets, or `nx affected -t test build`.
2. For `apps/go-api`, run `go test ./...` and `go build ./...`.
3. Check that the types in `libs/shared-types` still compile for both the API and the web app.


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->