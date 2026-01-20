export const scheduleWhenIdle = (callback: () => void) => {
	if (window.requestIdleCallback === undefined) {
		setTimeout(callback, 1)
	} else {
		requestIdleCallback(callback)
	}
}
