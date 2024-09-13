import { Trans, useTranslation } from 'react-i18next'

import './PaySlip.css'

import { H4 } from '@/design-system/typography/heading'

import { Condition } from '../EngineValue/Condition'
import Line from './Line'

export default function SalaireNet() {
	const { t } = useTranslation()

	return (
		<div className="payslip__salarySection">
			<H4 className="payslip__salaryTitle" as="h3">
				<Trans>Salaire net</Trans>
			</H4>
			<Line rule="salarié . rémunération . net . imposable" />
			<Condition
				expression={{
					'toutes ces conditions': [
						'salarié . rémunération . avantages en nature', // bool
						'salarié . rémunération . frais professionnels . titres-restaurant', // bool
					],
				}}
			>
				<Line rule="salarié . rémunération . net . à payer avant impôt" />
			</Condition>
			<Line
				negative
				rule="salarié . rémunération . avantages en nature . montant"
			/>
			<Line
				negative
				rule="salarié . rémunération . frais professionnels . titres-restaurant . montant"
			/>
			<Line rule="salarié . rémunération . montant net social" />
			<Line rule="salarié . rémunération . net . à payer avant impôt" />
			<Condition expression="impôt . montant > 0">
				<Line
					negative
					rule="impôt . montant"
					title={t('impôt sur le revenu')}
					unit="€/mois"
				/>
				<Line rule="salarié . rémunération . net . payé après impôt" />
			</Condition>
		</div>
	)
}
