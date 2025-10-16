import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import {
	Body,
	Emoji,
	H3,
	Li,
	Link,
	Message,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

export function DroitsRetraite() {
	const { t } = useTranslation()
	const exonérationRetraiteActive = {
		'une de ces conditions': [
			'dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité',
			'dirigeant . indépendant . PL . CNAVPL . exonération incapacité',
			'dirigeant . indépendant . PL . CIPAV . exonération incapacité',
		] as Array<DottedName>,
	}

	return (
		<Trans i18nKey="pages.simulateurs.indépendant.retraite-droits-acquis">
			<H3 as="h2">Retraite&nbsp;: droits acquis sur l'année</H3>

			<WhenApplicable dottedName="dirigeant . auto-entrepreneur . DROM">
				<Message type="info" border>
					<Body>
						Les exonérations DROM n'ont aucune incidence sur la détermination
						des droits à la retraite de base et complémentaire des
						auto-entrepreneurs
					</Body>
				</Message>
			</WhenApplicable>
			<WhenApplicable dottedName="dirigeant . exonérations . ACRE">
				<Message type="info" border>
					<Body>
						L'exonération ACRE n'a aucune incidence sur la détermination des
						droits à la retraite de base et complémentaire des
						auto-entrepreneurs
					</Body>
				</Message>
			</WhenApplicable>

			<Condition expression={exonérationRetraiteActive}>
				<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
					<Body>
						Le calcul des droits ouverts à la retraite n'est pas encore
						implémenté pour les cas incluant des exonérations de cotisations
						(pension invalidité, etc).
					</Body>
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
								expression="protection sociale . retraite . base . cotisée"
							/>
						</Li>
					</WhenNotApplicable>

					{/* Pour le moment on ne gère la retraite complémentaire des PLR que pour les AE,
							car toutes les PLR AE sont affiliées à la Cipav. Pour les PLR non-AE, il y a
							des caisses spécifiques par métier et elles ne sont pas encore implémentées. */}
					<Condition
						expression={{
							'toutes ces conditions': [
								'dirigeant . auto-entrepreneur',
								{
									'est applicable':
										'protection sociale . retraite . complémentaire . CIPAV . points acquis',
								},
							],
						}}
					>
						<Li>
							Points de retraite complémentaire acquis (Cipav)&nbsp;:{' '}
							<Value
								linkToRule
								expression="protection sociale . retraite . complémentaire . CIPAV . points acquis"
								displayedUnit={t('points')}
							/>
						</Li>
					</Condition>

					<Condition
						expression={{
							'une de ces conditions': [
								'dirigeant . auto-entrepreneur = non',
								{
									'est non applicable':
										'protection sociale . retraite . complémentaire . CIPAV . points acquis',
								},
							],
						}}
					>
						<Li>
							Points de retraite complémentaire acquis&nbsp;:{' '}
							<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
								<Value
									expression="protection sociale . retraite . complémentaire . RCI . points acquis"
									displayedUnit={t('points')}
								/>
							</WhenApplicable>
							<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI">
								<Strong>non connue</Strong>
								<WhenApplicable dottedName="dirigeant . indépendant . PL">
									<SmallBody>
										Ce simulateur ne gère pas les droits acquis de retraite
										complémentaire pour les professions libérales
									</SmallBody>
								</WhenApplicable>
							</WhenNotApplicable>
						</Li>
					</Condition>
				</Ul>
			</Condition>

			<Message type="info" border={false}>
				<Body>
					Pour estimer le montant de votre future pension de retraite, utilisez
					le{' '}
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
	)
}
