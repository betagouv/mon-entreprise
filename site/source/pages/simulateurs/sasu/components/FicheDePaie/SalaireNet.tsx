import { Trans, useTranslation } from 'react-i18next'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SalaireLine } from '@/components/simulationExplanation/FicheDePaie/SalaireLine'
import { H3, H4 } from '@/design-system'

export const SalaireNet = () => {
	const { t } = useTranslation()

	return (
		<section className="payslip__salarySection">
			<H3 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</H3>

			<ul>
				<li>
					<SalaireLine
						rule="assimilé salarié . rémunération . montant net social"
						title={t('Montant net social')}
					/>
				</li>
				<Condition
					expression={'assimilé salarié . rémunération . avantages en nature'}
				>
					<li>
						<H4>
							<Trans>Remboursements et déductions diverses</Trans>
						</H4>

						<ul>
							<Line
								negative
								rule="assimilé salarié . rémunération . avantages en nature . montant"
							/>
						</ul>
					</li>
				</Condition>

				<li>
					<SalaireLine
						rule="assimilé salarié . rémunération . nette . à payer avant impôt"
						title={t('Montant net à payer avant impôt sur le revenu')}
					/>
				</li>
				<li>
					<H4>
						<Trans>Impôt sur le revenu</Trans>
					</H4>

					<ul>
						<Line
							rule="assimilé salarié . rémunération . nette . imposable"
							title={t('Montant net imposable')}
						/>
						<Line
							negative
							rule="assimilé salarié . rémunération . impôt"
							title={t('impôt sur le revenu prélevé à la source')}
						/>
					</ul>
				</li>

				<li>
					<SalaireLine
						rule="assimilé salarié . rémunération . nette . après impôt"
						title={t('Montant net à payer')}
					/>
				</li>
			</ul>
		</section>
	)
}
