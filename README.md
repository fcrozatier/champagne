# 🥂🍾 Champagne ! 🍾🥂

Bubble up the outstanding and celebrate the best!

## What is champagne?

Champagne is a voting platform for massive competitions. It implements the [NodeRank](https://github.com/fcrozatier/NodeRank) peer ranking algorithm where people vote by comparing pairs of entries to let the best ones bubble up the surface.

## Stack

This project is a [SvelteKit](https://kit.svelte.dev/) app running a [Neo4j](https://neo4j.com/) graph database. To run it locally you need [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)

## How to use it?

You can use this project by setting a few environment variables in your local `.env` file:


| name                           | value                   | description                                       |
| ------------------------------ | ----------------------- | ------------------------------------------------- |
| `PUBLIC_CURRENT_PHASE`         | 0, 1, 2 or 3            | the current state of the competition (0 for none) |
| `PUBLIC_REGISTRATION_DEADLINE` | "yyyy-mm-ddThh:mm:ssZ"  | An ISO 8601 string for the registration deadline  |
| `PUBLIC_VOTING_OPEN`           | 0 or 1                  | 1 if the voting phase in open                     |
| `PUBLIC_RESULTS_OPEN`          | 0 or 1                  | 1 if results are available                        |
| `NEO4J_URI`                    | "bolt://localhost:7687" | neo4j connection string                           |
| `NEO4J_USERNAME`               | string                  | neo4j user                                        |
| `NEO4J_PASSWORD`               | string                  | neo4j password                                    |



`PUBLIC_CURRENT_PHASE` is a semantic variable that allows the UI to display information on the current state of the competition while the other three are logic variables that give you granular control on which forms and widgets are actually live.

The decoupling between UI and logic gives time for cleanup/maintenance between phases: you can easily disable forms and widgets while still providing meaningful info on the phase.

## Running locally

1. Install [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)
1. Set your environment variables in `.env`
1. Install the packages `npm install`
1. Run the dev server `npm run dev`

## Licence

[MIT](/LICENCE)