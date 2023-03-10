class Response {
    static unauthorized({
        msg = "Unauthorized.",
        code = 401,
        success = false,
        data = null,
    }) {
        return {
            result: {
                message: msg,
                code: code,
                success: success,
                data: data,
            },
        };
    }
    static forbidden({
        msg = "Forbidden.",
        code = 403,
        success = false,
        data = null,
    }) {
        return {
            result: {
                message: msg,
                code: code,
                success: success,
                data: data,
            },
        };
    }
    static badRequest({
        msg = "Bad Request.",
        code = 400,
        success = false,
        data = null,
    }) {
        return {
            result: {
                message: msg,
                code: code,
                success: success,
                data: data,
            },
        };
    }
    static successful({
        msg = "success",
        code = 200,
        success = true,
        data = null,
    }) {
        return {
            result: {
                message: msg,
                code: code,
                success: success,
                data: data,
            },
        };
    }
    static unknown() {
        return {
            result: {
                message: "unknown error!",
                code: 500,
                success: false,
                data: null,
            },
        };
    }
}

module.exports = { Response };
