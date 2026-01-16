import { ReactNode } from 'react'
import { Trans } from 'react-i18next'

import Warning from '@/components/ui/WarningBlock'
import { Body, Strong } from '@/design-system'
import { SimulateurId } from '@/hooks/useSimulatorsData'

type SimulateurWarningProps = {
	simulateur: SimulateurId
	informationsComplémentaires?: ReactNode
}

export default function SimulateurWarning({
	simulateur,
	informationsComplémentaires,
}: SimulateurWarningProps) {
	return (
		<Warning
			localStorageKey={'app::simulateurs:warning-folded:v1:' + simulateur}
		>
			{informationsComplémentaires && <>{informationsComplémentaires}</>}

			<Body>
				<Trans i18nKey="simulateurs.warning.general">
					<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à partir
					des éléments que vous avez saisis et des éléments réglementaires
					applicables, mais ils ne tiennent pas compte de l’ensemble de votre
					situation.{' '}
					<Strong>Ils ne se substituent pas aux décomptes réels</Strong> de
					l’Urssaf, de l’administration fiscale ou de tout autre organisme.
				</Trans>
			</Body>
		</Warning>
	)
}
