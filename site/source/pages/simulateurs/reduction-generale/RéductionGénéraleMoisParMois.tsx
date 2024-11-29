import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'

import RéductionGénéraleMoisParMoisRow from './components/RéductionGénéraleMoisParMoisRow'
import Warnings from './components/Warnings'
import { MonthState, Options, réductionGénéraleDottedName } from './utils'

type Props = {
	data: MonthState[]
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
	onOptionsChange: (monthIndex: number, options: Options) => void
}

export default function RéductionGénéraleMoisParMois({
	data,
	onRémunérationChange,
	onOptionsChange,
}: Props) {
	const { t } = useTranslation()

	const months = [
		t('janvier'),
		t('février'),
		t('mars'),
		t('avril'),
		t('mai'),
		t('juin'),
		t('juillet'),
		t('août'),
		t('septembre'),
		t('octobre'),
		t('novembre'),
		t('décembre'),
	]

	return (
		<>
			<StyledTable style={{ width: '100%' }}>
				<caption>
					{t(
						'pages.simulateurs.réduction-générale.month-by-month.caption',
						'Réduction générale mois par mois :'
					)}
				</caption>
				<thead>
					<tr>
						<th scope="col">{t('Mois')}</th>
						<th scope="col">
							{t('Rémunération brute')}
							<ExplicableRule dottedName="salarié . rémunération . brut" />
						</th>
						<th scope="col">
							{t('Réduction générale')}
							<ExplicableRule dottedName={réductionGénéraleDottedName} light />
						</th>
						<th scope="col">
							{t('Régularisaton')}
							<ExplicableRule
								dottedName="salarié . cotisations . exonérations . réduction générale . régularisation"
								light
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 &&
						months.map((monthName, monthIndex) => (
							<RéductionGénéraleMoisParMoisRow
								key={`month-${monthIndex}`}
								monthName={monthName}
								data={data[monthIndex]}
								index={monthIndex}
								onRémunérationChange={(
									monthIndex: number,
									rémunérationBrute: number
								) => {
									onRémunérationChange(monthIndex, rémunérationBrute)
								}}
								onOptionsChange={(monthIndex: number, options: Options) => {
									onOptionsChange(monthIndex, options)
								}}
							/>
						))}
				</tbody>
			</StyledTable>

			<span id="options-description" className="sr-only">
				{t(
					'pages.simulateurs.réduction-générale.options.description',
					"Ajoute des champs pour moduler l'activité du salarié"
				)}
			</span>

			<Warnings />
		</>
	)
}

const StyledTable = styled.table`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
	color: ${({ theme }) => theme.colors.bases.primary[100]};
	font-family: ${({ theme }) => theme.fonts.main};
	caption {
		text-align: left;
		margin: ${({ theme }) => `${theme.spacings.sm} 0 `};
	}
	th,
	td {
		padding: ${({ theme }) => theme.spacings.xs};
	}
	tbody tr th {
		text-transform: capitalize;
		font-weight: normal;
	}
`
