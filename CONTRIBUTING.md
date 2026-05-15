# Contributing

This repository uses a lightweight professional workflow focused on clean history, clear branches and Conventional Commits.

The portfolio content can remain in Brazilian Portuguese. Technical repository workflow should be written in English, including commit messages, branch names, pull request titles and changelog entries.

## Commit Convention

Use Conventional Commits:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(seo): add structured metadata and sitemap
fix(layout): prevent mobile overflow in hero section
refactor(components): extract reusable section heading
perf(images): optimize project preview assets
docs(readme): add project setup and deployment guide
chore(config): update TypeScript and ESLint settings
```

Allowed types:

- `feat`: new feature or visible user-facing capability
- `fix`: bug fix
- `docs`: documentation changes
- `style`: formatting or visual-only changes that do not affect logic
- `refactor`: internal code change without behavior change
- `perf`: performance improvement
- `test`: tests or test utilities
- `build`: build system, dependencies, package manager or bundler changes
- `ci`: CI/CD and GitHub Actions changes
- `chore`: maintenance tasks that do not fit other types
- `revert`: revert a previous commit

Recommended scopes:

- `project`
- `config`
- `layout`
- `theme`
- `hero`
- `about`
- `experience`
- `projects`
- `skills`
- `certifications`
- `contact`
- `resume`
- `components`
- `animations`
- `seo`
- `metadata`
- `analytics`
- `a11y`
- `performance`
- `assets`
- `vercel`
- `docs`
- `license`

Rules:

- Write commit messages in English.
- Use lowercase type and scope.
- Use imperative mood in the description.
- Do not end the subject with a period.
- Keep the header short and objective, ideally under 72 characters.
- Use a commit body when the change is complex or important.
- Explain what changed and why, not every implementation detail.

Avoid vague commits:

```text
update
fix stuff
portfolio final
changes
ajustes finais
```

## Branch Strategy

- `main`: production branch, always deployable.
- `feature/*`: new sections or major additions.
- `fix/*`: bug fixes.
- `perf/*`: performance work.
- `docs/*`: documentation work.
- `chore/*`: maintenance and configuration work.

Examples:

```text
feature/seo-foundation
feature/project-showcase
feature/contact-section
fix/mobile-layout
perf/image-optimization
docs/readme
chore/repository-setup
```

## Pull Requests

Use pull requests when possible, even for solo work.

PR title format:

```text
<type>: <short summary>
```

Examples:

```text
feat: add SEO foundation for portfolio
feat: implement project showcase sections
fix: improve mobile layout and accessibility
perf: optimize portfolio images
docs: add project documentation and license
```

## Validation

Run the full validation before publishing changes:

```bash
npm run validate
```

This runs:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Releases

Use Semantic Versioning for public releases:

- `v0.1.0`: initial project structure
- `v0.2.0`: core sections implemented
- `v0.3.0`: SEO foundation implemented
- `v0.4.0`: analytics and performance pass
- `v1.0.0`: first public portfolio release
