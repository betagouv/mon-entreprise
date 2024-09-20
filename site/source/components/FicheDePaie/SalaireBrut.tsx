import { Trans } from 'react-i18next'

import { H4 } from '@/design-system/typography/heading'

import { Condition } from '../EngineValue/Condition'
import Line from './Line'

import './PaySlip.css'

export default function SalaireBrut() {
	return (
		<div className="payslip__salarySection">
			<H4 className="payslip__salaryTitle" as="h3">
				<Trans>Salaire</Trans>
			</H4>
			<Line rule="salarié . contrat . salaire brut" />
			<Line rule="salarié . rémunération . avantages en nature . montant" />
			<Line rule="salarié . activité partielle . retrait absence" />
			<Line rule="salarié . activité partielle . indemnités" />
			<Line rule="salarié . rémunération . heures supplémentaires" />
			<Line rule="salarié . rémunération . heures complémentaires" />
			<Line rule="salarié . rémunération . primes" />
			<Line rule="salarié . rémunération . frais professionnels" />
			<Line rule="salarié . rémunération . indemnités CDD" />
			<Condition expression="salarié . contrat . salaire brut != salarié . rémunération . brut">
				<Line rule="salarié . rémunération . brut" />
			</Condition>
		</div>
	)
}
