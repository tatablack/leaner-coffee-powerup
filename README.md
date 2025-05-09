# Leaner Coffee Power-Up for Trello

<a href="https://trello.com/power-ups/5d1249acb16eef6f790f2af9/enable">
  <img
    alt="Add Leaner Coffee to Trello"
    title="Add Leaner Coffee to Trello"
    height="40" width="144"
    src="https://p.trellocdn.com/add_to_trello.png"
    srcSet="https://p.trellocdn.com/add_to_trello.png 1x,
      https://p.trellocdn.com/add_to_trello@2x.png 2x"
  />
</a>

## What _is_ Trello?
[Trello](https://trello.com/) is a project management web application based on the concepts of boards, lists and cards.

From a developer's perspective, it's also a platform which can be extended using Power-Ups
(here's a [directory of existing ones](https://trello.com/power-ups), and here's [the official introduction to Power-Ups development](https://developers.trello.com/reference#power-ups-intro)).

## So, this is a Power-Up?
Yep. This project implements a Power-Up meant to support "Lean Coffee"-style sessions based on a Trello board.

## What is "Lean Coffee", then?
From the [official page](https://leancoffee.org/):

    Lean Coffee is a structured, but agenda-less meeting.

The following is an example of a Lean Coffee session:
1. 5 minutes to add new cards to a "Discussion topics" list
2. 5 minutes to vote for individual topics (each person gets a fixed number of votes, usually based on the number of topics)
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
    - (Lean Coffee bonus!) ensuring people can only vote for as many cards as the rules of multivoting (aka N/3 voting) allow
- discussion management
    - start/pause/end a timer for a discussion about a card
    - notifications (visual + audio) when a discussion timer elapses (visible only to the initiator)
- card badges and card detail badges, displaying:
    - number of votes / list of voters
    - elapsed time for a discussion
- card back sections, displaying:
    - discussion status (when ongoing)
    - a simple UI to vote on a discussion to determine the next step (when paused)

| Card Badges                | Card Back Section                | Menu                     |
|----------------------------|----------------------------------|--------------------------|
| ![Votes][CardBadgeVoting]  | ![Votes][CardBackSectionOngoing] | ![Votes][PowerUpButtons] |
| ![Votes][CardBadgeOngoing] | ![Votes][CardBackSectionPaused]  |                          |

[CardBadgeVoting]: ./assets/readme/card_badge_voting.png
[CardBadgeOngoing]: ./assets/readme/card_badge_ongoing.png
[CardBackSectionOngoing]: ./assets/readme/ongoing_discussion.png
[CardBackSectionPaused]: ./assets/readme/paused_discussion.png
[PowerUpButtons]: ./assets/readme/buttons.png

[BrowserStack]: ./assets/readme/browserstack_logo.svg

## Installation
The Power-Up is free, and available through the official Trello Power-Up listing.

For reference, here's our [privacy policy](PRIVACY.md).

### Releasing
The official version of this Power-Up is currently hosted on GitHub Pages, based on the contents of the `docs` folder.

A new version can be released by executing `npm version [major|minor|patch]`.
This will:
- bump the version number in both `package.json` and `package-lock.json`
- trigger a production build (output in the `docs` folder)
- create a commit with these changes
- create a git tag with the same version number

The Release Drafter GitHub App will take care of drafting/updating a GitHub release every time a PR gets merged; after the steps above the current draft release can be published (tied to the tag just created).

#### Releasing a new translation
|               |               |
| ------------- |:-------------:|
| Thanks to:    | [![BrowserStack][BrowserStack]](https://www.browserstack.com) |

Once a PR providing a new translation has been merged, we need to create localised screenshots for the Power-Up listing - the `tools` folder contains a WebDriver-based script which uses BrowserStack to automate this process (they offer unlimited access for Open Source projects).

You can run it from the project's main folder with `npm run screenshots`; pass `--help` for usage instructions.
Without parameters, it will regenerate screenshots for all locales - you can limit regeneration to a single locale with:

```npm run screenshots -- --locale <languagetag>```

For example,

```npm run screenshots -- --locale zh-Hans```

The script opens a remote BrowserStack session (for which you'll need to set two environment variables, `BROWSERSTACK_USER` and `BROWSERSTACK_KEY`), and logs in to Trello (for which you'll need to expose credentials through the `TRELLO_USERNAME` and `TRELLO_PASSWORD` environment variables). *Note*: after Trello's acquisition by Atlassian, the login flow is slightly different, in that the username is typed while on a `trello.com` domain, while the password will be set while on `atlassian.com`. Confusing, but workable.

Access to a specific shared board needs to be pre-arranged for the chosen Trello user, so that specific cards / lists can be included in the screenshots (the board URL is hard-coded in the script).

At the time of the initial implementation, taking screenshots in Chrome didn't seem to work, so Firefox will be used instead.

## Contributing
See the [CONTRIBUTING](CONTRIBUTING.md) document.

## Versioning
We use [SemVer](http://semver.org/) for versioning.

## Authors
Angelo Tata @tatablack

## Disclaimer
Lean Coffee(tm) is a trademark of Modus Cooperandi (as mentioned [here](https://leancoffee.org/)); we are not affiliated with them, or with the original creators of the technique, in any way. We just happened to run plenty of Lean Coffee sessions on Trello, and we wanted to make our own lives easier. Once this proved useful, well, sharing was the next step.

## License
Apache-2.0. See [LICENSE](./LICENSE).
