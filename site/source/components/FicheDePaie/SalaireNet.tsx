import { Trans, useTranslation } from 'react-i18next'

import './FicheDePaie.css'

import { H3, H4 } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { ExplicableRule } from '../conversation/Explicable'
import { Condition } from '../EngineValue/Condition'
import Value from '../EngineValue/Value'
import Line from './Line'

function SalaireLine({ rule, title }: { rule: DottedName; title?: string }) {
	return (
		<div className="payslip__paymentLine">
			<H4>
				{title}
				<ExplicableRule light dottedName={rule} />
			</H4>
			<Value linkToRule={false} expression={rule} unit="€" displayedUnit="€" />
		</div>
	)
}

export default function SalaireNet() {
	const { t } = useTranslation()

	return (
		<section className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</H3>

			<ul>
				<li>
					<SalaireLine
						rule="salarié . rémunération . montant net social"
						title={t('Montant net social')}
					/>
				</li>
				<Condition
					expression={{
						'une de ces conditions': [
							'salarié . rémunération . frais professionnels . trajets domicile travail . déductible > 0',
							'salarié . rémunération . frais professionnels . titres-restaurant', // bool
							'salarié . rémunération . avantages en nature', // bool
						],
					}}
				>
					<li>
						<H4>
							<Trans>Remboursements et déductions diverses</Trans>
						</H4>

						<ul>
							<Line
								rule="salarié . rémunération . frais professionnels . trajets domicile travail . employeur"
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
						</ul>
					</li>
				</Condition>

				<li>
					<SalaireLine
						rule="salarié . rémunération . net . à payer avant impôt"
						title={t('Montant net à payer avant impôt sur le revenu')}
					/>
				</li>
				<li>
					<H4>
						<Trans>Impôt sur le revenu</Trans>
					</H4>

					<ul>
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
					</ul>
				</li>

				<li>
					<SalaireLine
						rule="salarié . rémunération . net . payé après impôt"
						title={t('Montant net à payer')}
					/>
				</li>
			</ul>
		</section>
	)
}
