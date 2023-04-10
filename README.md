# Champagne! 🍾

Bubble up and celebrate the outstanding!

## What is champagne?

Champagne is a voting platform for massive competitions. It implements a peer ranking algorithm where people vote by comparing pairs of entries to let the best ones bubble up the surface. See [bubble graph](https://github.com/fcrozatier/NodeRank) for more details.

## Features

- Register creators-entries pairs and judges. Prevent duplicates (only one sign-up per email) and allow group entries
- Vote. Signed-up users can vote with a personal link sent by email.
- The pairing creates a [graph](https://github.com/fcrozatier/NodeRank#principles). The vote is closed after a deadline is met.
- Auto cleanup stale comparisons: if a user is assigned a comparison between entries and does not vote after X hours this is reassigned to someone else.
- Rate limit votes: a user must wait at least X minutes between votes and can make at most Y votes in each categories.
- Leave feedbacks. Creators can access their feedbacks at the end. Admins can review and validate feedbacks.
- Detect explicit language in feedbacks
- Flag inappropriate entries. Admins can review the flagged entries and confirm or unflag them
- Deadlines: Sign-up and vote forms are disabled on given dates
- Runs a [PageRank](https://en.wikipedia.org/wiki/PageRank) algorithm to rank the entries
- Protected admin area

Numbers are configurable. See [configuration](#configuration) below for more details.

## Stack

This project is a [SvelteKit](https://kit.svelte.dev/) app running a [Neo4j](https://neo4j.com/) graph database. To run it locally you need [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)

## Configuration

You can use this project by setting these environment variables in your local `.env` file:

| name                        | value                         | description                                                           |
| --------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `PUBLIC_REGISTRATION_START` | "yyyy-mm-ddThh:mm:ssZ"        | Registration start date                                               |
| `PUBLIC_REGISTRATION_END`   | "yyyy-mm-ddThh:mm:ssZ"        | Registration deadline                                                 |
| `PUBLIC_VOTE_START`         | "yyyy-mm-ddThh:mm:ssZ"        | Vote start date                                                       |
| `PUBLIC_VOTE_END`           | "yyyy-mm-ddThh:mm:ssZ"        | Vote deadline                                                         |
| `PUBLIC_RATE_LIMIT`         | number                        | Minimum time delta between votes in minutes                           |
| `PUBLIC_VOTE_LIMIT`         | float between 0 and 1         | Maximum number of votes per user relative to a category total entries |
| `PUBLIC_RESULTS_AVAILABLE`  | 0 or 1                        | 1 if results are available                                            |
| `ORIGIN`                    | string                        | Custom domain                                                         |
| `ADMIN_PASSWORD`            | string                        | Admin level access                                                    |
| `NEO4J_URI`                 | e.g. "neo4j://localhost:7687" | neo4j connection string                                               |
| `NEO4J_USERNAME`            | string                        | neo4j user                                                            |
| `NEO4J_PASSWORD`            | string                        | neo4j password                                                        |
| `MAILGUN_API_KEY`           | string                        | mailgun config                                                        |
| `DOMAIN`                    | string                        | mailgun config                                                        |

You can tweak the competition settings (name and categories) in the `$lib/config.ts` file. A few additional server configurations are available in `$lib/server/config.ts`

## How to run locally?

1. Install [Neo4j Desktop](https://neo4j.com/developer/neo4j-desktop/?ref=product)
1. Create your local db and install the [APOC procedures](https://neo4j.com/docs/apoc/5/installation/#apoc) and the [Graph Data Science Library](https://neo4j.com/docs/graph-data-science/current/installation/neo4j-desktop/)
1. Set your environment variables in `.env`
1. Install the packages `npm install`
1. Run the dev server `npm run dev`
1. Visit `localhost:5173/admin` to add the validation constraints to the database and fixtures if you want dummy data

> Note: if you want the background auto cleanup of old assigned comparisons in dev mode then you need to visit `localhost:5173/admin/db-setup` each time you launch neo4j Desktop since the background job is cleared when you close the db


## Python tests

To run the graph utilities tests `cd graph/` then:

```py
python3 -m venv ./.venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
```

## License

[MIT](/LICENSE)
