import { encode, decode, TAlgorithm } from "jwt-simple";
import { PartialSession, EncodedSession, Session, DecodedSession, ExpirationStatus } from "../types/utils/Session";

const ALGO: TAlgorithm = "HS512";
const TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000;
const GRACE_TIME = 60 * 60 * 1000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export function encodeSession(partialSession: PartialSession): EncodedSession {

	if(!JWT_SECRET_KEY) 
		throw new Error("No JWT_SECRET_KEY provided");

	const issued = Date.now();
	const expires = issued + TOKEN_LIFETIME;
	const session: Session = {
		...partialSession,
		issued,
		expires
	};

	return {
		token: encode(session, JWT_SECRET_KEY, ALGO),
		issued,
		expires
	};
}

export function decodeSession(sessionToken: string): DecodedSession {

	if(!JWT_SECRET_KEY) 
		throw new Error("No JWT_SECRET_KEY provided");

	let result: Session;
	
	try {
		result = decode(sessionToken, JWT_SECRET_KEY, false, ALGO);
	}
	catch(e) {
		if(e instanceof Error) {

			if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
				return { type: "invalid-token" };
			}

			if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
				return { type: "integrity-error" };
			}
	
			if (e.message.indexOf("Unexpected token") === 0) {
				return { type: "invalid-token" };
			}
		}

		// ce throw sert uniquement pour pas que ca rale a la compilation mdr
		throw e;
	}

	return {
		type: "valid",
		session: result
	};
}

export function checkExpirationStatus(session: Session): ExpirationStatus {

	const now = Date.now();

	if(session.expires > now) return "active";

	const threeHoursAfterExpiration = session.expires + GRACE_TIME;

	if(threeHoursAfterExpiration > now) return "grace";

	return "expired";
}