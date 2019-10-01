let initialState = {
	scenario: 'B'
}

let reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SCENARIO':
			return {
				...state,
				scenario: action.scenario
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
