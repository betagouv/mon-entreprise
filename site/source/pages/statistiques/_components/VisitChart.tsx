import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Message, Radio, ToggleGroup } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'

import { Visites } from '../types'
import { AccessibleTable } from './AccessibleTable'
import Chart, { formatLegend } from './Chart'

type Period = 'jours' | 'mois'

export default function VisitChart({
	visitesJours,
	visitesMois,
	accessibleMode,
}: {
	visitesJours: Visites
	visitesMois: Visites
	accessibleMode: boolean
}) {
	const [period, setPeriod] = useState<Period>('mois')
	const visites = period === 'jours' ? visitesJours : visitesMois
	const { t } = useTranslation()

	return (
		<>
			<Body style={{ textAlign: 'right', marginTop: '-2rem' }}>
				<span id="mode-affichage-label">Afficher les visites par :</span>
				<Spacing xs />
				<ToggleGroup
					onChange={(val) => setPeriod(val as Period)}
					defaultValue={period}
					aria-labelledby="mode-affichage-label"
					aria-controls="visites-panel"
				>
					<Radio value="jours">
						<Trans>Jours</Trans>
					</Radio>
					<Radio value="mois">
						<Trans>Mois</Trans>
					</Radio>
				</ToggleGroup>
			</Body>

			{visites.length ? (
				accessibleMode ? (
					<AccessibleTable
						period={period}
						data={visites.map(({ date, nombre }) => ({
							date,
							nombre: typeof nombre === 'number' ? { visites: nombre } : nombre,
						}))}
						formatKey={formatLegend}
						caption={
							<Trans>
								Tableau indiquant le nombre de visites par{' '}
								{{ period: period === 'jours' ? t('jours') : t('mois') }}.
							</Trans>
						}
					/>
				) : (
					<Chart period={period} data={visites} />
				)
			) : (
				<Message type="info">
					<Body>Aucune donnée disponible.</Body>
				</Message>
			)}
		</>
	)
}
