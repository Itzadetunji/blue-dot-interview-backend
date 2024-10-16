class customErr extends Error {
	statusCode: number;
	status: string | number;
	isPredictable: boolean;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isPredictable = true; //Errors that arise from anticipated user actions

		Error.captureStackTrace(this, this.constructor);
	}
}

export default customErr;
