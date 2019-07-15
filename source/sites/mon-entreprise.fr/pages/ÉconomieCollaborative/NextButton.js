import classnames from 'classnames'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { activitéVue } from './actions'
import { nextActivitéSelector } from './selectors'
import { StoreContext } from './StoreContext'

export default withSitePaths(function NextButton({
	activité,
	disabled,
	sitePaths
}) {
	const { state, dispatch } = useContext(StoreContext)
	const nextActivité = nextActivitéSelector(state, activité)
	return (
		<p css="text-align: center">
			<Link
				className={classnames('ui__ cta plain button', {
					disabled
				})}
				onClick={e => {
					if (disabled) {
						e.preventDefault()
					} else {
						dispatch(activitéVue(activité))
					}
				}}
				to={
					nextActivité
						? sitePaths.économieCollaborative.index + '/' + nextActivité
						: sitePaths.économieCollaborative.votreSituation
				}>
				{nextActivité || disabled ? 'Continuer' : 'Voir mes obligations'}
			</Link>
		</p>
	)
})
