# Lean Coffee Power-Up for Trello
## What _is_ Trello?
[Trello](https://trello.com/) is a project management web application based on the concepts of boards, lists and cards.

From a developer's perspective, it's also a platform which can be extended using Power-Ups
(here's a [directory of existing ones](https://trello.com/power-ups), and here's [the official introduction to Power-Ups development](https://developers.trello.com/v1.0/reference#power-ups-intro)).

## So, this is a Power-Up?
Yep. This project implements a Power-Up meant to support "Lean Coffee"-style sessions based on a Trello board.

## What is "Lean Coffee", then?
From the [official page](http://leancoffee.org/):

    Lean Coffee is a structured, but agenda-less meeting.

The following is an example of a Lean Coffee session:
1. 5 minutes to add new cards to a "Discussion topics" list
2. 5 minutes to vote for individual topics (each person gets a fixed number of votes, usually [based on the number of topics](http://www.leanmath.com/blog-entry/multi-voting-math-or-n3))
3. The moderator sorts the topics list by votes, and moves the top card to the "Discussing" list
4. 5 minutes to discuss the card, starting with its creator setting the context
5. There’s a timer: when it goes off, everybody can vote to keep discussing the same topic or move on. Based on the vote, the card may be moved to the “Done” list, and a new one put in its place
6. Go back to #4, rinse and repeat

It can be made simpler or more complicated, but that's the gist of it.

## Fine. And how does this Power-Up help?
Once enabled for a board, this Power-Up implements:
- voting capabilities (similar to the official [Voting Power-Up](http://info.trello.com/power-ups/voting))
    - click to vote (duh!)
    - displaying list of voters
    - sorting a list by number of votes
    - (Lean Coffee bonus!) ensuring people can only vote for as many cards as
    [these rules](http://www.leanmath.com/blog-entry/multi-voting-math-or-n3) allow
- discussion management
    - start/pause/end a timer for a discussion about a card
    - notifications (visual + audio) when a discussion timer elapses (visible only to the initiator)
- card badges and card detail badges, displaying:
    - number of votes / list of voters
    - elapsed time for a discussion
- card back sections, displaying:
    - discussion status (when ongoing)
    - a simple UI to vote on a discussion to determine the next step (when paused)

Card Badges | Card Back Section | Menu
------------|--------------------| ----
![Votes][CardBadgeVoting]  | ![Votes][CardBackSectionOngoing] | ![Votes][PowerUpButtons]
![Votes][CardBadgeOngoing] | ![Votes][CardBackSectionPaused] | 

[CardBadgeVoting]: ./assets/readme/card_badge_voting.png
[CardBadgeOngoing]: ./assets/readme/card_badge_ongoing.png
[CardBackSectionOngoing]: ./assets/readme/ongoing_discussion.png
[CardBackSectionPaused]: ./assets/readme/paused_discussion.png
[PowerUpButtons]: ./assets/readme/buttons.png

## Getting started
Trello Power-Ups can be managed following [these instructions](https://developers.trello.com/docs/managing-power-ups).

Once you have your Power-Up running, either on `localhost` during development or deployed somewhere on the Internet,
you can add it to one of your Trello teams by going to [this page](https://trello.com/power-ups/admin)
(you need to be a Team Admin).

## Running locally
### Prerequisites
Power-ups are built using web technologies. Specifically, this project is written in ES6 and transpiled to ES5 for release.

The build toolchain is, unsurprisingly, Node.js-based (tested with Node.js v10.15.3 and `npm` v6.4.1).

### Installing
Ensure you have a compatible version of Node.js installed. Then run `npm install`.

In order to load your power-up in a Trello board, its files need to be served via HTTPS - which means you'll
need to create a self-signed certificate and configure a local HTTP server to use it. This is easy enough, thanks
to `webpack-dev-server` and, say, `devcert-cli`.

The former is already part of the dependencies; the latter is just a recommendation to easily generate the necessary
certificate files. See [its GitHub page](https://github.com/davewasmer/devcert-cli#usage) for more information.

The provided npm scripts assume you have generated a `localhost.cert` certificate file and its `localhost.key`
key file in the root of the project. Tweak as needed.

Available commands after installation:
- `npm start` → stars a development server with hot reloading (using `webpack-dev-server`)
- `npm run dist` → builds a production release of the project; output is in the `docs` folder

### Running
1. Enable the Power-Up for one of your Trello teams (see "Getting started", above), and make sure to fill in the following values:
- *Power-Up icon URL*: `https://localhost:8080/assets/coffee.svg`
- *Iframe connector URL*: `https://localhost:8080/index.html`

2. Start the development server: `npm start`
3. Open a Trello board in the team you added the Power-Up to, and enable it in the board's settings.

### Releasing
The official version of this Power-Up is currently made available through GitHub Pages, based on the contents of the `docs` folder.

A new version can be released by executing `npm version [major|minor|patch]`.
This will:
- bump the version number in both `package.json` and `package-lock.json`
- trigger a production build (output in the `docs` folder)
- create a commit with these changes
- create a git tag with the same version number


## Contributing
TBD

## Versioning
We use [SemVer](http://semver.org/) for versioning.

<!-- TODO: How to check version if it's already installed in the org?
 Possibly from the settings at the org level? Or at the board level? --->

## Authors
Angelo Tata @tatablack

## License
Apache-2.0. See [LICENSE](./LICENSE).
