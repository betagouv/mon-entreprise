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
import { Tooltip } from '@/design-system/tooltip'
import { Strong } from '@/design-system/typography'
import { H1, H4, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

import { StatusTagIcon } from './StatusCard'

const DOTTEDNAME_SOCIETE_IMPOT = 'entreprise . imposition'
const DOTTEDNAME_SOCIETE_VERSEMENT_LIBERATOIRE =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'
const DOTTEDNAME_ACRE = 'dirigeant . exonérations . ACRE'

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

	const defaultValueACRE =
		autoEntrepreneurEngine.evaluate(DOTTEDNAME_ACRE).nodeValue

	const [impotValue, setImpotValue] = useState(
		`'${String(defaultValueImpot)}'` || "'IS'"
	)
	const [versementLiberatoireValue, setVersementLiberatoireValue] = useState(
		defaultValueVersementLiberatoire ? 'oui' : 'non'
	)
	const [acreValue, setAcreValue] = useState(defaultValueACRE ? 'oui' : 'non')

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

				dispatch(
					answerQuestion(DOTTEDNAME_ACRE, acreValue as PublicodesExpression)
				)
			}}
		>
			<>
				<H1>
					<Trans>Aller plus loin sur les revenus</Trans>
				</H1>
				<H4
					as="h2"
					css={`
						margin-bottom: 1rem;
					`}
				>
					<Trans>Calculer vos revenus</Trans>
				</H4>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'comparateur.allerPlusLoin.tableCaption',
							"Tableau affichant le détail du calcul du revenu net pour la SASU, l'entreprise individuelle (EI) et l'auto-entreprise (AE)."
						)}
					</caption>
					<thead>
						<tr>
							<th className="sr-only">Type de structure</th>
							<th scope="col">
								<span className="table-title-sasu">
									<StatusTagIcon status="sasu" /> SASU
								</span>
							</th>

							<th scope="col">
								<Tooltip
									tooltip="Entreprise individuelle"
									id="tooltip-ei-table"
								>
									<span className="table-title-ei">
										<StatusTagIcon status="ei" /> EI
									</span>
								</Tooltip>
							</th>

							<th scope="col">
								<Tooltip tooltip="Auto-entreprise" id="tooltip-ae-table">
									<span className="table-title-ae">
										<StatusTagIcon status="ae" /> AE
									</span>
								</Tooltip>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<Minus
									css={`
										opacity: 0;
									`}
									aria-hidden
								>
									-
								</Minus>{' '}
								<Trans>Chiffre d'affaires</Trans>
							</th>
							<td colSpan={3}>
								<StyledTag $color={'grey' as TagType}>
									<Value
										expression="entreprise . chiffre d'affaires"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus> <Trans>Charges</Trans>
							</th>
							<td colSpan={3}>
								<StyledTag $color={'grey' as TagType}>
									<Value
										expression="entreprise . charges"
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus>{' '}
								<Trans>Cotisations</Trans>
							</th>
							<td>
								<StyledTag $color={'secondary' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={assimiléEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
							<td>
								<StyledTag $color={'independant' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={indépendantEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
							<td>
								<StyledTag $color={'tertiary' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={autoEntrepreneurEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus> <Trans>Impôts</Trans>
							</th>
							<td>
								<StyledTag $color={'secondary' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={assimiléEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
							<td>
								<StyledTag $color={'independant' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={indépendantEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
							<td>
								<StyledTag $color={'tertiary' as TagType}>
									<Value
										expression="dirigeant . rémunération . cotisations"
										engine={autoEntrepreneurEngine}
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<th scope="row">
							<Minus
								css={`
									opacity: 0;
								`}
								aria-hidden
							>
								-
							</Minus>{' '}
							<StyledStrong>
								<Trans>Revenu net</Trans>
							</StyledStrong>
						</th>
						<td>
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
						</td>
						<td>
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
						</td>
						<td>
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
						</td>
					</tfoot>
				</StyledTable>
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
						size="XS"
					>
						<Trans>En savoir plus</Trans>
					</Button>
				}
				<H5 as="h3">Choisir mon option de versement libératoire (pour AE)</H5>
				<FlexCentered>
					<SwitchInput
						key="activation-acre"
						id="activation-acre"
						onChange={(value: boolean) => {
							setAcreValue(value ? 'oui' : 'non')
						}}
						defaultSelected={acreValue === 'oui'}
					/>
					<Label htmlFor="activation-acre">
						Activer l'ACRE dans la simulation (pour AE)
					</Label>
				</FlexCentered>

				<Spacing md />
				<H4 as="h2">
					Impôt sur le revenu, impôt sur les sociétés : que choisir ?
				</H4>
				<Body>
					L’EI et la SASU permettent de{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années. En auto-entreprise (AE), c’est l’
					<Strong>impôt sur le revenu</Strong> qui est appliqué automatiquement
					; dans certaines situations, vous pouvez aussi opter pour le{' '}
					<Strong>
						<Link href="https://www.impots.gouv.fr/professionnel/le-versement-liberatoire">
							versement libératoire
						</Link>
					</Strong>
					.
				</Body>
				<H5 as="h3">Choisir mon option de simulation (pour EI)</H5>
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

				<H5 as="h3">Choisir mon option de versement libératoire (pour AE)</H5>
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

const StyledTag = styled(Tag)<{ $color: TagType }>`
	width: 100%;
	justify-content: center;
	font-size: 0.75rem;
`

const Minus = styled.span`
	color: ${({ theme }) => theme.colors.bases.secondary[500]};
	margin-right: ${({ theme }) => theme.spacings.sm};
`

const StyledStrong = styled(Strong)`
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

const StyledTable = styled.table`
	width: 100%;
	text-align: left;
	font-family: ${({ theme }) => theme.fonts.main};
	border-collapse: separate;
	border-spacing: 0.5rem;
	border: transparent;

	tr {
		border-spacing: ${({ theme }) => theme.spacings.md}!important;
	}

	thead th {
		text-align: center;
		font-size: 0.75rem;
	}
	.table-title-sasu {
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${({ theme }) => theme.colors.bases.secondary[600]};
		svg {
			fill: ${({ theme }) => theme.colors.bases.secondary[600]};
			margin-right: ${({ theme }) => theme.spacings.xxs};
		}
	}
	.table-title-ei {
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${({ theme }) => theme.colors.publics.independant[600]};
		svg {
			fill: ${({ theme }) => theme.colors.publics.independant[600]};
			margin-right: ${({ theme }) => theme.spacings.xxs};
		}
	}
	.table-title-ae {
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${({ theme }) => theme.colors.bases.tertiary[500]};
		svg {
			fill: ${({ theme }) => theme.colors.bases.tertiary[500]};
			margin-right: ${({ theme }) => theme.spacings.xxs};
		}
	}

	tbody th {
		font-weight: normal;
	}

	tbody tr:last-of-type td {
		padding-bottom: 0.5rem;
	}

	tfoot {
		position: relative;
	}

	tfoot:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: ${({ theme }) => theme.colors.extended.grey[500]};
	}
	tfoot td,
	tfoot th {
		padding-top: 1rem;
	}
`

export default AllerPlusLoinRevenus
