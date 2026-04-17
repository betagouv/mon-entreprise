import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'
import { CotisationLine } from '@/components/simulationExplanation/FicheDePaie/CotisationLine'
import {
	getCotisationsBySection,
	Namespace,
} from '@/components/simulationExplanation/FicheDePaie/utils'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { Section } from './Section'

type Props = {
	namespace: Namespace
	ordreDesSections: Array<RègleModèleAssimiléSalarié | RègleModèleSocial>
}

export const SectionCotisations = ({ namespace, ordreDesSections }: Props) => {
	const { t } = useTranslation()
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(
		namespace,
		parsedRules,
		ordreDesSections
	)

	return (
		<Section
			title={t(
				'composants.fiche-de-paie.titres.cotisations',
				'Cotisations sociales'
			)}
		>
			{cotisationsBySection.map(([sectionDottedName, cotisations]) => {
				const section = parsedRules[sectionDottedName]

				return (
					<Fragment key={section.dottedName}>
						<h4
							id={normalizeRuleName(section.dottedName)}
							className="payslip__cotisationTitle"
						>
							{section.title}
							<ExplicableRule light dottedName={section.dottedName} />
						</h4>
						<table
							className="payslip__cotisationTable"
							aria-labelledby={normalizeRuleName(section.dottedName)}
						>
							<tbody>
								<tr>
									<td></td>
									<th scope="col">
										{t(
											'composants.fiche-de-paie.cotisations.employeur',
											'employeur'
										)}
									</th>
									<th scope="col">
										{t(
											'composants.fiche-de-paie.cotisations.salarie',
											'salarié'
										)}
									</th>
								</tr>
								{cotisations.map((cotisation) => (
									<CotisationLine
										key={cotisation}
										namespace={namespace}
										dottedName={cotisation as RègleModèleSocial}
									/>
								))}
							</tbody>
						</table>
					</Fragment>
				)
			})}

			{/* Total cotisation */}
			<h4 id="total_cotisation" className="payslip__cotisationTitle">
				{t(
					'composants.fiche-de-paie.cotisations.total',
					'Total des cotisations et contributions'
				)}
				<ExplicableRule light dottedName={`${namespace} . cotisations`} />
			</h4>
			<table
				className="payslip__cotisationTable"
				aria-labelledby="total_cotisation"
			>
				<tbody>
					<tr>
						<td></td>
						<th scope="col">
							{t('composants.fiche-de-paie.cotisations.employeur', 'employeur')}
						</th>
						<th scope="col">
							{t('composants.fiche-de-paie.cotisations.salarie', 'salarié')}
						</th>
					</tr>
					<tr>
						<th scope="row" className="payslip__total-th">
							{t(
								'composants.fiche-de-paie.cotisations.total',
								'Total des cotisations et contributions'
							)}
						</th>
						<td>
							<Value
								expression={`${namespace} . cotisations . employeur`}
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
						<td>
							<Value
								expression={`${namespace} . cotisations . salarié`}
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</Section>
	)
}
