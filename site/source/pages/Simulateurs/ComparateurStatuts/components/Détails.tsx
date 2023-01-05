import { Item } from '@react-stately/collections'
import Engine from 'publicodes'
import { useState } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import Value from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { ExplicableRule } from '@/components/conversation/Explicable'
import { Accordion } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import {
	ExternalLinkIcon,
	HelpIcon,
	PlusCircleIcon,
} from '@/design-system/icons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H4 } from '@/design-system/typography/heading'
import { StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

import DetailsRowCards from './DetailsRowCards'
import ItemTitle from './ItemTitle'
import StatusCard from './StatusCard'

const Détails = ({
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}) => {
	const [shouldToggleAll, setShouldToggleAll] = useState(false)

	return (
		<StyledContainer
			backgroundColor={(theme) => theme.colors.bases.primary[200]}
		>
			<StyledGrid container>
				<Grid item>
					<H2>
						<Trans>Zoom sur...</Trans>
					</H2>
				</Grid>
				<Grid item>
					<Button underline onClick={() => setShouldToggleAll(true)}>
						<Trans>Tout déplier</Trans>
					</Button>
				</Grid>
			</StyledGrid>
			<Accordion variant="light" shouldToggleAll={shouldToggleAll}>
				<Item
					title={
						<ItemTitle>
							<Trans>La retraite</Trans> <Emoji emoji="🧐" />
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
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
						unit="€/mois"
					/>

					<StyledH4>
						<Trans>Retraite complémentaire</Trans>
						<ExplicableRule dottedName="protection sociale . retraite . complémentaire" />
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
						dottedName="protection sociale . retraite . complémentaire"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="ae"
						unit="€/mois"
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>La santé</Trans> <Emoji emoji="😷" />
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
							La pension calculée correspond à celle de{' '}
							<Strong>vos 25 meilleures années</Strong>, en considérant que vous
							avez cotisé suffisamment de trimestres (4 trimestres par an) et
							que vous partez en retraite à l’âge requis pour obtenir un taux
							plein.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . maladie . arrêt maladie"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="ae"
						unit="€/jour"
						footers={{
							sasu: (
								<StyledDiv>
									<PlusCircleIcon />
									<Body>
										<Trans>
											Pour y prétendre, vous devez voir cotisé au moins{' '}
											<Strong>3 mois</Strong>
										</Trans>
									</Body>
								</StyledDiv>
							),
							ei: (
								<StyledDiv>
									<PlusCircleIcon />
									<Body>
										<Trans>
											Pour y prétendre, vous devez voir cotisé au moins{' '}
											<Strong>12 mois</Strong>
										</Trans>
									</Body>
								</StyledDiv>
							),
							ae: (
								<StyledDiv>
									<PlusCircleIcon />
									<Body>
										<Trans>
											Pour y prétendre, vous devez voir cotisé au moins{' '}
											<Strong>12 mois</Strong>
										</Trans>
									</Body>
								</StyledDiv>
							),
						}}
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
					<div>new</div>
					<DetailsRowCards
						dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
						unit="€/mois"
						evolutionDottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour"
						evolutionLabel={<Trans>à partir du 29ème jour</Trans>}
					/>
					<div>old</div>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['sasu']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
								<Precisions>
									<Value
										linkToRule={false}
										expression="protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>{' '}
									<Trans>à partir du 29ème jour</Trans>
								</Precisions>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['ei', 'ae']}>
								<DisabledLabel>Ne s'applique pas</DisabledLabel>
							</StatusCard>
						</Grid>
					</Grid>
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
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
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
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="ei"
						unit="€/mois"
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
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="ei"
						unit="€/mois"
					/>
				</Item>
				<Item
					title={
						<ItemTitle>
							<Trans>L'invalidité et le décès</Trans> <Emoji emoji="🤕" />
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
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
						unit="€/mois"
						label={<Trans>(invalidité partielle)</Trans>}
					/>
					<Spacing md />
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . pension invalidité . invalidité totale"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
						unit="€/mois"
						label={<Trans>(invalidité totale)</Trans>}
					/>
					<Body
						css={`
							margin-top: 2rem;
						`}
					>
						<Trans>
							Pour une invalidité causée par un accident professionnel, vous
							pouvez bénéficier d’une <Strong>rente d’incapacité</Strong>.
						</Trans>
					</Body>
					<div>new</div>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="sasu"
						unit="€/mois"
					/>
					<div>old</div>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['sasu']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['ei', 'ae']}>
								<DisabledLabel>
									<Trans>Ne s'applique pas</Trans>
								</DisabledLabel>
							</StatusCard>
						</Grid>
					</Grid>

					<StyledH4>
						<Trans>Décès</Trans>
						<ExplicableRule dottedName="protection sociale . invalidité et décès . capital décès" />
					</StyledH4>
					<Body>
						<Trans>
							La Sécurité Sociale garantit un{' '}
							<Strong>capital décès pour vos ayants droits</Strong>
							(personnes qui sont à votre charge) sous certaines conditions.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . capital décès"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						bestOption="ei"
						unit="€/mois"
					/>

					<Body
						css={`
							margin-top: 2rem;
						`}
					>
						<Trans>
							En plus du capital décès, une{' '}
							<Strong>pension de réversion</Strong> peut être versée au conjoint
							survivant. Elle correspond aux{' '}
							<Strong>droits à la retraite acquis par le défunt</Strong> durant
							sa vie professionnelle.
						</Trans>
					</Body>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . pension de reversion"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						unit="€/mois"
						bestOption="sasu"
					/>

					<Body
						css={`
							margin-top: 2rem;
						`}
					>
						<Trans>
							Pour un décès survenu dans le cadre d’un accident professionnel,
							vous pouvez bénéficier d’une <Strong>rente de décès</Strong>.
						</Trans>
					</Body>
					<div>new</div>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						unit="€/mois"
						bestOption="sasu"
					/>
					<div>old</div>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['sasu']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['ei', 'ae']}>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
										engine={indépendantEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
					</Grid>

					<Body
						css={`
							margin-top: 2rem;
						`}
					>
						<Trans>
							Un <Strong>capital « orphelin »</Strong> est versé aux enfants des
							travailleurs indépendants décédés, sous certaines conditions.
						</Trans>
					</Body>
					<div>new</div>
					<DetailsRowCards
						dottedName="protection sociale . invalidité et décès . capital décès . orphelin"
						engines={[
							assimiléEngine,
							autoEntrepreneurEngine,
							indépendantEngine,
						]}
						unit="€/mois"
						bestOption="ei"
					/>
					<div>old</div>
					<Grid container spacing={4}>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['sasu']}>
								<DisabledLabel>
									<Trans>Ne s'applique pas</Trans>
								</DisabledLabel>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['ei', 'ae']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . invalidité et décès . capital décès . orphelin"
										engine={indépendantEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . invalidité et décès . capital décès . orphelin"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
					</Grid>
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

					<StyledH4>
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
							<StatusCard status={['sasu']}>
								<Trans>1 € minimum</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['ei', 'ae']}>
								<DisabledLabel>
									<Trans>Aucun</Trans>
								</DisabledLabel>
							</StatusCard>
						</Grid>
					</Grid>

					<StyledH4>
						<Trans>Statut du conjoint</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . arrêt maladie" />
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
							<StatusCard status={['sasu']}>
								<Trans>Conjoint associé ou salarié</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['ei']}>
								<Trans>Conjoint collaborateur ou salarié</Trans>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['ae']}>
								<Trans>Conjoint collaborateur</Trans>
							</StatusCard>
						</Grid>
					</Grid>
				</Item>
			</Accordion>
		</StyledContainer>
	)
}

const StyledContainer = styled(Container)`
	padding: ${({ theme }) => theme.spacings.lg};
`

const StyledGrid = styled(Grid)`
	justify-content: space-between;
	align-items: center;
`

const StyledH4 = styled(H4)`
	font-size: 1.25rem;
	color: ${({ theme }) => theme.colors.bases.primary[600]};
`

const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`

const StyledDiv = styled.div`
	display: flex;

	svg {
		width: 2.5rem;
		margin-right: 1rem;
		margin-top: 1rem;
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
`

export default Détails
