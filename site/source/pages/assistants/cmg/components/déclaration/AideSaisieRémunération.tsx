import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Strong } from '@/design-system'

import { Question } from '../styled-components'

export default function AideSaisieRémunération() {
	const { t } = useTranslation()

	return (
		<>
			<StyledQuestion>
				{t(
					'pages.assistants.cmg.déclarations.aise-saisie.rémunération.titre',
					'Rémunération totale'
				)}
			</StyledQuestion>
			<StyledBody>
				<Trans i18nKey="pages.assistants.cmg.déclarations.aise-saisie.rémunération.contenu">
					<Strong>Où trouver l’information&nbsp;?</Strong>
					<br />
					sur le relevé mensuel
					<br />
					<Strong>Montant attendu&nbsp;:</Strong>
					<br />
					Montant du salaire (dont indemnités et acompte).
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
