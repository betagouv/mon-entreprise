import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { ChoixMultiple, Spacing } from '@/design-system'

import { Question } from '../styled-components'

export default function QuestionModesDeGarde() {
	const { set, salariéesAMA, salariéesGED } = useCMG()
	const { t } = useTranslation()

	const onChange = (modeDeGarde: string, isSelected: boolean) => {
		if (isSelected) {
			if (modeDeGarde === 'AMA' && !salariéesAMA.length) {
				set.nouvelleAMA()
			}
			if (modeDeGarde === 'GED' && !salariéesGED.length) {
				set.nouvelleGED()
			}
		} else {
			if (modeDeGarde === 'AMA') {
				set.salariéesAMA([])
			}
			if (modeDeGarde === 'GED') {
				set.salariéesGED([])
			}
		}
	}

	return (
		<>
			<Question id="modes-de-garde-label">
				{t(
					'pages.assistants.cmg.déclarations.modes-de-garde.label',
					'Indiquez le ou les modes de garde pour la période de référence mars, avril, mai 2025 :'
				)}
			</Question>

			<Spacing xxs />

			<ChoixMultiple
				options={[
					{
						id: 'AMA',
						value: !!salariéesAMA.length,
						label: t(
							'pages.assistants.cmg.déclarations.modes-de-garde.AMA.label',
							'Assistante maternelle agréée'
						),
					},
					{
						id: 'GED',
						value: !!salariéesGED.length,
						label: t(
							'pages.assistants.cmg.déclarations.modes-de-garde.GED.label',
							'Garde à domicile'
						),
					},
				]}
				onChange={onChange}
				aria={{ labelledby: 'modes-de-garde-label' }}
			/>
		</>
	)
}
