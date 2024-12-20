import { PublicodesExpression } from 'publicodes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import MonthOptions from '@/components/MonthOptions'
import RuleLink from '@/components/RuleLink'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { FlexCenter } from '@/design-system/global-style'
import { RotatingChevronIcon } from '@/design-system/icons'
import { Grid, Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

import {
	lodeomDottedName,
	MonthState,
	Options,
	rémunérationBruteDottedName,
} from '../utils'
import MontantRéduction from './MontantRéduction'

type Props = {
	monthName: string
	data: MonthState
	index: number
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
	onOptionsChange: (monthIndex: number, options: Options) => void
	mobileVersion?: boolean
}

export type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function LodeomMois({
	monthName,
	data,
	index,
	onRémunérationChange,
	onOptionsChange,
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
			dottedName: rémunérationBruteDottedName,
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
				displaySuggestions={false}
			/>
		)
	}

	const OptionsButton = () => {
		return (
			<Button
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
			</Button>
		)
	}

	const MontantLodeom = () => {
		return (
			<MontantRéduction
				id={`${lodeomDottedName.replace(/\s|\./g, '_')}-${monthName}`}
				rémunérationBrute={data.rémunérationBrute}
				lodeom={data.lodeom.value}
				répartition={data.lodeom.répartition}
				displayedUnit={displayedUnit}
				language={language}
			/>
		)
	}

	const MontantRégularisation = () => {
		return (
			<MontantRéduction
				id={`${lodeomDottedName.replace(
					/\s|\./g,
					'_'
				)}__régularisation-${monthName}`}
				rémunérationBrute={data.rémunérationBrute}
				lodeom={data.régularisation.value}
				répartition={data.régularisation.répartition}
				displayedUnit={displayedUnit}
				language={language}
				displayNull={false}
			/>
		)
	}

	return mobileVersion ? (
		<div>
			<StyledMonth>{monthName}</StyledMonth>
			<GridContainer container spacing={2}>
				<Grid item xs={12} sm={4}>
					<RuleLink dottedName="salarié . rémunération . brut" />
				</Grid>
				<Grid item xs={7} sm={5}>
					<RémunérationInput />
				</Grid>
				<Grid item xs={5} sm={3}>
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

			<Spacing xs />

			<GridContainer container spacing={2}>
				<Grid item>
					<RuleLink dottedName={lodeomDottedName} />
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantLodeom />
					</StyledBody>
				</Grid>
			</GridContainer>

			<GridContainer container spacing={2}>
				<Grid item>
					<RuleLink dottedName="salarié . cotisations . exonérations . réduction générale . régularisation" />
				</Grid>
				<Grid item>
					<StyledBody>
						<MontantRégularisation />
					</StyledBody>
				</Grid>
			</GridContainer>
		</div>
	) : (
		<>
			<tr>
				<th scope="row">{monthName}</th>
				<td>
					<InputContainer>
						<RémunérationInput />
						<OptionsButton />
					</InputContainer>
				</td>
				<td>
					<MontantLodeom />
				</td>
				<td>
					<MontantRégularisation />
				</td>
			</tr>
			{isOptionVisible && (
				<StyledTableRow>
					<td />
					<td colSpan={3}>
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
const StyledBody = styled(Body)`
	margin-top: 0;
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
const InputContainer = styled.div`
	${FlexCenter}
	gap: ${({ theme }) => theme.spacings.md};
`
