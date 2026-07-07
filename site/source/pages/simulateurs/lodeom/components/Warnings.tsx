import { Trans } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Body, Message } from '@/design-system/index'

export default function Warnings() {
	return (
		<>
			<Condition expression="salarie . cotisations . exonérations . JEI = oui">
				<Message type="info">
					<Body>
						<Trans i18nKey="pages.simulateurs.lodeom.warnings.JEI">
							L'exonération Lodeom n'est pas cumulable avec l'exonération Jeune
							Entreprise Innovante (JEI).
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarie . contrat = 'stage'">
				<Message type="info">
					<Body>
						<Trans i18nKey="pages.simulateurs.lodeom.warnings.stage">
							L'exonération Lodeom ne s'applique pas sur les gratifications de
							stage.
						</Trans>
					</Body>
				</Message>
			</Condition>
		</>
	)
}
