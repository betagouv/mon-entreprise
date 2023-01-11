import Engine, { PublicodesExpression } from 'publicodes'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import { answerQuestion } from '@/actions/actions'
import Value from '@/components/EngineValue'
import { SwitchInput } from '@/components/conversation/ChoicesInput'
import { ExplicableRule } from '@/components/conversation/Explicable'
import RuleInput from '@/components/conversation/RuleInput'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { ArrowRightIcon, InfoIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import PopoverConfirm from '@/design-system/popover/PopoverConfirm'
import { Tag, TagType } from '@/design-system/tag'
import { Strong } from '@/design-system/typography'
import { H1, H4, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

const DOTTEDNAME_SOCIETE_IMPOT = 'entreprise . imposition'
const DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'
const AllerPlusLoinRevenus = ({
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}) => {
	const defaultValueImpot = useEngine().evaluate(
		DOTTEDNAME_SOCIETE_IMPOT
	).nodeValue

	const defaultValueVersementLiberatoire = autoEntrepreneurEngine.evaluate(
		DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE
	).nodeValue

	const [impotValue, setImpotValue] = useState(
		`'${String(defaultValueImpot)}'` || "'IS'"
	)
	const [versementLiberatoireValue, setVersementLiberatoireValue] = useState(
		defaultValueVersementLiberatoire ? 'oui' : 'non'
	)

	const { t } = useTranslation()

	const dispatch = useDispatch()

	return (
		<PopoverConfirm
			small
			trigger={(buttonsProps) => (
				<Button {...buttonsProps} color="secondary" light size="XS">
					<Trans>Aller plus loin</Trans> <StyledArrowRightIcon />
				</Button>
			)}
			confirmLabel="Enregistrer les options"
			onConfirm={() => {
				dispatch(
					answerQuestion(
						DOTTEDNAME_SOCIETE_IMPOT,
						impotValue as PublicodesExpression
					)
				)

				dispatch(
					answerQuestion(
						DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE,
						versementLiberatoireValue as PublicodesExpression
					)
				)
			}}
		>
			<>
				<H1>
					<Trans>Aller plus loin sur les revenus</Trans>
				</H1>
				<H4 as="h2">
					<Trans>Calculer vos revenus</Trans>
				</H4>
				<Ul role="math">
					<StyledLi>
						<Minus
							css={`
								opacity: 0;
							`}
							aria-hidden
						>
							-
						</Minus>
						<StyledGrid container>
							<Grid item xs={6}>
								<Trans>Chiffre d'affaires</Trans>
							</Grid>
							<Grid item xs={6}>
								<StyledTag $color={'grey' as TagType}>
									<Value
										expression="entreprise . chiffre d'affaires"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</Grid>
						</StyledGrid>
					</StyledLi>
					<StyledLi>
						<Minus aria-label={t('moins')}>-</Minus>
						<StyledGrid container>
							<Grid item xs={6}>
								<Trans>Charges</Trans>
							</Grid>
							<Grid item xs={6}>
								<StyledTag $color={'grey' as TagType}>
									<Value
										expression="entreprise . charges"
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</Grid>
						</StyledGrid>
					</StyledLi>
					<StyledLi>
						<Minus aria-label={t('moins')}>-</Minus>
						<StyledGrid container>
							<Grid item xs={6}>
								<Trans>Cotisations</Trans>
							</Grid>
							<Grid item xs={6}>
								<Grid container>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'secondary' as TagType}>
											<Value
												expression="dirigeant . rémunération . cotisations"
												engine={assimiléEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'independant' as TagType}>
											<Value
												expression="dirigeant . rémunération . cotisations"
												engine={indépendantEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'tertiary' as TagType}>
											<Value
												expression="dirigeant . rémunération . cotisations"
												engine={autoEntrepreneurEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
								</Grid>
							</Grid>
						</StyledGrid>
					</StyledLi>
					<StyledLi>
						<Minus aria-label={t('moins')}>-</Minus>
						<StyledGrid container>
							<Grid item xs={6}>
								<Trans>Impôts</Trans>
							</Grid>
							<Grid item xs={6}>
								<Grid container>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'secondary' as TagType}>
											<Value
												expression="impôt . montant"
												engine={assimiléEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'independant' as TagType}>
											<Value
												expression="impôt . montant"
												engine={indépendantEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
									<Grid item xs={12} lg={4}>
										<StyledTag $color={'tertiary' as TagType}>
											<Value
												expression="dirigeant . rémunération . impôt"
												engine={autoEntrepreneurEngine}
												unit="€/an"
												displayedUnit="€"
												linkToRule={false}
											/>
										</StyledTag>
									</Grid>
								</Grid>
							</Grid>
						</StyledGrid>
					</StyledLi>
				</Ul>
				<Spacer />
				<StyledGrid container>
					<Grid item xs={6}>
						<StyledStrong>
							<Trans>Revenu net</Trans>
						</StyledStrong>
					</Grid>
					<Grid item xs={6}>
						<Grid container>
							<Grid item xs={12} lg={4}>
								<StyledTag $color={'secondary' as TagType}>
									<Strong>
										<Value
											expression="dirigeant . rémunération . net . après impôt"
											engine={assimiléEngine}
											unit="€/an"
											displayedUnit="€"
											linkToRule={false}
										/>
									</Strong>
								</StyledTag>
							</Grid>
							<Grid item xs={12} lg={4}>
								<StyledTag $color={'independant' as TagType}>
									<Strong>
										<Value
											expression="dirigeant . rémunération . net . après impôt"
											engine={indépendantEngine}
											unit="€/an"
											displayedUnit="€"
											linkToRule={false}
										/>
									</Strong>
								</StyledTag>
							</Grid>
							<Grid item xs={12} lg={4}>
								<StyledTag $color={'tertiary' as TagType}>
									<Strong>
										<Value
											expression="dirigeant . rémunération . net . après impôt"
											engine={autoEntrepreneurEngine}
											unit="€/an"
											displayedUnit="€"
											linkToRule={false}
										/>
									</Strong>
								</StyledTag>
							</Grid>
						</Grid>
					</Grid>
				</StyledGrid>
				<Spacing md />
				<Flex>
					<H4 as="h2">Bénéficier de l'ACRE</H4>
					<ExplicableRule
						dottedName="dirigeant . exonérations . ACRE"
						title="Bénéficier de l'ACRE"
					/>
				</Flex>

				<Body>
					L'aide à la création ou à la reprise d'une entreprise (Acre) consiste
					en une <Strong>exonération partielle de charges sociales</Strong>,
					dite exonération de début d'activité <Strong>pendant 12 mois</Strong>.
				</Body>
				{
					// TODO : décommenter une fois le simulateur créé
					<Button
						href="https://entreprendre.service-public.fr/vosdroits/F23282"
						aria-label={t('En savoir plus, nouvelle fenêtre')}
						color="secondary"
						light
					>
						<Trans>En savoir plus</Trans>
					</Button>
				}

				<Spacing md />
				<H4 as="h2">
					Impôt sur le revenu, impôt sur les sociétés : que choisir ?
				</H4>
				<Body>
					L’EI et la SASU permettent de{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années. En auto-entreprise, c’est l’
					<Strong>impôt sur le revenu</Strong> qui est appliqué automatiquement.
				</Body>
				<Spacing xxs />
				<Message type="secondary">
					<Grid
						container
						css={`
							flex-wrap: nowrap;
							align-items: baseline;
						`}
						spacing={3}
					>
						<Grid item>
							<InfoIcon
								css={`
									padding-top: 0.15rem;
									display: inline-block;
								`}
								aria-label={t('Message à caractère informatif')}
							/>
						</Grid>
						<Grid item>
							<Body
								css={`
									font-size: 0.875rem;
								`}
							>
								<Trans>
									À ce jour, ce comparateur ne prend pas en compte le calcul de
									l'impôt sur le revenu pour les SASU. La modification du
									paramètre ci-dessous influera donc uniquement les calculs liés
									au statut d'entreprise individuelle (EI).
								</Trans>
							</Body>
						</Grid>
					</Grid>
				</Message>
				<H5 as="h3">Choisir mon option de simulation (pour EI)</H5>
				<RuleInput
					dottedName={DOTTEDNAME_SOCIETE_IMPOT}
					onChange={(value: PublicodesExpression | undefined) => {
						setImpotValue(String(value))
					}}
					key="imposition"
					aria-labelledby="questionHeader"
					inputType="toggle"
					engine={indépendantEngine}
				/>
				<Body>
					En auto-entreprise, dans certaines situations, vous pouvez opter pour
					le{' '}
					<Strong>
						<Link href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire">
							versement libératoire
						</Link>
					</Strong>
					.
				</Body>
				<FlexCentered>
					<SwitchInput
						key="versement-liberatoire"
						id="versement-liberatoire"
						onChange={(value: boolean) => {
							setVersementLiberatoireValue(value ? 'oui' : 'non')
						}}
						defaultSelected={versementLiberatoireValue === 'oui'}
					/>
					<Label htmlFor="versement-liberatoire">
						Activer le versement libératoire dans la simulation.
					</Label>
				</FlexCentered>
			</>
		</PopoverConfirm>
	)
}

const StyledGrid = styled(Grid)`
	justify-content: space-between;
	width: 100%;
`

const StyledLi = styled(Li)`
	display: flex;
	padding: 0 !important;
	&::before {
		content: '' !important;
	}
`

const StyledTag = styled(Tag)<{ $color: TagType }>`
	width: 100%;
	justify-content: center;
	font-size: 0.75rem;
`

const Minus = styled.span`
	color: ${({ theme }) => theme.colors.bases.secondary[500]};
	margin-right: ${({ theme }) => theme.spacings.sm};
`

const Spacer = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${({ theme }) => theme.colors.extended.grey[500]};
	margin: ${({ theme }) => theme.spacings.xl} 0;
`

const StyledStrong = styled(Strong)`
	margin-left: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
`

const Flex = styled.div`
	display: flex;
	align-items: baseline;
`

const FlexCentered = styled.div`
	display: flex;
	align-items: center;
`

const Label = styled.label`
	margin-left: ${({ theme }) => theme.spacings.md};
	font-family: ${({ theme }) => theme.fonts.main};
	font-size: 1rem;
`

const StyledArrowRightIcon = styled(ArrowRightIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`

export default AllerPlusLoinRevenus
