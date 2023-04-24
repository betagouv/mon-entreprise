import { ComponentProps, ReactElement, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
	Bar,
	BarChart,
	LabelList,
	ReferenceLine,
	Tooltip,
	XAxis,
} from 'recharts'
import styled from 'styled-components'

import { StyledLegend } from '@/components/charts/PagesCharts'
import { Radio, ToggleGroup } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useDarkMode } from '@/hooks/useDarkMode'

import { AccessibleTable } from './AccessibleTable'
import { RealResponsiveContainer } from './Chart'
import { SatisfactionLevel } from './types'

export const SatisfactionStyle: [
	SatisfactionLevel,
	{ emoji: string; color: string }
][] = [
	[SatisfactionLevel.Mauvais, { emoji: '🙁', color: '#D3675F' }],
	[SatisfactionLevel.Moyen, { emoji: '😐', color: '#9C860D' }],
	[SatisfactionLevel.Bien, { emoji: '🙂', color: '#289D20' }],
	[SatisfactionLevel.TrèsBien, { emoji: '😀', color: '#149474' }],
]

function toPercentage(data: Record<string, number>) {
	const total = Object.values(data).reduce((a, b: number) => a + b, 0)

	return {
		percent: Object.fromEntries(
			Object.entries(data).map(([key, value]) => [key, (100 * value) / total])
		),
		total,
	}
}

type SatisfactionChartProps = {
	accessibleMode: boolean
	data: Array<{
		date: string
		nombre: Record<string, number>
		percent: Record<string, number>
	}>
}

type DataType = 'nombres' | 'pourcentage'

export default function SatisfactionChart({
	data,
	accessibleMode,
}: SatisfactionChartProps) {
	const [darkMode] = useDarkMode()
	const [dataType, setDataType] = useState<DataType>('nombres')
	const { t } = useTranslation()
	if (!data.length) {
		return null
	}

	const flattenData = data
		.map((d) => ({
			...d,
			...toPercentage(d.nombre),
			info:
				d.date === '2022-01-01T00:00:00.000Z' ? (
					<ChangeJanuary2022 />
				) : d.date === '2023-01-01T00:00:00.000Z' ? (
					<ChangeJanuary2023 />
				) : null,
		}))
		.filter((d) => Object.values(d.nombre).reduce((a, b) => a + b, 0))

	const BarChartWithRole = (
		props: ComponentProps<typeof BarChart> | { role: string }
	): ReactElement => <BarChart {...props} />

	return (
		<Body as="div">
			<StyledBody id="mode-affichage-satisfaction-label">
				<Trans>Afficher les données par :</Trans>
			</StyledBody>

			<ToggleGroup
				onChange={(val) => setDataType(val as DataType)}
				defaultValue={dataType}
				aria-labelledby="mode-affichage-satisfaction-label"
			>
				<Radio value="nombres">
					<Trans>Nombres</Trans>
				</Radio>
				<Radio value="pourcentage">
					<Trans>Pourcentage</Trans>
				</Radio>
			</ToggleGroup>

			<Spacing sm />

			{accessibleMode ? (
				<AccessibleVersion
					data={flattenData}
					dataType={dataType}
					accessibleMode={accessibleMode}
				/>
			) : (
				<RealResponsiveContainer width="100%" height={400}>
					<BarChartWithRole
						data={flattenData}
						aria-label={t(
							'Graphique statistiques détaillés de la satisfaction, présence d’une alternative accessible après l’image'
						)}
						role="img"
					>
						<XAxis
							dataKey="date"
							tickFormatter={formatMonth}
							angle={-45}
							textAnchor="end"
							height={60}
							minTickGap={-8}
							stroke={darkMode ? 'lightGrey' : 'gray'}
						/>
						<Tooltip content={<CustomTooltip dataType={dataType} />} />

						{SatisfactionStyle.map(([level, { emoji, color }]) => (
							<Bar
								key={level}
								dataKey={`${
									dataType === 'nombres' ? 'nombre' : 'percent'
								}.${level}`}
								stackId="1"
								fill={color}
								maxBarSize={50}
								style={{
									borderTop: 'solid 1px white',
								}}
							>
								<LabelList
									dataKey={`${dataType === 'nombres' ? 'nombre' : 'percent'}`}
									content={() => emoji}
									position="left"
								/>
							</Bar>
						))}

						{flattenData
							.filter(({ info }) => info)
							.map(({ date }) => (
								<ReferenceLine
									key={date}
									x={date}
									stroke={darkMode ? 'lightGrey' : 'darkGray'}
									strokeWidth={2}
								/>
							))}
					</BarChartWithRole>
				</RealResponsiveContainer>
			)}
		</Body>
	)
}

