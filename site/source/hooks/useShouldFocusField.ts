import { updateShouldFocusField } from '@/actions/actions'
import { shouldFocusFieldSelector } from '@/selectors/simulationSelectors'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
