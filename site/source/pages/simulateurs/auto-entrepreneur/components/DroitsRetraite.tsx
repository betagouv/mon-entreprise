import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import { Body, Emoji, H2, H3, Li, Link, Message, Ul } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

export default function DroitsRetraite() {
	const { t } = useTranslation()

	const exonérationRetraiteActive = {
		'une de ces conditions': [
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . PL . CIPAV . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.auto-entrepreneur.explications.retraite.titre',
					'Votre retraite'
				)}
			</H2>

			<Trans i18nKey="pages.simulateurs.auto-entrepreneur.explications.retraite.droits">
				<H3>Droits acquis sur l'année</H3>

				<Condition expression={exonérationRetraiteActive}>
					<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
						Le calcul des droits ouverts à la retraite n’est pas encore
						implémenté pour les cas incluant une pension invalidité.
					</Message>
				</Condition>

				<Condition expression={{ '=': [exonérationRetraiteActive, 'non'] }}>
					<Condition expression="dirigeant . auto-entrepreneur . DROM">
						<Message type="info" border>
							Les exonérations DROM n’ont aucune incidence sur la détermination
							des droits à la retraite de base et complémentaire des
							auto-entrepreneurs.
						</Message>
					</Condition>

					<Condition expression="dirigeant . exonérations . ACRE">
						<Message type="info" border>
							L’exonération Acre n’a aucune incidence sur la détermination des
							droits à la retraite de base et complémentaire des
							auto-entrepreneurs.
						</Message>
					</Condition>

					<Ul>
						<Li>
							Retraite de base&nbsp;:{' '}
							<Value
								expression="protection sociale . retraite . trimestres"
								displayedUnit={t('trimestres acquis')}
							/>
						</Li>

						<Li>
							Revenu cotisé pour la retraite de base&nbsp;:{' '}
							<Value
								linkToRule
								unit="€/an"
								expression="protection sociale . retraite . base . cotisée"
							/>
						</Li>

						<WhenApplicable dottedName="protection sociale . retraite . complémentaire . CIPAV">
							<Li>
								Points de retraite complémentaire acquis (Cipav)&nbsp;:{' '}
								<Value
									linkToRule
									expression="protection sociale . retraite . complémentaire . CIPAV . points acquis"
									displayedUnit={t('points')}
								/>
							</Li>
						</WhenApplicable>

						<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . CIPAV">
							<Li>
								Points de retraite complémentaire acquis&nbsp;:{' '}
								<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
									<Value
										expression="protection sociale . retraite . complémentaire . RCI . points acquis"
										displayedUnit={t('points')}
									/>
								</WhenApplicable>
							</Li>
						</WhenNotApplicable>
					</Ul>
				</Condition>

				<Message type="info" border={false}>
					<Body>
						Pour estimer le montant de votre future pension de retraite,
						utilisez le{' '}
						<Link
							href="https://www.lassuranceretraite.fr/portail-info/hors-menu/annexe/services-en-ligne/estimation-montant-retraite.html"
							aria-label={t(
								'pages.simulateurs.indépendant.retraite.simulateur-cnav.aria-label',
								"Accéder au simulateur de l'Assurance retraite, nouvelle fenêtre"
							)}
						>
							simulateur de l'Assurance retraite
						</Link>
						.
					</Body>
				</Message>
			</Trans>
		</section>
	)
}
