import { Response, NextFunction, Request } from "express";
import InvalidTokenError from "../types/errors/InvalidTokenError";
import { checkExpirationStatus, decodeSession, encodeSession } from "../utils/Token";
import { DecodedSession, ExpirationStatus, Session } from "../types/utils/Session";
import { User } from "../models/User";

export async function JWTVerification(request: Request, response: Response, next: NextFunction) {

	const requestHeader = "Authorization";
	const responseHeader = "X-Renewed-JWT-Token";

	const header = request.header(requestHeader);

	if(!header) {
		next({ code: 401, message: `Required ${requestHeader} header not found`, name: "InvalidTokenError" } as InvalidTokenError);
		return;
	}

	const token: string = header.split(" ")[1];

	const decodedSession: DecodedSession = decodeSession(token);

	if(decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
		next({ code: 401, message: `Failed to decode or validate authorization token (Reason : ${decodedSession.type})`, name: "InvalidTokenError" } as InvalidTokenError);
		return;
	}

	const expiration: ExpirationStatus = checkExpirationStatus(decodedSession.session);

	if(expiration === "expired") {
		next({ code: 401, message: "Authorization token has expired. Please create another token", name: "InvalidTokenError" } as InvalidTokenError);
		return;
	}

	const session: Session = decodedSession.session;

	// on renouvelle le token
	if(expiration === "grace") {
		const encodedSession = encodeSession({ 
			id: decodedSession.session.id,
			username: decodedSession.session.username,
			dateCreated: Date.now()
		});

		response.setHeader(responseHeader, encodedSession.token);

		session.issued = encodedSession.issued;
		session.expires = encodedSession.expires;
	}

	const user = await User.findByPk(session.id);

	if(!user) {
		next({ code: 401, message: "No user with this token", name: "InvalidTokenError" } as InvalidTokenError);
		return;
	}

	response.locals = {
		...response.locals,
		session,
		user
	};

	next();
}