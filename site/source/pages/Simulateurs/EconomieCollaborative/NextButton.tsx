import { useContext } from 'react'
import { Trans } from 'react-i18next'

import { Button } from '@/design-system/buttons'
import { useSitePaths } from '@/sitePaths'

import { StoreContext } from './StoreContext'
import { activitéVue } from './actions'
import { nextActivitéSelector } from './selectors'

type NextButtonProps = {
	activité: string
	disabled: boolean
}

export default function NextButton({ activité, disabled }: NextButtonProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { state, dispatch } = useContext(StoreContext)
	const nextActivité = nextActivitéSelector(state, activité)
	const nextTo = nextActivité
		? absoluteSitePaths.simulateurs.économieCollaborative.index +
		  '/' +
		  nextActivité
		: absoluteSitePaths.simulateurs.économieCollaborative.votreSituation

	return (
		<p css="text-align: center">
			<Button
				isDisabled={disabled}
				onPress={() => dispatch?.(activitéVue(activité))}
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
