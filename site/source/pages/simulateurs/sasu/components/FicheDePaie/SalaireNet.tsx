import { useTranslation } from 'react-i18next'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SalaireLine } from '@/components/simulationExplanation/FicheDePaie/SalaireLine'
import { SectionSalaireNet } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireNet'
import { H4 } from '@/design-system'

export const SalaireNet = () => {
	const { t } = useTranslation()

	return (
		<SectionSalaireNet
			montantNetSocial={
				<SalaireLine
					rule="assimilé salarié . rémunération . montant net social"
					title={t(
						'pages.simulateurs.salarié.fiche-de-paie.salaire-net.mns',
						'Montant net social'
					)}
				/>
			}
			remboursementsEtRéductions={
				<Condition
					expression={'assimilé salarié . rémunération . avantages en nature'}
				>
					<li>
						<H4>
							{t(
								'pages.simulateurs.salarié.fiche-de-paie.titres.salaire-net.avantages',
								'Avantages en nature'
							)}
						</H4>

						<ul>
							<Line
								negative
								rule="assimilé salarié . rémunération . avantages en nature . montant"
							/>
						</ul>
					</li>
				</Condition>
			}
			netAvantImpôt={
				<SalaireLine
					rule="assimilé salarié . rémunération . nette . à payer avant impôt"
					title={t(
						'pages.simulateurs.salarié.fiche-de-paie.salaire-net.net-avant-impôt',
						'Montant net à payer avant impôt sur le revenu'
					)}
				/>
			}
			impôt={
				<>
					<Line
						rule="assimilé salarié . rémunération . nette . imposable"
						title={t(
							'pages.simulateurs.salarié.fiche-de-paie.salaire-net.impôt.net-imposable',
							'Montant net imposable'
						)}
					/>
					<Line
						negative
						rule="assimilé salarié . rémunération . impôt"
						title={t(
							'pages.simulateurs.salarié.fiche-de-paie.salaire-net.impôt.PAS',
							'impôt sur le revenu prélevé à la source'
						)}
					/>
				</>
			}
			netAprèsImpôt={
				<SalaireLine
					rule="assimilé salarié . rémunération . nette . après impôt"
					title={t(
						'pages.simulateurs.salarié.fiche-de-paie.salaire-net.net-après-impôt',
						'Montant net à payer'
					)}
				/>
			}
		/>
	)
}
