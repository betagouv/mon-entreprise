import { Trans } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Message } from '@/design-system'
import { Body } from '@/design-system/typography/paragraphs'

export default function Warnings() {
	return (
		<>
			<Condition expression="salarié . cotisations . exonérations . JEI = oui">
				<Message type="info">
					<Body>
						<Trans i18nKey="pages.simulateurs.lodeom.warnings.JEI">
							L'exonération Lodeom n'est pas cumulable avec l'exonération Jeune
							Entreprise Innovante (JEI).
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . contrat = 'stage'">
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
