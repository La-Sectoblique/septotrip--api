import { User } from "../models/User";
import { Session } from "../types/utils/Session";

export async function getSessionUser(session: Session): Promise<User> {

	const user: User | null = await User.findByPk(session.id, {
		attributes: {
			exclude: [
				"hashedPassword"
			]
		}
	});

	if(!user)
		throw new Error("No user in this session");
	
	return user;
}

