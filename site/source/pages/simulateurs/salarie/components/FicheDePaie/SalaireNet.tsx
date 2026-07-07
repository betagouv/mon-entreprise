import { useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { SalaireLine } from '@/components/simulationExplanation/FicheDePaie/SalaireLine'
import { SectionSalaireNet } from '@/components/simulationExplanation/FicheDePaie/SectionSalaireNet'
import {
	Liste,
	Titre,
} from '@/components/simulationExplanation/FicheDePaie/styledComponents'

export const SalaireNet = () => {
	const { t } = useTranslation()

	return (
		<SectionSalaireNet
			montantNetSocial={
				<SalaireLine
					rule="salarie . rémunération . montant net social"
					title={t(
						'components.fiche-de-paie.salaire-net.mns',
						'Montant net social'
					)}
				/>
			}
			remboursementsEtRéductions={
				<Condition
					expression={{
						'une de ces conditions': [
							'salarie . rémunération . frais professionnels . trajets domicile travail . déductible > 0',
							'salarie . rémunération . frais professionnels . titres-restaurant', // bool
							'salarie . rémunération . avantages en nature', // bool
						],
					}}
				>
					<li>
						<Titre>
							{t(
								'components.fiche-de-paie.salaire-net.remboursements.titre',
								'Remboursements et déductions diverses'
							)}
						</Titre>
						<Liste>
							<Line
								rule="salarie . rémunération . frais professionnels . trajets domicile travail . déductible"
								title={t(
									'components.fiche-de-paie.salaire-net.remboursements.transport',
									'Frais de transport'
								)}
							/>
							<Line
								negative
								rule="salarie . rémunération . frais professionnels . titres-restaurant . déductible"
								title={t(
									'components.fiche-de-paie.salaire-net.remboursements.titres-restaurant',
									'Titres-restaurant'
								)}
							/>
							<Line
								negative
								rule="salarie . rémunération . avantages en nature . montant"
							/>
						</Liste>
					</li>
				</Condition>
			}
			netAvantImpôt={
				<SalaireLine
					rule="salarie . rémunération . net . à payer avant impôt"
					title={t(
						'components.fiche-de-paie.salaire-net.net-avant-impôt',
						'Montant net à payer avant impôt sur le revenu'
					)}
				/>
			}
			impôt={
				<>
					<Line
						rule="salarie . rémunération . net . imposable"
						title={t(
							'components.fiche-de-paie.salaire-net.impôt.net-imposable',
							'Montant net imposable'
						)}
					/>
					<Line
						rule="salarie . rémunération . net . imposable . heures supplémentaires et complémentaires défiscalisées"
						title={t(
							'components.fiche-de-paie.salaire-net.impôt.heures-sup',
							'Montant net des HC/HS exonérées'
						)}
					/>
					<Line
						negative
						rule="impôt . montant"
						title={t(
							'components.fiche-de-paie.salaire-net.impôt.PAS',
							'Impôt sur le revenu prélevé à la source'
						)}
					/>
				</>
			}
			netAprèsImpôt={
				<SalaireLine
					rule="salarie . rémunération . net . payé après impôt"
					title={t(
						'components.fiche-de-paie.salaire-net.net-après-impôt',
						'Montant net à payer'
					)}
				/>
			}
		/>
	)
}
