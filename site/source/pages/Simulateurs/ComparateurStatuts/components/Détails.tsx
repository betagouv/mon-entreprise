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
import { HelpIcon, PlusCircleIcon } from '@/design-system/icons'
import { Container, Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

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
							La retraite <Emoji emoji="🧐" />
						</ItemTitle>
					}
					key="retraite"
					hasChildItems={false}
				>
					<Body>
						Le montant de votre retraite est constitué de{' '}
						<Strong>
							votre retraite de base + votre retraite complémentaire
						</Strong>
						.
					</Body>
					<StyledH4>
						<Trans>Retraite de base</Trans>
						<ExplicableRule dottedName="protection sociale . retraite . base" />
					</StyledH4>
					<Body>
						La pension calculée correspond à celle de{' '}
						<Strong>vos 25 meilleures années</Strong>, en considérant que vous
						avez cotisé suffisamment de trimestres (4 trimestres par an) et que
						vous partez en retraite à l’âge requis pour obtenir un taux plein.
					</Body>
					<Grid container>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['sasu', 'ei']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . retraite . base"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . retraite . base"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['ae']}>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . retraite . base"
										engine={autoEntrepreneurEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . retraite . base"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
					</Grid>

					<StyledH4>
						<Trans>Retraite complémentaire</Trans>
						<ExplicableRule dottedName="protection sociale . retraite . complémentaire" />
					</StyledH4>
					<Body>
						La pension calculée correspond à celle de{' '}
						<Strong>vos 25 meilleures années</Strong>, en considérant que vous
						avez cotisé suffisamment de trimestres (4 trimestres par an) et que
						vous partez en retraite à l’âge requis pour obtenir un taux plein.
					</Body>
					<Grid container>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['sasu']}>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . retraite . complémentaire"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . retraite . complémentaire"
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
										expression="protection sociale . retraite . complémentaire"
										engine={indépendantEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . retraite . complémentaire"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['ae']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . retraite . complémentaire"
										engine={autoEntrepreneurEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . retraite . complémentaire"
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
							La santé <Emoji emoji="😷" />
						</ItemTitle>
					}
					key="santé"
					hasChildItems={false}
				>
					<Body>
						Tous les statuts vous ouvrent le droit au{' '}
						<Strong>remboursement des soins.</Strong>
					</Body>
					<Body>
						Pour tous les statuts, il est conseillé de souscrire à une{' '}
						<Strong>prévoyance complémentaire (mutuelle)</Strong> pour améliorer
						le remboursement des frais de santé.
					</Body>

					<StyledH4>
						<Trans>Arrêt maladie</Trans>
						<ExplicableRule dottedName="protection sociale . maladie . arrêt maladie" />
					</StyledH4>
					<Body>
						La pension calculée correspond à celle de{' '}
						<Strong>vos 25 meilleures années</Strong>, en considérant que vous
						avez cotisé suffisamment de trimestres (4 trimestres par an) et que
						vous partez en retraite à l’âge requis pour obtenir un taux plein.
					</Body>
					<Grid container>
						<Grid item xs={12} lg={4}>
							<StatusCard
								status={['sasu']}
								footerContent={
									<StyledDiv>
										<PlusCircleIcon />
										<Body>
											<Trans>
												Pour y prétendre, vous devez voir cotisé au moins{' '}
												<Strong>3 mois</Strong>
											</Trans>
										</Body>
									</StyledDiv>
								}
							>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . maladie . arrêt maladie"
										engine={assimiléEngine}
										precision={0}
										unit="€/jour"
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
							<StatusCard
								status={['ei']}
								footerContent={
									<StyledDiv>
										<PlusCircleIcon />
										<Body>
											<Trans>
												Pour y prétendre, vous devez voir cotisé au moins{' '}
												<Strong>12 mois</Strong>
											</Trans>
										</Body>
									</StyledDiv>
								}
							>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . maladie . arrêt maladie"
										engine={indépendantEngine}
										precision={0}
										unit="€/jour"
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
							<StatusCard
								status={['ae']}
								isBestOption
								footerContent={
									<StyledDiv>
										<PlusCircleIcon />
										<Body>
											<Trans>
												Pour y prétendre, vous devez voir cotisé au moins{' '}
												<Strong>12 mois</Strong>
											</Trans>
										</Body>
									</StyledDiv>
								}
							>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . maladie . arrêt maladie"
										engine={autoEntrepreneurEngine}
										precision={0}
										unit="€/jour"
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
					</Grid>

					<StyledH4>
						<Trans>Accident du travail et maladie professionnelle</Trans>
						<ExplicableRule dottedName="protection sociale . accidents du travail et maladies professionnelles" />
					</StyledH4>
					<Body>
						En cas d’<Strong>accident de travail</Strong>, de{' '}
						<Strong>maladie professionnelle</Strong> ou d’un{' '}
						<Strong>accident sur le trajet domicile-travail</Strong>, vous serez
						indemnisé(e) à hauteur de :
					</Body>
					<Grid container>
						<Grid item xs={12} lg={8}>
							<StatusCard status={['sasu']} isBestOption>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . accidents du travail et maladies professionnelles"
										engine={assimiléEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . accidents du travail et maladies professionnelles"
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</StatusCard>
						</Grid>
						<Grid item xs={12} lg={4}>
							<StatusCard status={['ei', 'ae']}>
								<span>
									<Value
										linkToRule={false}
										expression="protection sociale . accidents du travail et maladies professionnelles"
										engine={indépendantEngine}
										precision={0}
										unit="€/mois"
									/>
								</span>
								<StyledRuleLink
									dottedName="protection sociale . accidents du travail et maladies professionnelles"
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
							La maternité, paternité et adoption <Emoji emoji="🤗" />
						</ItemTitle>
					}
					key="enfants"
					hasChildItems={false}
				>
					<Body>
						Le montant de votre retraite est constitué de{' '}
						<Strong>
							votre retraite de base + votre retraite complémentaire
						</Strong>
						.
					</Body>
				</Item>
				<Item
					title={
						<ItemTitle>
							L'invalidité et le décès <Emoji emoji="🤕" />
						</ItemTitle>
					}
					key="maladie"
					hasChildItems={false}
				>
					<Body>
						Le montant de votre retraite est constitué de{' '}
						<Strong>
							votre retraite de base + votre retraite complémentaire
						</Strong>
						.
					</Body>
				</Item>
				<Item
					title={
						<ItemTitle>
							La gestion juridique et comptable <Emoji emoji="🤓" />
						</ItemTitle>
					}
					key="administratif"
					hasChildItems={false}
				>
					<Body>
						Le montant de votre retraite est constitué de{' '}
						<Strong>
							votre retraite de base + votre retraite complémentaire
						</Strong>
						.
					</Body>
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

export default Détails
