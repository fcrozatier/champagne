# 🥂🍾 Champagne ! 🍾🥂

Bubble up the outstanding and celebrate the best!

## What is champagne?

Champagne is a voting platform for massive competitions. It implements the [NodeRank](https://github.com/fcrozatier/NodeRank) peer ranking algorithm where people vote by comparing pairs of entries to let the best ones bubble up the surface.

## Stack

This project is a [SvelteKit](https://kit.svelte.dev/) app running a [Neo4j](https://neo4j.com/) graph database. To run it locally you need [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)

## How to use it?

You can use this project by setting a few environment variables in your local `.env` file:

| name                        | value                   | description                                   |
| --------------------------- | ----------------------- | --------------------------------------------- |
| `PUBLIC_REGISTRATION_START` | "yyyy-mm-ddThh:mm:ssZ"  | An ISO 8601 string for the registration start |
| `PUBLIC_REGISTRATION_END`   | "yyyy-mm-ddThh:mm:ssZ"  | An ISO 8601 string for the registration end   |
| `PUBLIC_VOTE_START`         | "yyyy-mm-ddThh:mm:ssZ"  | An ISO 8601 strE for the voting phase start   |
| `PUBLIC_VOTING_END`         | "yyyy-mm-ddThh:mm:ssZ"  | An ISO 8601 string for the voting phase end   |
| `PUBLIC_RESULTS_AVAILABLE`  | 0 or 1                  | 1 if results are available                    |
| `NEO4J_URI`                 | "bolt://localhost:7687" | neo4j connection string                       |
| `NEO4J_USERNAME`            | string                  | neo4j user                                    |
| `NEO4J_PASSWORD`            | string                  | neo4j password                                |

## Running locally

1. Install [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)
1. Create your local db and install the [APOC procedures](https://neo4j.com/docs/apoc/5/installation/#apoc)
1. Set your environment variables in `.env`
1. Install the packages `npm install`
1. Run the dev server `npm run dev`
1. Visit `localhost:5173/dbsetup` to add the validation constraints to the database

## Licence

[MIT](/LICENCE)
