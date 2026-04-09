import { useTranslation } from 'react-i18next'

import { SimpleField } from '@/components/Simulation/SimpleField'
import { RuleSwitchLabel, SwitchContainer } from '@/components/Switch'

export const RégimeImpositionQuestion = () => {
	const { t } = useTranslation()

	return (
		<SwitchContainer isRule>
			<SimpleField
				dottedName="entreprise . imposition"
				question={t(
					'pages.simulateurs.cessation-activité.régime-imposition.question',
					"Quel est votre régime d'imposition ?"
				)}
				labelStyle={RuleSwitchLabel}
			/>
		</SwitchContainer>
	)
}
