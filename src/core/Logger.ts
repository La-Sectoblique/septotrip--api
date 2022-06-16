enum LogLevel {
	DEBUG = "DEBUG",
	INFO = "INFO",
	WARN = "WARN",
	ERROR = "ERROR",
	FATAL = "FATAL"
}

export class Logger {

	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

	private write(log: string, level: LogLevel, logfunction: (log: string) => void): void {
		const date = new Date().toISOString();
		const pref = "[" + date + "][" + this.name + "][" + level + "] ";
		
		for(const line of log.split("\n")) {
			logfunction(pref.concat(line));
		}
	}

	debug(message: string): void {

		if(process.env.NODE_ENV === "development") {
			this.write(message, LogLevel.DEBUG, console.info);
		}
	}

	info(message: string): void {
		this.write(message, LogLevel.INFO, console.info);
	}

	warn(message: string): void {
		this.write(message, LogLevel.WARN, console.warn);
	}

	error(message: string, error: Error | null): void {
		this.write(message, LogLevel.ERROR, console.error);
		if(error && error.stack) {
			this.write(error.stack, LogLevel.ERROR, console.error);
		}
	}

	fatal(message: string, error: Error | null, code: number | null): void {
		this.write(message, LogLevel.FATAL, console.error);
		if(error && error.stack) {
			this.write(error.stack, LogLevel.FATAL, console.error);
		}
		process.exit( code ?? -1 );
	}

}

interface LoggersCollection {
	[key: string]: Logger
}

export default class Loggers {

	static loggers: LoggersCollection = {};

	static getLogger(name: string): Logger {
		if( !Loggers.loggers[name] )
			Loggers.loggers[name] = new Logger(name);

		return Loggers.loggers[name];
	}
}