import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'
import { useTranslation } from 'react-i18next'
import { styled, useTheme } from 'styled-components'

import { roundedPercentages } from '@/utils/number'

export type BarType = 'revenu' | 'cotisations' | 'impôt'

type BarProps = {
	value: number
	legend: React.ReactNode
	title: string
}

export type InnerStackedBarChartProps = {
	data: Record<BarType, BarProps>
}

export default function InnerStackedBarChart({
	data,
}: InnerStackedBarChartProps) {
	const { i18n } = useTranslation()
	const { colors } = useTheme()

	const itemColor = {
		revenu: colors.bases.primary[600],
		cotisations: colors.bases.secondary[500],
		impôt: colors.extended.grey[700],
	} satisfies Record<BarType, string>

	const percentages = roundedPercentages(R.map(data, (d) => d.value))

	const dataWithPercentage = R.map(data, (data, index: BarType) => ({
		...data,
		percentage: percentages[index],
	}))

	return (
		<>
			<BarStack className="print-background-force">
				{pipe(
					dataWithPercentage,
					// <BarItem /> has a border so we don't want to display empty bars
					// (even with width 0).
					R.filter(({ percentage }) => percentage !== 0),
					R.toEntries,
					A.map(([index, { percentage, title }]) => (
						<BarItem
							key={index}
							style={{
								width: `${percentage}%`,
								backgroundColor: itemColor[index as BarType],
							}}
							role="img"
							aria-label={`${title}, ${percentage}%`}
						/>
					))
				)}
			</BarStack>
			<BarStackLegend className="print-background-force">
				{pipe(
					dataWithPercentage,
					R.toEntries,
					A.map(([index, { percentage, legend }]) => (
						<BarStackLegendItem key={index}>
							<SmallCircle style={{ backgroundColor: itemColor[index] }} />
							{legend}
							<strong>
								{Intl.NumberFormat(i18n.language).format(percentage)} %
							</strong>
						</BarStackLegendItem>
					))
				)}
			</BarStackLegend>
		</>
	)
}

const BarStack = styled.div`
	display: flex;
	border-radius: 0.4em;
	overflow: hidden;
	font-family: ${({ theme }) => theme.fonts.main};
`

const BarItem = styled.div`
	font-family: ${({ theme }) => theme.fonts.main};
	height: 26px;
	border-right: 2px solid white;
	transition: width 0.3s ease-out;

	&:last-child {
		border-right: none;
	}
`

const BarStackLegend = styled.ul`
	font-family: ${({ theme }) => theme.fonts.main};
	display: flex;
	margin: 10px 0 0;
	padding: 0;
	flex-direction: column;
	justify-content: space-between;
	list-style: none;

	@media (min-width: 800px) {
		flex-direction: row;
		text-align: center;
	}
`

const BarStackLegendItem = styled.li`
	font-family: ${({ theme }) => theme.fonts.main};
	background-color: inherit;
	strong {
		display: inline-block;
		margin-left: 8px;
	}
`

const SmallCircle = styled.span`
	display: inline-block;
	height: 11px;
	width: 11px;
	margin-right: 10px;
	border-radius: 100%;
`
