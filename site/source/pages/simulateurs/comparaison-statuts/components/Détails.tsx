import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value, { Condition } from '@/components/EngineValue'
import { Accordion, Item } from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { ExternalLinkIcon, PlusCircleIcon } from '@/design-system/icons'
import { Container } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H4 } from '@/design-system/typography/heading'
import { StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

import { EngineComparison } from './Comparateur'
import DetailsRowCards from './DetailsRowCards'
import ItemTitle from './ItemTitle'
import RevenuTable from './RevenuTable'
import WarningTooltip from './WarningTooltip'

const Détails = ({ namedEngines }: { namedEngines: EngineComparison }) => {
	const { t } = useTranslation()

	return (
		<StyledContainer
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[800]
					: theme.colors.bases.primary[200]
			}
		>
			<Accordion
				variant="light"
				title={
					<H2>
						<Trans>Zoom sur...</Trans>
					</H2>
				}
				isFoldable
			>
				<Item
					title={
						<ItemTitle>
							<Trans>Vos revenus</Trans> <Emoji emoji="🤑" />
						</ItemTitle>
					}
					key="revenus"
					hasChildItems={false}
				>
					<StyledH4>
						<Trans>Revenus après impôts</Trans>

						<HelpButtonWithPopover
							type="info"
							title={t('Calculer vos revenus')}
						>
							<RevenuTable namedEngines={namedEngines} />
						</HelpButtonWithPopover>
					</StyledH4>
					<Body>
						Vos revenu après déduction de l'impôt sur le revenu, en prenant
						compte de l'ACRE si vous avez activé l'option.
					</Body>
					<DetailsRowCards
						dottedName="dirigeant . rémunération . net . après impôt"
						namedEngines={namedEngines}
						unit="€/mois"
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>Vos droits pour la retraite</Trans> <Emoji emoji="🧐" />
						</ItemTitle>
					}
					key="retraite"
					hasChildItems={false}
				>
					<Body>
						<Trans>
							Le montant de votre retraite est constitué de{' '}
							<Strong>
								votre retraite de base + votre retraite complémentaire
							</Strong>
							.
						</Trans>
					</Body>
					<StyledH4>
						<Trans>Retraite de base</Trans>
						<ExplicableRule dottedName="protection sociale . retraite . base" />
					</StyledH4>
					<Body>
						<Trans>
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
					/>

					<StyledH4>
						<Trans>Retraite complémentaire</Trans>
						<ExplicableRule dottedName="protection sociale . retraite . complémentaire" />
					</StyledH4>
					<Body>
						<Trans>
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
						evolutionLabel={<Trans>au bout de 10 ans</Trans>}
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>Vos prestations santé</Trans> <Emoji emoji="😷" />
						</ItemTitle>
					}
					key="santé"
					hasChildItems={false}
				>
					<Body
						css={`
							margin-bottom: 0;
						`}
					>
						<Trans>
							Tous les statuts vous ouvrent le droit au{' '}
							<Strong>remboursement des soins.</Strong>
						</Trans>
					</Body>
					<BodyNoMargin>
						<Trans>
							Pour tous les statuts, il est conseillé de souscrire à une{' '}
							<Strong>prévoyance complémentaire (mutuelle)</Strong> pour
							améliorer le remboursement des frais de santé.
						</Trans>
					</BodyNoMargin>

					<StyledH4>
						<Trans>Arrêt maladie</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . arrêt maladie" />
					</StyledH4>
					<Body>
						<Trans>
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
											css={`
												font-weight: normal;
											`}
										>
											<Trans>
												Votre <Strong>rémunération</Strong> est{' '}
												<Strong>trop faible</Strong> pour bénéficier d’arrêt
												maladie.
											</Trans>
										</span>
									}
									id="tooltip-sasu-arrêt-maladie"
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
										css={`
											margin-top: 0 !important;
										`}
									/>
									<Body
										css={`
											margin: 0;
										`}
									>
										<Trans>
											Pour y prétendre, vous devez voir cotisé au moins{' '}
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
						<Trans>Accident du travail et maladie professionnelle</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités" />
					</StyledH4>
					<Body>
						<Trans>
							En cas d’<Strong>accident de travail</Strong>, de{' '}
							<Strong>maladie professionnelle</Strong> ou d’un{' '}
							<Strong>accident sur le trajet domicile-travail</Strong>, vous
							serez indemnisé(e) à hauteur de :
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités"
						namedEngines={namedEngines}
						unit="€/mois"
						evolutionDottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour"
						evolutionLabel={<Trans>à partir du 29ème jour</Trans>}
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>La maternité, paternité et adoption</Trans>{' '}
							<Emoji emoji="🤗" />
						</ItemTitle>
					}
					key="enfants"
					hasChildItems={false}
				>
					<Body
						css={`
							margin-bottom: 0;
						`}
					>
						<Trans>
							Tous les statuts vous ouvrent le droit aux{' '}
							<Strong>indemnités journalières</Strong> de congé maternité,
							paternité, adoption.
						</Trans>
					</Body>
					<Body
						css={`
							margin-top: 0;
						`}
					>
						<Trans>
							Pour y prétendre, vous devez avoir cotisé{' '}
							<Strong>au moins 10 mois</Strong>.
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . maladie . maternité paternité adoption"
						namedEngines={namedEngines}
						unit="€/jour"
					/>

					<StyledH4>
						<Trans>Maternité</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel" />
					</StyledH4>
					<Body>
						<Trans>
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
						label={<Trans>versés en deux fois</Trans>}
					/>

					<StyledH4>
						<Trans>Adoption</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption" />
					</StyledH4>
					<Body>
						<Trans>
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
						label={<Trans>versés en une fois</Trans>}
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>Votre couverture invalidité et décès</Trans>{' '}
							<Emoji emoji="🤕" />
						</ItemTitle>
					}
					key="maladie"
					hasChildItems={false}
				>
					<Body>
						<Trans>
							Tous les statuts cotisent pour une{' '}
							<Strong>pension invalidité-décès</Strong> qui les{' '}
							<Strong>protège en cas d’invalidité</Strong> et assure à leurs
							proches une{' '}
							<Strong>
								pension de réversion et un capital en cas de décès
							</Strong>
							.
						</Trans>
					</Body>
					<StyledH4>
						<Trans>Invalidité</Trans>
						<ExplicableRule dottedName="protection sociale . invalidité et décès" />
					</StyledH4>
					<BodyNoMargin>
						<Trans>
							Vous pouvez bénéficier d’une pension invalidité{' '}
							<Strong>
								en cas de maladie ou d’accident conduisant à une incapacité à
								poursuivre votre activité professionnelle
							</Strong>
							.
						</Trans>
					</BodyNoMargin>
					<BodyNoMargin
						css={`
							margin-bottom: 1rem;
						`}
					>
						<Trans>
							Pour y prétendre, vous devez respecter{' '}
							<BlackColoredLink href="https://www.service-public.fr/particuliers/vosdroits/F672">
								certaines règles
								<StyledExternalLinkIcon />
							</BlackColoredLink>
							.
						</Trans>
					</BodyNoMargin>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . pension invalidité . invalidité partielle"
						evolutionDottedName="protection sociale . invalidité et décès . pension invalidité . invalidité totale"
						namedEngines={namedEngines}
						unit="€/mois"
						label={
							<span style={{ fontSize: '1rem' }}>
								<Trans>(invalidité partielle)</Trans>
							</span>
						}
						evolutionLabel={
							<span style={{ fontSize: '0.75rem' }}>
								<Trans>(invalidité totale)</Trans>
							</span>
						}
					/>
					<Body>
						<Trans>
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
						<Trans>Décès</Trans>
						<ExplicableRule dottedName="protection sociale . invalidité et décès . capital décès" />
					</StyledH4>
					<Body>
						<Trans>
							La Sécurité Sociale garantit un{' '}
							<Strong>capital décès pour vos ayants droits</Strong> (personnes
							qui sont à votre charge) sous certaines conditions.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . capital décès"
						namedEngines={namedEngines}
					/>

					<Body>
						<Trans>
							En plus du capital décès, une{' '}
							<Strong>pension de réversion</Strong> peut être versée au conjoint
							survivant. Elle correspond aux{' '}
							<Strong>droits à la retraite acquis par le défunt</Strong> durant
							sa vie professionnelle.
						</Trans>
					</Body>
					{/* <StatusCard statut={['SASU', 'EI', 'AE']}>
						<span>
							<Value
								linkToRule={false}
								expression="protection sociale . invalidité et décès . pension de reversion"
								engine={assimiléEngine}
								precision={0}
								unit="€/mois"
							/>{' '}
							<WhenAlreadyDefined
								engine={assimiléEngine}
								dottedName="protection sociale . invalidité et décès . pension de reversion"
							>
								<Trans>maximum</Trans>
							</WhenAlreadyDefined>
						</span>
					</StatusCard> */}

					<Body>
						<Trans>
							Pour un décès survenu dans le cadre d’un{' '}
							<Strong>accident professionnel</Strong>, vous pouvez bénéficier
							d’une <Strong>rente de décès</Strong>.
						</Trans>
					</Body>

					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
						namedEngines={namedEngines}
						unit="€/mois"
						label={t('pour vos proches')}
					/>

					<Body>
						<Trans>
							Un <Strong>capital « orphelin »</Strong> est versé aux{' '}
							<Strong>enfants des travailleurs indépendants</Strong> décédés,
							sous certaines conditions.
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
							<Trans>La gestion juridique et comptable</Trans>{' '}
							<Emoji emoji="🤓" />
						</ItemTitle>
					}
					key="administratif"
					hasChildItems={false}
				>
					{
						// TODO : implémenter les valeurs correspondantes dans modèle-social
						// Ressource : https://entreprendre.service-public.fr/vosdroits/F23282
						/*
							<StyledH4>
								<Trans>Coût de création</Trans>
								<ExplicableRule dottedName="protection sociale . maladie . arrêt maladie" />
							</StyledH4>
							<Body>
								<Trans>
									Les formalités de création d'une entreprise diffèrent selon les
									statuts et la nature de l'activité. Le calcul se concentre ici sur
									les <Strong>procédures obligatoires</Strong> (immatriculation,
									annonces légales, rédaction des statuts...).
								</Trans>
							</Body>
							<Grid container spacing={4}>
								<Grid item xs={12} lg={4}>
									<StatusCard status={['sasu']}>
										<span>
											<Value
												linkToRule={false}
												expression="protection sociale . maladie . arrêt maladie"
												engine={assimiléEngine}
												precision={0}
												unit="€"
											/>
										</span>
										<StyledRuleLink
											dottedName="protection sociale . maladie . arrêt maladie"
											engine={assimiléEngine}
										>
											<HelpIcon />
										</StyledRuleLink>
									</StatusCard>
								</Grid>
								<Grid item xs={12} lg={4}>
									<StatusCard status={['ei']}>
										<span>
											<Value
												linkToRule={false}
												expression="protection sociale . maladie . arrêt maladie"
												engine={indépendantEngine}
												precision={0}
												unit="€"
											/>
										</span>
										<StyledRuleLink
											dottedName="protection sociale . maladie . arrêt maladie"
											engine={assimiléEngine}
										>
											<HelpIcon />
										</StyledRuleLink>
									</StatusCard>
								</Grid>
								<Grid item xs={12} lg={4}>
									<StatusCard status={['ae']}>
										<Trans>Aucun</Trans>
									</StatusCard>
								</Grid>
							</Grid>
						*/
					}

					{/* <StyledH4>
						<Trans>Dépôt de capital</Trans>
						<ExplicableRule dottedName="entreprise . capital social" />
					</StyledH4>
					<Body>
						<Trans>
							Selon les statuts, il est indispensable d’effectuer un{' '}
							<Strong>apport en capital</Strong> à la création de l’entreprise.
							Le <Strong>montant minimum</Strong> du capital social est de{' '}
							<Strong>1 €</Strong>.
						</Trans>
					</Body>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard statut={['SASU']}>
								<Trans>1 € minimum</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard statut={['EI', 'AE']}>
								<DisabledLabel>
									<Trans>Aucun</Trans>
								</DisabledLabel>
							</StatusCard>
						</Grid>
					</Grid> */}

					{/* <StyledH4>
						<Trans>Statut du conjoint</Trans>
					</StyledH4>
					<Body>
						<Trans>
							Vous êtes marié(e), pacsé(e) ou en union libre avec un chef
							d’entreprise : il existe <Strong>3 statuts possibles</Strong> pour
							vous (<Strong>conjoint collaborateur</Strong>,{' '}
							<Strong>conjoint associé</Strong> ou{' '}
							<Strong>conjoint salarié</Strong>).
						</Trans>
					</Body>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard statut={['SASU']}>
								<Trans>Conjoint associé ou salarié</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard statut={['EI']}>
								<Trans>Conjoint collaborateur ou salarié</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard statut={['AE']}>
								<Trans>Conjoint collaborateur</Trans>
							</StatusCard>
						</Grid>
					</Grid> */}
				</Item>
			</Accordion>
		</StyledContainer>
	)
}

const StyledContainer = styled(Container)`
	padding: ${({ theme }) => theme.spacings.lg};
`

const StyledH4 = styled(H4)`
	font-size: 1.25rem;
	color: ${({ theme }) => theme.colors.bases.primary[600]};
`
// TODO : décommenter une fois l'implémentation du calcul des coûts de créations
// ajouté à modèle-social
/*
const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`
const Precisions = styled.span`
	display: block;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.extended.grey[700]};
	margin: 0;
	margin-top: 0.5rem;
	width: 100%;
`
*/

const StyledDiv = styled.div`
	display: flex;

	svg {
		width: 2.5rem;
		margin-right: 1rem;
		margin-top: 1rem;
	}
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

const DisabledLabel = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-style: italic;
	margin: 0;
`

export default Détails
