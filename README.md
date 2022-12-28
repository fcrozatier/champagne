# Champagne

Bubble up the outstanding and celebrate the best!

## What is champagne?

Champagne is a voting platform for massive competitions implementing a peer ranking algorithm. The algorithm is an implementaion of NodeRank.

## How to use it?

You can use this project by setting a few environment variables in you local `.env` file:

- `PUBLIC_CURRENT_PHASE` _(number 0, 1, 2 or 3)_ is a semantic variable that allows to display information on the current state of the competition
- `PUBLIC_REGISTRATION_DEADLINE` _(string )_ An ISO 8601 string representing the registration deadline "yyyy-mm-ddThh:mm:ssZ"
- `PUBLIC_VOTING_OPEN`, `PUBLIC_RESULTS_OPEN` _(number 0 or 1)_ are three logic variables that give you granular control on which forms and widgets are actually live.

The decoupling between UI info and logic allows you to take your time between phases.
