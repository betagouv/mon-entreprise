import classnames from 'classnames'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { activitéVue } from './actions'
import { nextActivitéSelector } from './selectors'
import { StoreContext } from './StoreContext'

type NextButtonProps = {
	activité: string
	disabled: boolean
}

export default function NextButton({ activité, disabled }: NextButtonProps) {
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
						? sitePaths.simulateurs.économieCollaborative.index +
						  '/' +
						  nextActivité
						: sitePaths.simulateurs.économieCollaborative.votreSituation
				}
			>
				{nextActivité || disabled ? (
					<Trans>Continuer</Trans>
				) : (
					<Trans i18nKey="économieCollaborative.activité.voirObligations">
						Voir mes obligations
					</Trans>
				)}
			</Link>
		</p>
	)
}
