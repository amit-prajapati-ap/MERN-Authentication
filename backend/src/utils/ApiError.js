class ApiError {
    constructor(statusCode, message = "Something went wrong", errors = []) {
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = statusCode < 400;
        this.message = message
    }
}

export { ApiError };