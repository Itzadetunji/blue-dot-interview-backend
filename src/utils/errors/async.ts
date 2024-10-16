export const asyncErr = (fn: Function) => {
	//Returns a function that returns the intended function which accesses the function parameters by virtue of closure
	return (req: unknown, res: unknown, next: unknown) => {
		fn(req, res, next).catch(next);
	};
};
