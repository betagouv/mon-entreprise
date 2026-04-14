import { useTranslation } from 'react-i18next'

import '@/components/FicheDePaie/FicheDePaie.css'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/FicheDePaie/Line'
import { SalaireLine } from '@/components/FicheDePaie/SalaireLine'
import { H3, H4 } from '@/design-system'

export const SalaireNet = () => {
	const { t } = useTranslation()

	return (
		<section className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">{t('Salaire net')}</H3>

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
						<H4>{t('Remboursements et déductions diverses')}</H4>
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
					<H4>{t('Impôt sur le revenu')}</H4>
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
