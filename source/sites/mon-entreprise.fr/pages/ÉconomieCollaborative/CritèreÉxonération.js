import { Markdown } from 'Components/utils/markdown'
import React, { useContext } from 'react'
import { CheckItem, Checklist } from 'Ui/Checklist'
import { changeCritèreÉxonération } from './actions'
import { StoreContext } from './StoreContext'

export default function CritèresExonération({ exonérations, activité }) {
	const { state, dispatch } = useContext(StoreContext)

	if (!exonérations) return null
	return (
		<div>
			{exonérations.length > 1 && (
				<p>
					Vous n'avez rien à déclarer si vous n'êtes pas dans un des cas
					suivants :{' '}
				</p>
			)}
			<Checklist
				onItemCheck={(critère, checked) =>
					dispatch(changeCritèreÉxonération(activité, critère, checked))
				}
				defaultCheck={state[activité].critèresÉxonération}>
				{exonérations.map(({ titre, explication }) => (
					<CheckItem
						key={titre}
						name={titre}
						title={titre}
						explanations={<Markdown source={explication} />}
					/>
				))}
			</Checklist>
		</div>
	)
}
