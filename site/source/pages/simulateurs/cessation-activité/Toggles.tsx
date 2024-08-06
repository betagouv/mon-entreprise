import { useDispatch } from 'react-redux'

import RuleInput from '@/components/conversation/RuleInput'
import { updateSituation } from '@/store/actions/actions'

export const CessationActivitéToggles = () => {
	const dispatch = useDispatch()

	return (
		<div
			style={{
				flexShrink: 0,
				flexBasis: '100%',

				display: 'flex',
				flexDirection: 'row',
				alignItems: 'end',
				justifyContent: 'space-between',
			}}
		>
			<RuleInput
				dottedName="entreprise . date de radiation"
				onChange={(date) => {
					dispatch(updateSituation('entreprise . date de radiation', date))
				}}
			/>

			<RuleInput
				inputType="toggle"
				hideDefaultValue
				missing={false}
				dottedName="entreprise . imposition"
				onChange={(imposition) => {
					dispatch(updateSituation('entreprise . imposition', imposition))
				}}
			/>
		</div>
	)
}
