# 🥂🍾 Champagne ! 🍾🥂

Bubble up the outstanding and celebrate the best!

## What is champagne?

Champagne is a voting platform for massive competitions. It implements the [NodeRank](https://github.com/fcrozatier/NodeRank) peer ranking algorithm where people vote by comparing pairs of entries to let the best ones bubble up the surface.

## How to use it?

You can use this project by setting a few environment variables in your local `.env` file:


| name                           | value                  | description                                       |
| ------------------------------ | ---------------------- | ------------------------------------------------- |
| `PUBLIC_CURRENT_PHASE`         | 0, 1, 2 or 3           | the current state of the competition (0 for none) |
| `PUBLIC_REGISTRATION_DEADLINE` | "yyyy-mm-ddThh:mm:ssZ" | An ISO 8601 string for the registration deadline  |
| `PUBLIC_VOTING_OPEN`           | 0 or 1                 | 1 if the voting phase in open                     |
| `PUBLIC_RESULTS_OPEN`          | 0 or 1                 | 1 if results are available                        |



`PUBLIC_CURRENT_PHASE` is a semantic variable that allows the UI to display information on the current state of the competition while the other three are logic variables that give you granular control on which forms and widgets are actually live.

The decoupling between UI and logic gives time for cleanup/maintenance between phases: you can easily disable forms and widgets while still providing meaningful info on the phase.

## Licence

[MIT](/LICENCE)