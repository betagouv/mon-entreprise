import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg/index'
import { ChoixMultiple, Spacing } from '@/design-system/index'

import { Question } from '../styled-components'

export default function QuestionModesDeGarde() {
	const { set, salarieesAMA, salarieesGED } = useCMG()
	const { t } = useTranslation()

	const onChange = (modeDeGarde: string, isSelected: boolean) => {
		if (isSelected) {
			if (modeDeGarde === 'AMA' && !salarieesAMA.length) {
				set.nouvelleAMA()
			}
			if (modeDeGarde === 'GED' && !salarieesGED.length) {
				set.nouvelleGED()
			}
		} else {
			if (modeDeGarde === 'AMA') {
				set.salarieesAMA([])
			}
			if (modeDeGarde === 'GED') {
				set.salarieesGED([])
			}
		}
	}

	return (
		<>
			<Question id="modes-de-garde-label">
				{t(
					'pages.assistants.cmg.declarations.modes-de-garde.label',
					'Indiquez le ou les modes de garde pour la période de référence mars, avril, mai 2025 :'
				)}
			</Question>

			<Spacing xxs />

			<ChoixMultiple
				options={[
					{
						id: 'AMA',
						value: !!salarieesAMA.length,
						label: t(
							'pages.assistants.cmg.declarations.modes-de-garde.AMA.label',
							'Assistante maternelle agréée'
						),
					},
					{
						id: 'GED',
						value: !!salarieesGED.length,
						label: t(
							'pages.assistants.cmg.declarations.modes-de-garde.GED.label',
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
