# Contributing to Leaner Coffee

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to the Leaner Coffee Power-Up. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behaviour to [leanercoffee@tatablack.net](mailto:leanercoffee@tatablack.net).


## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Leaner Coffee. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behaviour :computer: :computer:, and find related reports :mag_right:.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Perform a [cursory search](https://github.com/tatablack/leaner-coffee-powerup/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on the repository and provide the following information.

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't just say what you did, but explain how you did it**.
* **Describe the behaviour you observed after following the steps** and point out what exactly is the problem with that behaviour.
* **Explain which behaviour you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) on Linux.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

* **What's the name and version of the OS you're using**?
* **Which browser are you using, and which version of it?**


### Your First Code Contribution
#### Prerequisites
Power-ups are built using web technologies. Specifically, this project is written in ES6 and transpiled to ES5 for release.

The build toolchain is, unsurprisingly, Node.js-based (check the `engines` section in `package.json` for the supported environment).

#### Preparing your local environment
Ensure you have a compatible version of Node.js installed. Then run `npm install`.

In order to load your power-up in a Trello board, its files need to be served via HTTPS - which means you'll
need to create a self-signed certificate and configure a local HTTP server to use it. This is easy enough, thanks
to `webpack-dev-server` and, say, `devcert-cli`.

The former is already part of the dependencies; the latter is just a recommendation to easily generate the necessary
certificate files. See [its GitHub page](https://github.com/davewasmer/devcert-cli#usage) for more information.

The npm scripts provided in `package.json` assume you have generated a `localhost.cert` certificate file and its `localhost.key`
key file in the root of the project. Tweak as needed.

Available commands after installation:
- `npm start` → stars a development server with hot reloading (using `webpack-dev-server`)
- `npm run dist` → builds a production release of the project; output is in the `docs` folder

#### Running
Trello Power-Ups can be managed following [these instructions](https://developers.trello.com/docs/managing-power-ups).

Once you have your Power-Up running, either on `localhost` during development or deployed somewhere on the Internet,
you can add it to one of your Trello teams by going to [this page](https://trello.com/power-ups/admin)
(you need to be a Team Admin).

Make sure to fill in the following values:
- *Power-Up icon URL*: `https://localhost:8080/assets/coffee.svg`
- *Iframe connector URL*: `https://localhost:8080/index.html`

### Pull Requests
First of all, follow the [styleguides](#styleguides). The reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move timer to..." not "Moves timer to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :memo: `:memo:` when writing docs
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

The project provides an ESLint configuration file, which you should use to ensure style conventions are respected.

Having said that:

* Place requires in the following order:
    * Built in Node Modules (such as `path`)
    * Local Modules (using relative paths)
* Place class properties in the following order:
    * Class methods and properties (methods starting with `static`)
    * Instance methods and properties
