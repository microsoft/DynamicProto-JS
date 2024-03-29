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

2. Install all dependencies

    ```sh
    npm install
    npm install -g @microsoft/rush
    ```

3. Navigate to the root folder and update rush dependencies

    ```sh
    rush update --recheck --full
    ```

4. Build, lint, create docs and run tests

    ```sh
    rush build
    npm run test
    ```

If you are changing package versions or adding/removing any package dependencies, run<br>**```rush update --purge --recheck --full```**<br>before building. Please check-in any files that change under common\ folder.
