import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'

import { Question } from '../styled-components'

export default function AideSaisieEnfants() {
	const { t } = useTranslation()

	return (
		<>
			<StyledQuestion>
				{t(
					'pages.assistants.cmg.déclarations.aise-saisie.enfants.titre',
					'Enfants gardés'
				)}
			</StyledQuestion>
			<StyledBody>
				{t(
					'pages.assistants.cmg.déclarations.aise-saisie.enfants.contenu',
					'Indiquez le ou les enfants gardés sur ces mois de référence.'
				)}
			</StyledBody>
		</>
	)
}

const StyledQuestion = styled(Question)`
	margin: 0;
`
const StyledBody = styled(Body)`
	margin: 0;
`
