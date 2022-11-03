import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateShouldFocusField } from '@/actions/actions'
import { shouldFocusFieldSelector } from '@/selectors/simulationSelectors'

export const useShouldFocusField = () => {
	const dispatch = useDispatch()
	const shouldFocusField = useSelector(shouldFocusFieldSelector)

	useEffect(() => {
		setTimeout(() => {
			dispatch(updateShouldFocusField(false))
		}, 0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return shouldFocusField
}
