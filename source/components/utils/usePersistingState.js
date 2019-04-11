import { useState } from 'react'
import safeLocalStorage from '../../storage/safeLocalStorage'
export default function usePersistingState(key, defaultState) {
	const [initialRender, setInitialRender] = useState(true)
	let initialState = defaultState
	if (initialRender) {
		const savedState = JSON.parse(safeLocalStorage.getItem(key))
		if (savedState !== undefined) {
			initialState = savedState
		}
		setInitialRender(false)
	}
	const [state, setState] = useState(initialState)
	const saveState = newState => {
		safeLocalStorage.setItem(key, JSON.stringify(newState))
		setState(newState)
	}
	return [state, saveState]
}
