import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import {
	Body,
	Emoji,
	H2,
	H3,
	Li,
	Link,
	Message,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

export default function DroitsRetraite() {
	const { t } = useTranslation()

	const exonérationRetraiteActive = {
		'une de ces conditions': [
			'indépendant . cotisations et contributions . cotisations . exonérations . invalidité',
			'indépendant . profession libérale . CNAVPL . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<section>
			<H2>
				{t(
					'pages.simulateurs.indépendant.explications.retraite.titre',
					'Votre retraite'
				)}
			</H2>

			<Trans i18nKey="pages.simulateurs.indépendant.explications.retraite.droits">
				<H3>Droits acquis sur l'année</H3>

				<WhenApplicable dottedName="indépendant . cotisations et contributions . cotisations . exonérations . Acre">
					<Message type="info" border>
						L’exonération ACRE n’a aucune incidence sur la détermination des
						droits à la retraite de base et complémentaire.
					</Message>
				</WhenApplicable>

				<Condition expression={exonérationRetraiteActive}>
					<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
						Le calcul des droits ouverts à la retraite n’est pas encore
						implémenté pour les cas incluants des exonérations de cotisations
						(pension invalidité, etc).
					</Message>
				</Condition>

				<Condition expression={{ '=': [exonérationRetraiteActive, 'non'] }}>
					<Ul>
						<Li>
							Retraite de base&nbsp;:{' '}
							<Value
								expression="protection sociale . retraite . trimestres"
								displayedUnit={t('trimestres acquis')}
							/>
						</Li>

						<WhenApplicable dottedName="protection sociale . retraite . base . CNAVPL">
							<Li>
								Points de retraite de base acquis (CNAVPL)&nbsp;:{' '}
								<Value
									linkToRule
									expression="protection sociale . retraite . base . CNAVPL"
									displayedUnit={t('points')}
								/>
							</Li>
						</WhenApplicable>

						<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
							<Li>
								Revenu cotisé pour la retraite de base&nbsp;:{' '}
								<Value
									linkToRule
									unit="€/an"
									expression="protection sociale . retraite . base . revenu cotisé"
								/>
							</Li>
						</WhenNotApplicable>

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
								<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
									<Value
										expression="protection sociale . retraite . complémentaire . RCI . points acquis"
										displayedUnit={t('points')}
									/>
								</WhenApplicable>
								{/* Pour le moment on ne gère pas la retraite complémentaire des PLR pour
									les non AE, car il y a des caisses spécifiques par métier et elles ne
									sont pas encore implémentées. */}
								<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
									<Strong>non connue</Strong>
									<WhenApplicable dottedName="indépendant . profession libérale">
										<SmallBody>
											Ce simulateur ne gère pas les droits acquis de retraite
											complémentaire pour les professions libérales réglementées
											hors Cipav.
										</SmallBody>
									</WhenApplicable>
								</WhenNotApplicable>
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
