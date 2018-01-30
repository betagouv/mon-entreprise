// Thank you, github.com/ryanseddon/redux-debounced

export default () => {
	let timers = {}

	let time = 500

	let middleware = () => dispatch => action => {
		let { type } = action

		let key = type

		let shouldDebounce = key === '@@redux-form/CHANGE'

		if (key === '@@redux-form/UPDATE_SYNC_ERRORS') {
			dispatch(action)
			return clearTimeout(timers['@@redux-form/CHANGE'])
		}

		if (!shouldDebounce) return dispatch(action)

		if (timers[key]) {
			clearTimeout(timers[key])
		}

		dispatch(action)
		return new Promise(resolve => {
			timers[key] = setTimeout(() => {
				resolve(dispatch({ type: 'USER_INPUT_UPDATE' }))
			}, time)
		})
	}

	middleware._timers = timers

	return middleware
}
