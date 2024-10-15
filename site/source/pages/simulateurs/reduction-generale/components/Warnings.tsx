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
						<Trans>
							La réduction générale n'est pas cumulable avec l'exonération Jeune
							Entreprise Innovante (JEI).
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . contrat = 'stage'">
				<Message type="info">
					<Body>
						<Trans>
							La réduction générale ne s'applique pas sur les gratifications de
							stage.
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . cotisations . exonérations . réduction générale = 0">
				<Message type="info">
					<Body>
						<Trans>
							La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.
							C'est-à-dire, pour 2024, une rémunération totale qui ne dépasse
							pas <strong>2 827,07 €</strong> bruts par mois.
						</Trans>
					</Body>
				</Message>
			</Condition>
		</>
	)
}
