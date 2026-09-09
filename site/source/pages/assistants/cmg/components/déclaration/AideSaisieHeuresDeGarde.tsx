import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Strong } from '@/design-system'

import { Question } from '../styled-components'

export default function AideSaisieHeuresDeGarde() {
	const { t } = useTranslation()

	return (
		<>
			<StyledQuestion>
				{t(
					'pages.assistants.cmg.déclarations.aise-saisie.heures-de-garde.titre',
					'Nombre d’heures de garde'
				)}
			</StyledQuestion>
			<StyledBody>
				<Trans i18nKey="pages.assistants.cmg.déclarations.aise-saisie.heures-de-garde.contenu">
					<Strong>Où trouver l’information&nbsp;?</Strong>
					<br />
					sur le bulletin de salaire
					<br />
					<Strong>Montant attendu&nbsp;:</Strong>
					<br />
					Somme du nombre d’heures normales + nombre d’heures complémentaires ou
					majorées.
				</Trans>
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
