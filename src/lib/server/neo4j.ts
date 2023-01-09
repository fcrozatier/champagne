import neo4j, { Integer, Node } from 'neo4j-driver';
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } from '$env/static/private';

export const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

interface CreatorProperties {
	email: string;
	token: string;
}

export type Creator = Node<Integer, CreatorProperties>;

export interface EntryProperties extends Record<string, unknown> {
	entry: 'video' | 'non-video';
	title: string;
	description: string;
	link: string;
	flaggedBy: string;
	number: number;
	points: number;
}

export type Entry = Node<Integer, EntryProperties>;
