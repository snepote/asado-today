import { nanoid } from "nanoid";

export function generateSlug(length = 8): string {
	return nanoid(length);
}

export function generateToken(): string {
	return nanoid(24);
}
