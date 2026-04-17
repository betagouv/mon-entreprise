import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import '@/components/simulationExplanation/FicheDePaie/FicheDePaie.css'

import { RègleModèleSocial } from 'modele-social'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'
import { CotisationLine } from '@/components/simulationExplanation/FicheDePaie/CotisationLine'
import { getCotisationsBySection } from '@/components/simulationExplanation/FicheDePaie/utils'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { H3 } from '@/design-system'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const ORDRE_DES_SECTIONS = [
	'salarié . cotisations . catégories . maladie',
	'salarié . cotisations . catégories . atmp',
	'salarié . cotisations . catégories . retraite',
	'salarié . cotisations . catégories . chômage',
	'salarié . cotisations . catégories . divers',
	'salarié . cotisations . catégories . CSG-CRDS',
	'salarié . cotisations . catégories . exonérations',
	'salarié . cotisations . catégories . facultatives',
] as Array<RègleModèleSocial>

export const Cotisations = () => {
	const { t } = useTranslation()
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(
		'salarié',
		parsedRules,
		ORDRE_DES_SECTIONS
	)

	return (
		<section className="payslip__cotisationsSection">
			<H3>{t('Cotisations sociales')}</H3>

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
									<th scope="col">{t('cotisations.employeur', 'employeur')}</th>
									<th scope="col">{t('cotisations.salarie', 'salarié')}</th>
								</tr>
								{cotisations.map((cotisation) => (
									<CotisationLine
										key={cotisation}
										namespace="salarié"
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
				{t('Total des cotisations et contributions')}
				<ExplicableRule light dottedName="salarié . cotisations" />
			</h4>
			<table
				className="payslip__cotisationTable"
				aria-labelledby="total_cotisation"
			>
				<tbody>
					<tr>
						<td></td>
						<th scope="col">employeur</th>
						<th scope="col">salarié</th>
					</tr>
					<tr>
						<th scope="row" className="payslip__total-th">
							{t('Total des cotisations et contributions')}
						</th>
						<td>
							<Value
								expression="salarié . cotisations . employeur"
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
						<td>
							<Value
								expression="salarié . cotisations . salarié"
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	)
}
