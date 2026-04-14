import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import '@/components/FicheDePaie/FicheDePaie.css'

import { RègleModèleAssimiléSalarié } from 'modele-as'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'
import { CotisationLine } from '@/components/FicheDePaie/CotisationLine'
import { getCotisationsBySection } from '@/components/FicheDePaie/utils'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { H3 } from '@/design-system'
import { useEngine } from '@/utils/publicodes/EngineContext'

const ORDRE_DES_SECTIONS = [
	'assimilé salarié . cotisations . catégories . maladie',
	'assimilé salarié . cotisations . catégories . atmp',
	'assimilé salarié . cotisations . catégories . retraite',
	'assimilé salarié . cotisations . catégories . divers',
	'assimilé salarié . cotisations . catégories . CSG-CRDS',
	'assimilé salarié . cotisations . catégories . exonérations',
	'assimilé salarié . cotisations . catégories . facultatives',
] as Array<RègleModèleAssimiléSalarié>

export const Cotisations = () => {
	const { t } = useTranslation()
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(
		'assimilé salarié',
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
										namespace="assimilé salarié"
										dottedName={cotisation as RègleModèleAssimiléSalarié}
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
				<ExplicableRule light dottedName="assimilé salarié . cotisations" />
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
								expression="assimilé salarié . cotisations . employeur"
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
						<td>
							<Value
								expression="assimilé salarié . cotisations . salarié"
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
