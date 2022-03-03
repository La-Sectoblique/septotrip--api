import { Response, NextFunction, Request } from "express";
import InvalidTokenError from "../types/errors/InvalidTokenError";
import { checkExpirationStatus, decodeSession, encodeSession } from "../utils/Token";
import { DecodedSession, ExpirationStatus, Session } from "../types/utils/Session";

export function JWTVerification(request: Request, response: Response, next: NextFunction): void {

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

	let session: Session;

	// on renouvelle le token
	if(expiration === "grace") {
		const { token, expires, issued } = encodeSession(decodedSession.session);
		session = {
			...decodedSession.session,
			expires,
			issued
		};

		response.setHeader(responseHeader, token);
	}
	else {
		session = decodedSession.session;
	}

	response.locals = {
		...response.locals,
		session
	};

	next();
}