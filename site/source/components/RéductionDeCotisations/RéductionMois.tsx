import { PublicodesExpression } from 'publicodes'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import Montant from '@/components/RéductionDeCotisations/Montant'
import MonthOptions from '@/components/RéductionDeCotisations/MonthOptions'
import RuleLink from '@/components/RuleLink'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { RotatingChevronIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import {
	MonthState,
	Options,
	RéductionDottedName,
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
	RémunérationBruteInput,
} from '@/utils/réductionDeCotisations'

type Props = {
	dottedName: RéductionDottedName
	monthName: string
	data: MonthState
	index: number
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
	onOptionsChange: (monthIndex: number, options: Options) => void
	warningCondition: PublicodesExpression
	warningTooltip: ReactNode
	withRépartitionAndRégularisation?: boolean
	mobileVersion?: boolean
}

export default function RéductionMois({
	dottedName,
	monthName,
	data,
	index,
	onRémunérationChange,
	onOptionsChange,
	warningCondition,
	warningTooltip,
	withRépartitionAndRégularisation = true,
	mobileVersion = false,
}: Props) {
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'
	const engine = useEngine()
	const [isOptionVisible, setOptionVisible] = useState(false)

	const RémunérationInput = () => {
		// TODO: enlever les 4 premières props après résolution de #3123
		const ruleInputProps = {
			dottedName,
			suggestions: {},
			description: undefined,
			question: undefined,
			engine,
			'aria-labelledby': 'simu-update-explaining',
			formatOptions: {
				maximumFractionDigits: 0,
			},
			displayedUnit,
			unit: {
				numerators: ['€'],
				denominators: [],
			},
		}

		return (
			<NumberInput
				{...ruleInputProps}
				id={`${rémunérationBruteDottedName.replace(
					/\s|\./g,
					'_'
				)}-${monthName}`}
				aria-label={`${engine.getRule(rémunérationBruteDottedName)
					?.title} (${monthName})`}
				onChange={(rémunérationBrute?: PublicodesExpression) =>
					onRémunérationChange(
						index,
						(rémunérationBrute as RémunérationBruteInput).valeur
					)
				}
				value={data.rémunérationBrute}
				formatOptions={{
					maximumFractionDigits: 2,
				}}
				showSuggestions={false}
			/>
		)
	}

	const OptionsButton = () => {
		return (
			<StyledButton
				size="XXS"
				light
				onPress={() => setOptionVisible(!isOptionVisible)}
				aria-describedby="options-description"
				aria-expanded={isOptionVisible}
				aria-controls={`options-${monthName}`}
				aria-label={!isOptionVisible ? t('Déplier') : t('Replier')}
			>
				{t('Options')}&nbsp;
				<RotatingChevronIcon aria-hidden $isOpen={isOptionVisible} />
			</StyledButton>
		)
	}

	const MontantRéduction = () => {
		return (
			<Montant
				id={`${dottedName.replace(/\s|\./g, '_')}-${monthName}`}
				dottedName={dottedName}
				rémunérationBrute={data.rémunérationBrute}
				réduction={data.réduction.value}
				répartition={data.réduction.répartition}
				displayedUnit={displayedUnit}
				language={language}
				warningCondition={warningCondition}
				warningTooltip={warningTooltip}
				withRépartition={withRépartitionAndRégularisation}
			/>
		)
	}

	const MontantRégularisation = () => {
		return (
			<Montant
				id={`${dottedName.replace(/\s|\./g, '_')}__régularisation-${monthName}`}
				dottedName={dottedName}
				rémunérationBrute={data.rémunérationBrute}
				réduction={data.régularisation.value}
				répartition={data.régularisation.répartition}
				displayedUnit={displayedUnit}
				language={language}
				withRépartition={withRépartitionAndRégularisation}
			/>
		)
	}

	return mobileVersion ? (
		<div>
			<StyledMonth>{monthName}</StyledMonth>
			<GridContainer container spacing={2}>
				<Grid item xs={7} sm={4}>
					<RuleLink dottedName="salarié . rémunération . brut" />
				</Grid>
				<Grid item xs={5} sm={5}>
					<RémunérationInput />
				</Grid>
			</GridContainer>

			<Spacing xs />

			<GridContainer container spacing={2}>
				<Grid item>
					<RuleLink dottedName={dottedName} />
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantRéduction />
					</StyledBody>
				</Grid>
			</GridContainer>

			{withRépartitionAndRégularisation && (
				<GridContainer container spacing={2}>
					<StyledGrid item>
						<RuleLink
							dottedName={`${réductionGénéraleDottedName} . régularisation`}
						/>
					</StyledGrid>
					<Grid item>
						<StyledBody>
							<MontantRégularisation />
						</StyledBody>
					</Grid>
				</GridContainer>
			)}

			<GridContainer container>
				<Grid item>
					<OptionsButton />
				</Grid>
			</GridContainer>

			{isOptionVisible && (
				<OptionsContainer>
					<MonthOptions
						month={monthName}
						index={index}
						options={data.options}
						onOptionsChange={onOptionsChange}
					/>
				</OptionsContainer>
			)}
		</div>
	) : (
		<>
			<tr>
				<th scope="row">{monthName}</th>
				<td>
					<RémunérationInput />
				</td>
				<td>
					<MontantRéduction />
				</td>
				{withRépartitionAndRégularisation && (
					<td>
						<MontantRégularisation />
					</td>
				)}
				<td>
					<OptionsButton />
				</td>
			</tr>
			{isOptionVisible && (
				<StyledTableRow>
					<td />
					<td colSpan={withRépartitionAndRégularisation ? 4 : 3}>
						<MonthOptions
							month={monthName}
							index={index}
							options={data.options}
							onOptionsChange={onOptionsChange}
						/>
					</td>
				</StyledTableRow>
			)}
		</>
	)
}

const StyledMonth = styled(Body)`
	font-weight: bold;
	text-transform: capitalize;
	border-bottom: solid 1px ${({ theme }) => theme.colors.bases.primary[100]};
`
const GridContainer = styled(Grid)`
	align-items: baseline;
	justify-content: space-between;
`
const StyledGrid = styled(Grid)`
	margin-bottom: ${({ theme }) => theme.spacings.md};
`
const StyledBody = styled(Body)`
	margin-top: 0;
`
const StyledButton = styled(Button)`
	white-space: nowrap;
`
const OptionsContainer = styled.div`
	margin-top: ${({ theme }) => theme.spacings.xs};
	background-color: ${({ theme }) => theme.colors.bases.primary[200]};
	padding: ${({ theme }) => theme.spacings.sm};
`

const StyledTableRow = styled.tr`
	background-color: ${({ theme }) => theme.colors.bases.primary[200]};
	td {
		padding-top: ${({ theme }) => theme.spacings.sm};
		padding-bottom: ${({ theme }) => theme.spacings.sm};
	}
`
