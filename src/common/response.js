class Response {
	static unauthorized({
		msg = "Unauthorized.",
		code = 401,
		success = false,
		data = [],
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

	static successful({ msg = "", code = 200, success = true, data = [] }) {
		return {
			result: {
				message: msg,
				code: code,
				success: success,
				data: data,
			},
		};
	}
}

module.exports = { Response };