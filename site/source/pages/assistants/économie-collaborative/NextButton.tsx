import { useContext } from 'react'
import { Trans } from 'react-i18next'

import { Button } from '@/design-system/buttons'
import { useSitePaths } from '@/sitePaths'

import { activitéVue } from './actions'
import { nextActivitéSelector } from './selectors'
import { StoreContext } from './StoreContext'

type NextButtonProps = {
	activité: string
	disabled: boolean
}

export default function NextButton({ activité, disabled }: NextButtonProps) {
	const { absoluteSitePaths } = useSitePaths()
	const { state, dispatch } = useContext(StoreContext)
	const nextActivité = state && nextActivitéSelector(state, activité)
	const nextTo = nextActivité
		? absoluteSitePaths.assistants.économieCollaborative.index +
		  '/' +
		  nextActivité
		: absoluteSitePaths.assistants.économieCollaborative.votreSituation

	return (
		<p css="text-align: center">
			<Button
				isDisabled={disabled}
				onPress={() => dispatch?.(activitéVue(activité))}
				to={nextTo}
				style={{
					margin: 'auto',
				}}
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