export const round = (num: number, precision = 0) =>
	Math.round(num * 10 ** precision) / 10 ** precision

const AccessibleVersion = ({
	data,
	dataType,
}: SatisfactionChartProps & { dataType: string }) => {
	const { t } = useTranslation()

	const dataKey = dataType === 'pourcentage' ? 'percent' : 'nombre'

	return (
		<AccessibleTable
			period="mois"
			data={data.map(({ date, ...rest }) => ({
				date,
				nombre: {
					// order is important
					'très bien': rest[dataKey]['très bien'],
					bien: rest[dataKey].bien,
					moyen: rest[dataKey].moyen,
					mauvais: rest[dataKey].mauvais,
				},
			}))}
			formatValue={({ value }) =>
				`${round(value, 2)}${dataType === 'pourcentage' ? ' %' : ''}`
			}
			caption={
				<Trans>
					Tableau indiquant la satisfaction des utilisateurs en{' '}
					{{
						percentOrVotes:
							dataType === 'pourcentage'
								? t('pourcentage')
								: t('nombres de votes'),
					}}{' '}
					sur le site mon-entreprise par mois.
				</Trans>
			}
		/>
	)
}

const ChangeJanuary2022 = () => {
	return (
		<Body style={{ maxWidth: '350px' }}>
			<Trans i18nKey="stats.change_january_2022">
				Modification du module de retours utilisateurs entraînant une baisse
				significative des avis
			</Trans>
		</Body>
	)
}

const ChangeJanuary2023 = () => {
	return (
		<Body style={{ maxWidth: '350px' }}>
			<Trans i18nKey="stats.change_january_2023">
				Modification du module de retours utilisateurs
			</Trans>
		</Body>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'short',
		year: '2-digit',
	})
}

interface Stat {
	'très bien': number
	bien: number
	moyen: number
	mauvais: number
}

type CustomTooltipProps = {
	dataType: DataType
	active?: boolean
	payload?: {
		payload?: {
			info: ReactElement | null
			date: string | Date
			nombre: Stat
			percent: Stat
			total: number
		}
	}[]
}

const CustomTooltip = ({ payload, active, dataType }: CustomTooltipProps) => {
	const { date, nombre, percent, total, info } =
		(payload && payload.length > 0 && payload[0].payload) || {}
	const data = dataType === 'pourcentage' ? percent : nombre

	if (!active || !data || !date || typeof total !== 'number') {
		return null
	}

	return (
		<StyledLegend>
			{info}
			<Body>
				Sur{' '}
				<Strong style={total < 10 ? { color: 'red' } : {}}>{total} avis</Strong>{' '}
				en {formatMonth(date)} :
			</Body>
			<Ul size="XS">
				<Li>
					<Strong>
						{Math.round((data['très bien'] ?? 0) + (data.bien ?? 0))}
						{dataType === 'pourcentage' ? '%' : ''}
					</Strong>{' '}
					satisfaits{' '}
					<small>
						({Math.round(data['très bien'] ?? 0)}
						{dataType === 'pourcentage' ? '%' : ''} <Emoji emoji="😀" /> /{' '}
						{Math.round(data.bien ?? 0)}
						{dataType === 'pourcentage' ? '%' : ''} <Emoji emoji="🙂" />)
					</small>
				</Li>
				<Li>
					<Strong>
						{Math.round((data.moyen ?? 0) + (data.mauvais ?? 0))}
						{dataType === 'pourcentage' ? '%' : ''}
					</Strong>{' '}
					négatifs{' '}
					<small>
						({Math.round(data.moyen ?? 0)}
						{dataType === 'pourcentage' ? '%' : ''} <Emoji emoji="😐" /> /{' '}
						{Math.round(data.mauvais ?? 0)}
						{dataType === 'pourcentage' ? '%' : ''} <Emoji emoji="🙁" />)
					</small>
					<Emoji emoji="" />
				</Li>
			</Ul>
		</StyledLegend>
	)
}

const StyledBody = styled(Body)`
	margin-bottom: 0.25rem;
`
