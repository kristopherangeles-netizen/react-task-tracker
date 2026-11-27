# Taskboard

A small React task tracker used to demonstrate continuous integration and deployment with GitHub, Jenkins, SonarQube, and Docker. Tasks can be added, marked complete, filtered, and cleared; data is held in memory and resets when the page is reloaded.

## Run locally

Requirements: Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

## Tests, coverage, and build

```sh
npm test
npm run test:coverage
npm run lint
npm run build
```

The test suite covers task creation, validation, completion, filtering, and the task counter. Coverage is written to `coverage/`, including `coverage/lcov.info` for SonarQube. Generated coverage and build output are ignored by Git.

## GitHub branches

The repository uses `main` for stable releases, `develop` for integration, and `feature/<name>` for individual changes. Create feature branches from `develop`, for example:

```sh
git switch develop
git switch -c feature/my-change
git push -u origin feature/my-change
```

Configure Jenkins SCM credentials in Jenkins rather than storing credentials in this repository. Do not commit `node_modules`, `coverage`, `dist`, passwords, or access tokens.

## Jenkins continuous integration

Create a **Multibranch Pipeline** pointed at the GitHub repository and enable branch discovery. Set its script path to `Jenkinsfile`. Jenkins should scan the repository and create jobs for branches containing the Jenkinsfile.

The CI pipeline expects:

- The NodeJS Jenkins plugin and a configured Node.js installation named **NodeJS** (Node 22.12 or newer).
- The SonarQube Scanner for Jenkins plugin, a server configuration named **SonarQube**, and an automatically installed SonarQube Scanner tool named **SonarScanner**.
- The SonarQube server webhook configured to call Jenkins' `/sonarqube-webhook/` endpoint so the quality-gate stage can complete.
- The HTML Publisher plugin for the coverage report. The pipeline also archives the LCOV file.

Branch-specific CI behavior:

- `main`: checkout, install and test, generate coverage, SonarQube analysis, quality gate, production build, and archive a versioned `release-<build-number>.tar.gz`.
- `develop`: checkout, install and test, generate coverage, and production build.
- `feature/<name>`: checkout, install and test, and generate coverage; analysis, quality gate, build, and artifact archive are skipped.

The pipeline checks out the source explicitly, then runs tests before coverage. A test failure stops that branch's pipeline. SonarQube analysis and the quality gate run only on `main`; a failed main-branch gate prevents build and archive. The configured **SonarScanner** tool is invoked by the pipeline for analysis. The release archive contains the built site and Dockerfile.

## Jenkins continuous deployment

Create a separate Pipeline job using this repository's `Jenkinsfile.cd` (the Script Path setting can be used when the job is SCM-backed). Install the **Copy Artifact** plugin. The CD agent must have Docker available and permission to run it.

Run the CD job with:

- `CI_JOB_FULL_NAME`: the full Jenkins path of the multibranch **main** job, such as `react-task-tracker-ci/main` or `folder/react-task-tracker-ci/main`.
- `CI_BUILD_NUMBER`: the successful main-branch CI build number whose archived release should be deployed.
- `ENVIRONMENT`: choose `DEV`, `TEST`, `ACC`, or `PROD`.

The job rejects non-main sources and invalid build numbers, retrieves that exact build's `release-<CI_BUILD_NUMBER>.tar.gz`, extracts it, and builds the Docker image tagged with the CI build number. It does not rebuild the React source. Each environment uses its own container and host port: DEV `8081`, TEST `8082`, ACC `8083`, and PROD `8084`. The job prints the selected CI build, environment, container, port, and browser URL in the console. For example, PROD is available at `http://<docker-host>:8084/`.

## SonarQube

`sonar-project.properties` configures source/test discovery and imports the LCOV coverage report. Create the `react-task-tracker` project in SonarQube and configure a quality gate that requires at least 80% overall coverage before running the main-branch pipeline. Task IDs use the Web Crypto UUID API; task creation reports an error if secure ID generation is unavailable.

## Dependency security

Run `npm audit` to check the dependency tree. At the time of the latest check, it reported no vulnerabilities; run it again before submission because advisories can change.

## Docker

To build locally after `npm run build`:

```sh
docker build -t react-task-tracker:local .
docker run --rm -p 8080:80 react-task-tracker:local
```

## Demonstrating a pipeline failure and correction

For a safe, reproducible exercise, use a disposable feature branch. Temporarily change the expected output in a task test, commit and push that change, and capture the Jenkins run stopping at the test stage. Restore the correct expectation, commit and push the fix, and capture the passing rerun. Do not merge the deliberately failing test into `main`.
