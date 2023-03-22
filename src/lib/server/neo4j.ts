import neo4j, { type Integer, type Node } from 'neo4j-driver';
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } from '$env/static/private';
import type { Category } from '$lib/categories';

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
	flagged?: boolean;
	flaggedBy?: string;
	flagReason?: string;
	number: number;
	points: number;
}

export type Entry = Node<Integer, EntryProperties>;

export interface FeedbackProperties extends Record<string, unknown> {
	token: string;
	value: string;
	validated: boolean;
}

export type Feedback = Node<Integer, FeedbackProperties>;
