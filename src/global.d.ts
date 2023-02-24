// https://github.com/total-typescript/ts-reset/blob/main/src/entrypoints/array-includes.d.ts

type WidenLiteral<T> = T extends string
	? string
	: T extends number
	? number
	: T extends boolean
	? boolean
	: T extends bigint
	? bigint
	: T extends symbol
	? symbol
	: T;

// Fix Array.includes types
interface ReadonlyArray<T> {
	/**
	 * Determines whether an array includes a certain element, returning true or false as appropriate.
	 * @param searchElement The element to search for.
	 * @param fromIndex The position in this array at which to begin searching for searchElement.
	 */
	includes(searchElement: T | WidenLiteral<T>, fromIndex?: number): searchElement is T;
}
