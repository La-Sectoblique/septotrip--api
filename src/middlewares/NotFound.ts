import { Request, Response } from "express";

export default function NotFoundMiddleware(request: Request, response: Response): void {
	response.status(400).json({message: "Route not found"});
}