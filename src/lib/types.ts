export function isStringArray(ob: object): ob is string[] {
	return Array.isArray(ob) && ob.every((x) => typeof x === 'string');
}
