import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
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
	const nextTo = nextActivité
		? sitePaths.simulateurs.économieCollaborative.index + '/' + nextActivité
		: sitePaths.simulateurs.économieCollaborative.votreSituation
	return (
		<p css="text-align: center">
			<Button
				isDisabled={disabled}
				onPress={() => dispatch(activitéVue(activité))}
				to={nextTo}
				css={`
					margin: auto;
				`}
			>
				{nextActivité || disabled ? (
					<Trans>Continuer</Trans>
				) : (
					<Trans i18nKey="économieCollaborative.activité.voirObligations">
						Voir mes obligations
					</Trans>
				)}
			</Button>
		</p>
	)
}
