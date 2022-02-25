import { Request, Response } from "express";

export default function MethodNotAllowed(request: Request, response: Response): void {
	response.status(405).send({message: "Method not allowed"});
}