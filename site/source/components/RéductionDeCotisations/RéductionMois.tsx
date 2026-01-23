import { PublicodesExpression } from 'publicodes'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import Montant from '@/components/RéductionDeCotisations/Montant'
import MonthOptions from '@/components/RéductionDeCotisations/MonthOptions'
import RuleLink from '@/components/RuleLink'
import {
	Body,
	Button,
	Grid,
	RotatingChevronIcon,
	Spacing,
} from '@/design-system'
import {
	MonthState,
	Options,
	RéductionDottedName,
	réductionGénéraleDottedName,
} from '@/utils/réductionDeCotisations'

import RémunérationInput from './RémunérationInput'
import { normalizeRuleName } from '../utils/normalizeRuleName'

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
	const [isOptionVisible, setOptionVisible] = useState(false)

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
				<RotatingChevronIcon aria-hidden isOpen={isOptionVisible} />
			</StyledButton>
		)
	}

	const normalizedDottedName = normalizeRuleName(dottedName)

	const MontantRéduction = () => {
		return (
			<Montant
				id={`${normalizedDottedName}-${monthName}`}
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
				id={`${normalizedDottedName}__régularisation-${monthName}`}
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
					<RémunérationInput
						index={index}
						monthName={monthName}
						rémunérationBrute={data.rémunérationBrute}
						onRémunérationChange={onRémunérationChange}
					/>
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
					<RémunérationInput
						index={index}
						monthName={monthName}
						rémunérationBrute={data.rémunérationBrute}
						onRémunérationChange={onRémunérationChange}
					/>
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
