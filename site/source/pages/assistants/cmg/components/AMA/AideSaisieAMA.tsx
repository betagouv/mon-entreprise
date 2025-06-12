import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system'

import AideSaisieCMG from '../déclaration/AideSaisieCMG'
import AideSaisieHeuresDeGarde from '../déclaration/AideSaisieHeuresDeGarde'
import AideSaisieRémunération from '../déclaration/AideSaisieRémunération'
import { Question } from '../styled-components'

export default function AideSaisieAMA() {
	const { t } = useTranslation()

	return (
		<Container>
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
			<AideSaisieHeuresDeGarde />
			<AideSaisieRémunération />
			<AideSaisieCMG />
		</Container>
	)
}

const Container = styled.div`
	max-width: 25%;
`
const StyledQuestion = styled(Question)`
	margin-top: 0;
`
const StyledBody = styled(Body)`
	margin-top: 0;
`
