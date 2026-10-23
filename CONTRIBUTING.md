# Contributing

This project welcomes contributions and suggestions. Most contributions require you to
agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit
https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need
to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the
instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Welcome

Welcome and thank you for your interest in contributing to DynamicProto-JS.

We strongly welcome and encourage contributions to this project. If making a large change we request that you open an [issue][GitHubIssue] first.

## Clone, Setup, Build & Test this repo
1. Clone the repository and create a new branch

2. Select a patched Node.js runtime before installing dependencies or running any
   build, test, documentation, development-server, or packaging tools.
   Check `node --version` and use the npm bundled with the selected runtime.

   The minimum supported tooling versions are **22.23.4**, **24.22.1**, and
   **26.12.1**, including later stable releases within each of those major lines.
   CI covers Node.js 22.23.4 and 24.22.1. Older, odd-numbered, and prerelease Node.js
   versions are not supported for repository tooling. npm's root `devEngines`
   constraint rejects unsupported runtimes for installs and `npm run` commands;
   older npm versions that do not implement `devEngines`, direct tool invocations,
   and commands inside `lib` or `rollup` still require selecting the runtime first.
   Do not bypass the check with `--force`.

   These are development-tooling requirements, not new runtime requirements for
   consumers of the published browser library or Rollup plugin. See
   [Node.js tooling security](SECURITY.md#nodejs-tooling-security) for scope.

3. Install all dependencies

    ```sh
    npm install
    ```

4. Build and create docs

    ```sh
    npm run build
    ```

5. Run tests

    ```sh
    npm run test
    ```
