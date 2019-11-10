import classnames from 'classnames'
import { T } from 'Components'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { activitéVue } from './actions'
import { nextActivitéSelector } from './selectors'
import { StoreContext } from './StoreContext'

export default function NextButton({ activité, disabled }) {
	const sitePaths = useContext(SitePathsContext)
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
				}
			>
				{nextActivité || disabled ? (
					<T>Continuer</T>
				) : (
					<T k="économieCollaborative.activité.voirObligations">
						Voir mes obligations
					</T>
				)}
			</Link>
		</p>
	)
}
