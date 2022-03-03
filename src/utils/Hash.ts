import bcrypt from "bcrypt";

export default class Hash {

	private salt: string;

	constructor(salt?: string) {
		this.salt = salt ?? bcrypt.genSaltSync(10);
	}

	hash(password: string): string {
		return bcrypt.hashSync(password, this.salt);
	}

	compare(password: string, hash: string): boolean {
		return bcrypt.compareSync(password, hash);
	}

	getSalt(): string {
		return this.salt;
	}
}