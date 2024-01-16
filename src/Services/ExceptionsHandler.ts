function captureException(error: Error) {
	console.error(error);

	if (!__DEV__) {
	}
}

export { captureException };
