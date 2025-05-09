**What is Lean Coffee?**

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

**How does this Power-Up help?**

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
    - a simple UI to vote on a discussion, to decide whether to switch topic or keep going

---

**Card Badges**

Badge showing votes in favour of discussing this card.

![Votes][CardBadgeVote]

Badge showing elapsed time for a discussion.

![Votes][CardBadgeElapsed]

---

**Card Back Section**

On the back of the card, just under the description, you can find a "Discussion" section. This shows the status and elapsed time of an ongoing discussion:

![Votes][CardBackSectionOngoing]

Or, when the timer elapses or the discussion is paused, it shows a simple UI so that any board member can vote to continue or end the discussion.

![Votes][CardBackSectionPaused]

---

**Menu**

Also on the back of the card, you can find a "Discussion" button which opens a submenu allowing you to start, pause or end a discussion.

Next to it there's a "Vote" button toggle, to express interest in discussing the currently selected card.

![Votes][PowerUpButtons]

[CardBadgeVote]: https://leaner-coffee.tatablack.net/assets/listings/en/card_badge_vote.png
[CardBadgeElapsed]: https://leaner-coffee.tatablack.net/assets/listings/en/card_badge_elapsed.png
[CardBackSectionOngoing]: https://leaner-coffee.tatablack.net/assets/listings/en/card_back_section_ongoing.png
[CardBackSectionPaused]: https://leaner-coffee.tatablack.net/assets/listings/en/card_back_section_paused.png
[PowerUpButtons]: https://leaner-coffee.tatablack.net/assets/listings/en/power_up_buttons.png

---

**Bugs and feature requests**

This project is open source, and contributions are welcome.
You can use [GitHub](https://github.com/tatablack/leaner-coffee-powerup/issues) to report issues or request features.

---

**Feedback**

If you have a question which you'd rather not ask publicly using [GitHub Issues](https://github.com/tatablack/leaner-coffee-powerup/issues), you can e-mail us using [leanercoffee@tatablack.net](mailto:leanercoffee@tatablack.net).

---

**Disclaimer**

Lean Coffee(tm) is a trademark of Modus Cooperandi (as mentioned [here](https://leancoffee.org/)); we are not affiliated with them, or with the original creators of the technique, in any way. We just happened to run plenty of Lean Coffee sessions on Trello, and we wanted to make our own lives easier. Once this proved useful, well, sharing was the next step.

---

**Credits**

[Moka Pot](https://thenounproject.com/ralfschmitzer/collection/coffee-bar/?i=628401 "Moka Pot") by Ralf Schmitzer from [the Noun Project](http://thenounproject.com/ "The Noun Project").

[User](https://thenounproject.com/icon/user-433684/ "User") by Ralf Schmitzer from [the Noun Project](https://thenounproject.com/ "The Noun Project").

[External Link](https://thenounproject.com/term/external-link/189137/ "External Link") by Laurent Canivet from [the Noun Project](http://thenounproject.com/ "The Noun Project").