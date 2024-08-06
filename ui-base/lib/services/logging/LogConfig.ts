enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}

class Logger {
    private loggerName: string;
    private logLevel: LogLevel;

    constructor(loggerName: string) {
        this.loggerName = loggerName;

        switch (process.env.NEXT_PUBLIC_LOG_LEVEL) {
            case "trace":
                this.logLevel = LogLevel.Trace;
                break;
            case "debug":
                this.logLevel = LogLevel.Debug;
                break;
            case "info":
                this.logLevel = LogLevel.Info;
                break;
            default:
                this.logLevel = LogLevel.Info;
                break;
        }
    }

    trace(...message: unknown[]) {
        this.log(LogLevel.Trace, ...message);
    }

    debug(...message: unknown[]) {
        this.log(LogLevel.Debug, ...message);
    }

    info(...message: unknown[]) {
        this.log(LogLevel.Info, ...message);
    }

    warn(...message: unknown[]) {
        this.log(LogLevel.Warn, ...message);
    }

    error(...message: unknown[]) {
        this.log(LogLevel.Error, ...message);
    }

    private log(level: LogLevel, ...message: unknown[]) {
        if (level >= this.logLevel) {
            console.log(`[${LogLevel[level]}] [${this.loggerName}]`, ...message);
        }
    }
}

export const getLogger = (loggerName: string) => {
    return new Logger(loggerName);
};