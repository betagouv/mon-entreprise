import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import {
	Accordion,
	Body,
	Container,
	Emoji,
	ExternalLinkIcon,
	H2,
	H4,
	HelpButtonWithPopover,
	Item,
	Li,
	Link,
	Message,
	PlusCircleIcon,
	Strong,
	StyledLink,
	Ul,
} from '@/design-system'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'

import DetailsRowCards from './DetailsRowCards'
import ItemTitle from './ItemTitle'
import RevenuTable from './RevenuTable'
import WarningTooltip from './WarningTooltip'

const Détails = ({
	namedEngines,
	expandRevenuSection = false,
}: {
	namedEngines: EngineComparison
	expandRevenuSection?: boolean
}) => {
	const régimeTIComparé = namedEngines.some(
		(namedEngine) => namedEngine.name === 'EI' || namedEngine.name === 'EURL'
	)
	const { t } = useTranslation()

	return (
		<Container
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[800]
					: theme.colors.bases.primary[200]
			}
		>
			{régimeTIComparé && (
				<StyledMessage type="error">
					<Body>
						<Emoji emoji="⚠️" />{' '}
						<Strong>
							<Trans i18nKey="pages.simulateurs.comparaison-statuts.warning.réforme.texte">
								La{' '}
								<Link
									href="https://www.urssaf.fr/accueil/independant/comprendre-payer-cotisations/reforme-cotisations-independants.html"
									aria-label={t(
										'pages.simulateurs.comparaison-statuts.warning.réforme.aria-label',
										'Lire la page dédiée à la réforme de l’assiette et du barème des cotisations sur le site de l’Urssaf, nouvelle fenêtre'
									)}
								>
									réforme de l’assiette et du barème des cotisations
								</Link>{' '}
								n'est pas encore implémentée sur ce comparateur.
							</Trans>
						</Strong>
					</Body>
				</StyledMessage>
			)}

			<Accordion
				variant="light"
				defaultExpandedKeys={expandRevenuSection ? ['revenus'] : []}
				title={
					<H2>
						{t(
							'pages.simulateurs.comparaison-statuts.accordion-title',
							'Comparer...'
						)}
					</H2>
				}
				isFoldable
			>
				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.revenus.title',
								'Vos revenus'
							)}
							&nbsp;
							<Emoji emoji="🤑" />
						</ItemTitle>
					}
					key="revenus"
					hasChildItems={false}
				>
					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.revenus.h4',
							'Revenu net mensuel après impôts'
						)}

						<HelpButtonWithPopover
							type="info"
							bigPopover
							title={t(
								'pages.simulateurs.comparaison-statuts.items.revenus.button-title',
								'Calculer vos revenus'
							)}
						>
							<RevenuTable namedEngines={namedEngines} />
						</HelpButtonWithPopover>
					</StyledH4>
					<DetailsRowCards
						dottedName="dirigeant . rémunération . net . après impôt"
						namedEngines={namedEngines}
						unit="€/mois"
						footer={(engine) => (
							<Condition
								expression={{
									'est défini': 'dirigeant . rémunération . net . après impôt',
								}}
								engine={engine}
							>
								<Ul>
									<Li>
										<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.1">
											Soit{' '}
											<Strong>
												<Value
													engine={engine}
													expression="dirigeant . rémunération . net"
													displayedUnit="€"
													unit="€/mois"
													precision={0}
													linkToRule={false}
												/>
											</Strong>{' '}
											avant impôts
										</Trans>
									</Li>{' '}
									<Condition
										engine={engine}
										expression="dirigeant . rémunération . totale > 0"
									>
										<Li>
											<Condition
												engine={engine}
												expression="dirigeant . auto-entrepreneur"
											>
												<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.2">
													Avec{' '}
													<Strong>
														<Value
															engine={engine}
															expression="dirigeant . rémunération . cotisations / entreprise . chiffre d'affaires"
															unit="%"
															precision={0}
															linkToRule={false}
														/>
													</Strong>{' '}
													de cotisations sociales sur le chiffre d’affaires
													(soit{' '}
													<Strong>
														<Value
															engine={engine}
															expression="dirigeant . rémunération . cotisations / dirigeant . rémunération . totale"
															unit="%"
															precision={0}
															linkToRule={false}
														/>
													</Strong>{' '}
													du bénéfice)
												</Trans>
											</Condition>
											<Condition
												engine={engine}
												expression={{
													'=': ['dirigeant . auto-entrepreneur', 'non'],
												}}
											>
												<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.détails.3">
													Avec{' '}
													<Strong>
														<Value
															engine={engine}
															expression="dirigeant . rémunération . cotisations / dirigeant . rémunération . totale"
															unit="%"
															precision={0}
															linkToRule={false}
														/>
													</Strong>{' '}
													de cotisations sociales sur le bénéfice
												</Trans>
											</Condition>
										</Li>
									</Condition>
								</Ul>
							</Condition>
						)}
						warning={(engine) => (
							<Condition
								engine={engine}
								expression={{
									et: [
										'entreprise . catégorie juridique . EI . auto-entrepreneur',
										"entreprise . chiffre d'affaires . seuil micro . dépassé",
									],
								}}
							>
								<WarningTooltip
									tooltip={
										<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.revenus.warning">
											Vous allez dépasser le plafond de la micro-entreprise{' '}
											<span>
												(
												<Value
													linkToRule={false}
													displayedUnit="€"
													expression={
														String(
															engine.evaluate('entreprise . activité . nature')
																.nodeValue
														) === 'libérale' ||
														String(
															engine.evaluate(
																'entreprise . activités . service ou vente'
															).nodeValue
														) === 'service'
															? "entreprise . chiffre d'affaires . seuil micro . libérale"
															: "entreprise . chiffre d'affaires . seuil micro . total"
													}
												/>{' '}
												de chiffre d’affaires).
											</span>
										</Trans>
									}
								/>
							</Condition>
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.retraite.title',
								'Vos droits pour la retraite'
							)}
							&nbsp;
							<Emoji emoji="🧐" />
						</ItemTitle>
					}
					key="retraite"
					hasChildItems={false}
				>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.body">
							Le montant de votre retraite est constitué de{' '}
							<Strong>
								votre retraite de base + votre retraite complémentaire
							</Strong>
							.
						</Trans>
					</Body>
					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.retraite.base.h4',
							'Retraite de base'
						)}
						<ExplicableRule dottedName="protection sociale . retraite . base" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.base.body">
							La pension calculée correspond à celle de{' '}
							<Strong>vos 25 meilleures années</Strong>, en considérant que vous
							avez cotisé suffisamment de trimestres (4 trimestres par an) et
							que vous partez en retraite à l’âge requis pour obtenir un taux
							plein.
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . retraite . base"
						namedEngines={namedEngines}
						unit="€/mois"
						evolutionLabel={t(
							'pages.simulateurs.comparaison-statuts.items.retraite.base.evolution-label',
							'avec un taux plein'
						)}
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.h4',
							'Retraite complémentaire'
						)}
						<ExplicableRule dottedName="protection sociale . retraite . complémentaire" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.body">
							Tous les ans, selon votre rémunération,{' '}
							<Strong>
								vous gagnez des points qui constituent votre pension de retraite
								complémentaire
							</Strong>
							. En fin de carrière, vos points sont transformés en{' '}
							<Strong>
								un montant qui s’ajoute chaque mois à votre retraite de base
							</Strong>
							. Cette valeur se calcule sur le long terme. Par exemple, au bout
							de 10 ans, vous auriez droit à :
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . retraite . complémentaire"
						namedEngines={namedEngines}
						unit="€/mois"
						evolutionLabel={t(
							'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.evolution-label',
							'au bout de 10 ans'
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.santé.title',
								'Vos prestations santé'
							)}
							&nbsp;
							<Emoji emoji="😷" />
						</ItemTitle>
					}
					key="santé"
					hasChildItems={false}
				>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.body">
						<BodyNoBottomMargin>
							Tous les statuts vous ouvrent le droit au{' '}
							<Strong>remboursement des soins.</Strong>
						</BodyNoBottomMargin>
						<BodyNoMargin>
							Pour tous les statuts, il est conseillé de souscrire à une{' '}
							<Strong>prévoyance complémentaire (mutuelle)</Strong> pour
							améliorer le remboursement des frais de santé.
						</BodyNoMargin>
					</Trans>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.santé.arrêt.h4',
							'Arrêt maladie'
						)}
						<ExplicableRule dottedName="protection sociale . maladie . arrêt maladie" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.body">
							Pour tous les statuts, vous aurez un{' '}
							<Strong>délai de carence de 3 jours</Strong>. En cas d’arrêt
							maladie, l’assurance maladie vous versera :
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . arrêt maladie"
						namedEngines={namedEngines}
						unit="€/jour"
						warning={(engine) => (
							<Condition
								engine={engine}
								expression="protection sociale . maladie . arrêt maladie = 0"
							>
								<WarningTooltip
									tooltip={
										<span
											style={{
												fontWeight: 'normal',
											}}
										>
											<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.warning">
												Votre <Strong>rémunération</Strong> est{' '}
												<Strong>trop faible</Strong> pour bénéficier d’arrêt
												maladie.
											</Trans>
										</span>
									}
								/>
							</Condition>
						)}
						footer={(engine) => (
							<Condition
								engine={engine}
								expression="protection sociale . maladie . arrêt maladie != 0"
							>
								<StyledDiv>
									<PlusCircleIcon
										style={{
											marginTop: '0 !important',
										}}
									/>
									<Body
										style={{
											margin: '0',
										}}
									>
										<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.arrêt.footer">
											Pour y prétendre, vous devez avoir cotisé au moins{' '}
											<Strong>
												<Value
													engine={engine}
													expression="protection sociale . maladie . arrêt maladie . délai d'attente"
												/>
											</Strong>
										</Trans>
									</Body>
								</StyledDiv>
							</Condition>
						)}
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.santé.atmp.h4',
							'Accident du travail et maladie professionnelle'
						)}
						<ExplicableRule dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.santé.atmp.body">
							En cas d’<Strong>accident du travail</Strong>, de{' '}
							<Strong>maladie professionnelle</Strong> ou d’un{' '}
							<Strong>accident sur le trajet domicile-travail</Strong>, vous
							recevrez une indemnisation de&nbsp;:
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités"
						namedEngines={namedEngines}
						unit="€/mois"
						evolutionDottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour"
						evolutionLabel={t(
							'pages.simulateurs.comparaison-statuts.items.santé.atmp.evolution-label',
							'à partir du 29ème jour'
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.parentalité.title',
								'La maternité, paternité et adoption'
							)}
							&nbsp;
							<Emoji emoji="🤗" />
						</ItemTitle>
					}
					key="enfants"
					hasChildItems={false}
				>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.body">
						<BodyNoBottomMargin>
							Tous les statuts vous ouvrent le droit aux{' '}
							<Strong>indemnités journalières</Strong> de congé maternité,
							paternité, adoption.
						</BodyNoBottomMargin>
						<BodyNoTopMargin>
							Pour y prétendre, vous devez avoir cotisé{' '}
							<Strong>au moins 6 mois</Strong>.
						</BodyNoTopMargin>
					</Trans>

					<DetailsRowCards
						dottedName="protection sociale . maladie . maternité paternité adoption"
						namedEngines={namedEngines}
						unit="€/jour"
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.h4',
							'Maternité'
						)}
						<ExplicableRule dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.maternité.body">
							En plus des indemnités journalières, vous pouvez aussi prétendre à
							une{' '}
							<Strong>
								allocation forfaitaire de repos maternel supplémentaire
							</Strong>
							.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel"
						namedEngines={namedEngines}
						label={t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.maternité.label',
							'versés en deux fois'
						)}
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.h4',
							'Adoption'
						)}
						<ExplicableRule dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.parentalité.adoption.body">
							En plus des indemnités journalières, vous pouvez aussi prétendre à
							une{' '}
							<Strong>
								allocation forfaitaire de repos parental supplémentaire
							</Strong>
							.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption"
						namedEngines={namedEngines}
						label={t(
							'pages.simulateurs.comparaison-statuts.items.parentalité.adoption.label',
							'versés en une fois'
						)}
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.prévoyance.title',
								'Votre couverture invalidité et décès'
							)}
							&nbsp;
							<Emoji emoji="🤕" />
						</ItemTitle>
					}
					key="maladie"
					hasChildItems={false}
				>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.body">
							Tous les statuts cotisent pour une{' '}
							<Strong>pension invalidité-décès</Strong> qui vous{' '}
							<Strong>protège en cas d’invalidité</Strong> et assure à vos
							proches une{' '}
							<Strong>
								pension de réversion et un capital en cas de décès
							</Strong>
							.
						</Trans>
					</Body>
					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.h4',
							'Invalidité'
						)}
						<ExplicableRule dottedName="protection sociale . invalidité et décès" />
					</StyledH4>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.body.1">
						<BodyNoMargin>
							Vous pouvez bénéficier d’une pension invalidité{' '}
							<Strong>
								en cas de maladie ou d’accident conduisant à une incapacité à
								poursuivre votre activité professionnelle
							</Strong>
							.
						</BodyNoMargin>
						<BodyNoTopMargin
							style={{
								marginBottom: '1rem',
							}}
						>
							Pour y prétendre, vous devez respecter{' '}
							<BlackColoredLink href="https://www.service-public.fr/particuliers/vosdroits/F672">
								certaines règles
								<StyledExternalLinkIcon />
							</BlackColoredLink>
							.
						</BodyNoTopMargin>
					</Trans>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . pension invalidité . invalidité partielle"
						evolutionDottedName="protection sociale . invalidité et décès . pension invalidité . invalidité totale"
						namedEngines={namedEngines}
						unit="€/mois"
						label={
							<span style={{ fontSize: '1rem' }}>
								{t(
									'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.label',
									'(invalidité partielle)'
								)}
							</span>
						}
						evolutionLabel={
							<span style={{ fontSize: '0.75rem' }}>
								{t(
									'pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.evolution-label',
									'(invalidité totale)'
								)}
							</span>
						}
					/>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.invalidité.body.2">
							Pour une invalidité causée par un{' '}
							<Strong>accident professionnel</Strong>, vous pouvez bénéficier
							d’une <Strong>rente d’incapacité</Strong>.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité"
						namedEngines={namedEngines}
						unit="€/mois"
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.h4',
							'Décès'
						)}
						<ExplicableRule dottedName="protection sociale . invalidité et décès . capital décès" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.décès.body.1">
							La Sécurité Sociale garantit un{' '}
							<Strong>capital décès pour vos ayants droits</Strong> (personnes
							qui sont à votre charge) sous certaines conditions.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . capital décès"
						label={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.label.1',
							'pour vos proches'
						)}
						namedEngines={namedEngines}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.décès.body.2">
							En plus du capital décès, une{' '}
							<Strong>pension de réversion</Strong> peut être versée à votre
							conjoint/conjointe. Elle correspond aux{' '}
							<Strong>droits à la retraite que vous aurez acquis</Strong> durant
							sa vie professionnelle.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . pension de reversion"
						label={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.label.2',
							'maximum'
						)}
						namedEngines={namedEngines}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.décès.body.3">
							Pour un décès survenu dans le cadre d’un{' '}
							<Strong>accident professionnel</Strong>, votre conjoint/conjointe
							peut bénéficier d’une <Strong>rente de décès</Strong>.
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
						namedEngines={namedEngines}
						unit="€/mois"
						label={t(
							'pages.simulateurs.comparaison-statuts.items.prévoyance.décès.label.3',
							'en cas d’accident professionnel'
						)}
					/>

					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.prévoyance.décès.body.4">
							En cas de décès, un <Strong>capital « orphelin »</Strong> est
							versé à<Strong> vos enfants</Strong>, sous certaines conditions.
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . capital décès . orphelin"
						namedEngines={namedEngines}
						unit="€/enfant"
					/>
				</Item>

				<Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.gestion.title',
								'La gestion juridique et comptable'
							)}
							&nbsp;
							<Emoji emoji="🤓" />
						</ItemTitle>
					}
					key="administratif"
					hasChildItems={false}
				>
					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.création.h4',
							'Coût de création'
						)}
						<ExplicableRule dottedName="entreprise . coût formalités . création" />
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.création.body">
							Les formalités de création d’une entreprise diffèrent selon les
							statuts et la nature de l’activité. Le calcul se concentre ici sur
							les <Strong>procédures obligatoires</Strong> (immatriculation,
							annonces légales, rédaction des statuts...).
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="entreprise . coût formalités . création"
						namedEngines={namedEngines}
						displayedUnit="€ HT"
					/>

					<StyledH4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.conjoint.h4',
							'Statut du conjoint / de la conjointe'
						)}
					</StyledH4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.conjoint.body">
							Vous êtes marié/mariée, pacsé/pacsée ou en union libre&nbsp;: il
							existe <Strong>3 statuts possibles</Strong> pour votre
							conjoint/conjointe (<Strong>collaborateur/collaboratrice</Strong>,{' '}
							<Strong>associé/associée</Strong> ou{' '}
							<Strong>salarié/salariée</Strong>).
						</Trans>
					</Body>

					<DetailsRowCards
						expression={{
							variations: [
								{
									si: 'entreprise . catégorie juridique . EI . auto-entrepreneur',
									alors: '"Conjoint collaborateur / Conjointe collaboratrice"',
								},
								{
									si: 'entreprise . catégorie juridique . EI',
									alors:
										'"Conjoint collaborateur ou salarié / Conjointe collaboratrice ou salariée"',
								},
								{
									si: {
										'une de ces conditions': [
											'entreprise . catégorie juridique . SARL',
											'entreprise . catégorie juridique . SELARL',
										],
									},
									alors:
										'"Conjoint collaborateur, associé ou salarié / Conjointe collaboratrice, associée ou salariée"',
								},
								{
									sinon:
										'"Conjoint associé ou salarié / Conjointe associée ou salariée"',
								},
							],
						}}
						namedEngines={namedEngines}
					/>
				</Item>
			</Accordion>
		</Container>
	)
}

const StyledMessage = styled(Message)`
	margin-top: ${({ theme }) => theme.spacings.xl};
	margin-bottom: -${({ theme }) => theme.spacings.md};
`
const StyledH4 = styled(H4)`
	color: ${({ theme }) => theme.colors.bases.primary[600]};
`

const StyledDiv = styled.div`
	display: flex;

	svg {
		width: 2.5rem;
		margin-right: 1rem;
		margin-top: 1rem;
	}
`

const BodyNoBottomMargin = styled(Body)`
	margin-bottom: 0;
`
const BodyNoTopMargin = styled(Body)`
	margin-top: 0;
`
const BodyNoMargin = styled(Body)`
	margin: 0;
`

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
	margin-left: 0.25rem;
`

const BlackColoredLink = styled(StyledLink)`
	color: ${({ theme }) => theme.colors.extended.grey[800]};
`

export default Détails
