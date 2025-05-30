import { Trans } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Body, Message } from '@/design-system'

export default function Warnings() {
	return (
		<>
			<Condition expression="salarié . cotisations . exonérations . JEI = oui">
				<Message type="info">
					<Body>
						<Trans i18nKey="pages.simulateurs.réduction-générale.warnings.JEI">
							La réduction générale n'est pas cumulable avec l'exonération Jeune
							Entreprise Innovante (JEI).
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . contrat = 'stage'">
				<Message type="info">
					<Body>
						<Trans i18nKey="pages.simulateurs.réduction-générale.warnings.stage">
							La réduction générale ne s'applique pas sur les gratifications de
							stage.
						</Trans>
					</Body>
				</Message>
			</Condition>
		</>
	)
}
