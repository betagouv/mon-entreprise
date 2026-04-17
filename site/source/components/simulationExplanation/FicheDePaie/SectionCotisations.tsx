import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { CotisationLine } from '@/components/simulationExplanation/FicheDePaie/CotisationLine'
import {
	getCotisationsBySection,
	Namespace,
} from '@/components/simulationExplanation/FicheDePaie/utils'
import { normalizeRuleName } from '@/components/utils/normalizeRuleName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { Section } from './Section'
import { EnTête, Titre } from './styledComponents'

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
				const id = normalizeRuleName(section.dottedName)

				return (
					<Fragment key={section.dottedName}>
						<Titre id={id}>
							{section.title}
							<ExplicableRule light dottedName={section.dottedName} />
						</Titre>
						<Table aria-labelledby={id}>
							<tbody>
								<tr>
									<td></td>
									<th scope="col">
										<EnTête>
											{t(
												'composants.fiche-de-paie.cotisations.employeur',
												'Employeur'
											)}
										</EnTête>
									</th>
									<th scope="col">
										<EnTête>
											{t(
												'composants.fiche-de-paie.cotisations.salarie',
												'Salarié'
											)}
										</EnTête>
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
						</Table>
					</Fragment>
				)
			})}

			{/* Total cotisation */}
			<Titre id="total_cotisation">
				{t(
					'composants.fiche-de-paie.cotisations.total',
					'Total des cotisations et contributions'
				)}
			</Titre>
			<Table aria-labelledby="total_cotisation">
				<tbody>
					<tr>
						<td></td>
						<th scope="col">
							<EnTête>
								{t(
									'composants.fiche-de-paie.cotisations.employeur',
									'Employeur'
								)}
							</EnTête>
						</th>
						<th scope="col">
							<EnTête>
								{t('composants.fiche-de-paie.cotisations.salarie', 'Salarié')}
							</EnTête>
						</th>
					</tr>
					<tr>
						<th scope="row">
							<RuleLink
								dottedName={`${namespace} . cotisations`}
								aria-label={t(
									'composants.fiche-de-paie.cotisations.aria-label-total',
									'Voir les détails du calcul pour : Total des cotisations et contributions'
								)}
							>
								{t(
									'composants.fiche-de-paie.cotisations.total',
									'Total des cotisations et contributions'
								)}
							</RuleLink>
						</th>
						<td>
							<Value
								expression={`${namespace} . cotisations . employeur`}
								displayedUnit="€"
								linkToRule={false}
							/>
						</td>
						<td>
							<Value
								expression={`${namespace} . cotisations . salarié`}
								displayedUnit="€"
								linkToRule={false}
							/>
						</td>
					</tr>
				</tbody>
			</Table>
		</Section>
	)
}

const Table = styled.table`
	width: 100%;
	border-spacing: 0;

	tr {
		display: grid;
		grid-template-columns: 3fr 1fr 1fr;
	}

	tr:nth-of-type(2n)+* {
		background-color: rgba(255, 255, 255, 0.4);
	}

	th[scope='row'] {
		text-align: left;
	}

	th[scope='col'] {
		text-align: right;
	}

	td {
		display: flex;
		justify-content: flex-end;
		font-family: 'Courier New', Courier, monospace;
		text-align: right;
	}
`
