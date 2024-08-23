import { Trans, useTranslation } from 'react-i18next'

import './FicheDePaie.css'

import { DottedName } from 'modele-social'

import { H3, H5 } from '@/design-system/typography/heading'

import { ExplicableRule } from '../conversation/Explicable'
import { Condition } from '../EngineValue/Condition'
import Value from '../EngineValue/Value'
import Line from './Line'

function SalaireLine({ rule, title }: { rule: DottedName; title?: string }) {
	return (
		<>
			<H5>
				{title}
				<ExplicableRule light dottedName={rule} />
			</H5>
			<Value linkToRule={false} expression={rule} unit="€" displayedUnit="€" />
		</>
	)
}

export default function SalaireNet() {
	const { t } = useTranslation()

	return (
		<div className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</H3>

			<SalaireLine
				rule="salarié . rémunération . MNS"
				title={t('Montant net social')}
			/>

			<Condition
				expression={{
					'une de ces conditions': [
						'salarié . rémunération . frais professionnels . trajets domicile travail . déductible > 0',
						'salarié . rémunération . frais professionnels . titres-restaurant', // bool
						'salarié . rémunération . avantages en nature', // bool
					],
				}}
			>
				<H5>
					<Trans>Remboursements et déductions diverses</Trans>
				</H5>
				<span />
			</Condition>
			<Line
				rule="salarié . rémunération . frais professionnels . trajets domicile travail . déductible"
				title={t('Frais de transport')}
			/>
			<Line
				negative
				rule="salarié . rémunération . frais professionnels . titres-restaurant . salarié"
				title={t('Titres-restaurant')}
			/>
			<Line
				negative
				rule="salarié . rémunération . avantages en nature . montant"
			/>

			<SalaireLine
				rule="salarié . rémunération . net . à payer avant impôt"
				title={t('Montant net à payer avant impôt sur le revenu')}
			/>

			<H5>
				<Trans>Impôt sur le revenu</Trans>
			</H5>
			<span />
			<Line
				rule="salarié . rémunération . net . imposable"
				title={t('Montant net imposable')}
			/>
			<Line
				rule="salarié . rémunération . net . imposable . heures supplémentaires et complémentaires défiscalisées"
				title={t('Montant net des HC/HS exonérées')}
			/>
			<Line
				negative
				rule="impôt . montant"
				title={t('impôt sur le revenu prélevé à la source')}
			/>

			<SalaireLine
				rule="salarié . rémunération . net . payé après impôt"
				title={t('Montant net à payer')}
			/>
		</div>
	)
}
