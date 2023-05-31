import neo4j, { type Integer, type Node, type Relationship } from 'neo4j-driver';
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } from '$env/static/private';
import type { Category } from '$lib/config';

/**
 * To backup the db from AuraDB and explore in Python you can do the following:
 * 1. Export as graphml data
 *
 * MATCH (entry:Entry)
	WITH collect(entry) as entries
	CALL apoc.export.graphml.data(entries, [], null,{stream: true})
	YIELD file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data
	RETURN data
 *
	2. Save the file as JSON
	3. Clean the file, only keep the data content
	4. Change file extension to .xml
	5. Clean the xml by replacing \" by "
	6. Import in python
			import networkx as nx

			graph = nx.read_graphml(<path_to_xml_file>)

 */

export const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

export interface UserProperties {
	email: string;
	token: string;
	lastVote?: string;
}

export type User = Node<Integer, UserProperties>;

export interface EntryProperties extends Record<string, unknown> {
	category: Category;
	title: string;
	description: string;
	link: string;
	group: boolean;
	thumbnail: string;
	number: number;
}

export type Entry = Node<Integer, EntryProperties>;

export interface FeedbackProperties extends Record<string, unknown> {
	token: string;
	userToken: string;
	value: string;
	explicit: boolean;
	validated: boolean;
}

export type Feedback = Node<Integer, FeedbackProperties>;

export interface FlagProperties extends Record<string, unknown> {
	reason: string;
}

export type Flag = Relationship<Integer, FlagProperties>;
