import RuleLink from '@/components/RuleLink'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { InstitutionLogo } from '@/components/simulationExplanation/InstitutionsPartenaires'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import { useIsEmbedded } from '@/components/utils/embeddedContext'
import { useEngine } from '@/components/utils/EngineContext'
import { Li, Ul } from '@/design-system/typography/list'
import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { CIPAV as logoCIPAVsrc } from '@/images/logos-caisses-retraite'
import logoURSSAFsrc from '@/images/Urssaf.svg'
import { ResultTable } from './ChômagePartiel'

export default function SimulateurCotisationCipav2023() {
	return (
		<>
			<Simulation
				results={<ExplanationSection />}
				customEndMessages={
					<span className="ui__ notice">Voir les résultats en-dessous</span>
				}
			>
				<SimulationGoals legend="Salaire brut avant chômage partiel">
					<SimulationGoal
						dottedName="dirigeant . indépendant . revenu professionnel"
						résumé="Utilisé pour le calcul des cotisations retraite"
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}

function ExplanationSection() {
	return (
		<FromTop>
			<div
				className="ui__ light card"
				css={`
					overflow: hidden;
					margin: 1rem 0;
				`}
			>
				<ResultTable>
					<tbody>
						<tr>
							<th></th>
							<th>en 2022</th>
							<th>en 2023</th>
						</tr>
						<tr>
							<td>
								<strong>Organisme collecteur</strong>
								<p className="ui__ notice">
									À partir de 2023 l'Urssaf prend en charge la collecte de vos
									cotisations retraites
								</p>
							</td>
							<td>
								<InstitutionLogo
									href="http://www.ircec.fr/"
									target="_blank"
									rel="noreferrer"
								>
									<img src={logoCIPAVsrc} alt="Logo Cipav" />
								</InstitutionLogo>
							</td>
							<td>
								<InstitutionLogo
									href="http://www.ircec.fr/"
									target="_blank"
									rel="noreferrer"
								>
									<img src={logoURSSAFsrc} alt="Logo Urssaf" />
								</InstitutionLogo>
							</td>
						</tr>
						<tr>
							<td>Retraite de base</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CNAVPL . retraite" />
							</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CNAVPL . retraite" />
							</td>
						</tr>
						<tr>
							<td>Retraite complémentaire</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CIPAV . retraite complémentaire" />
							</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CIPAV . cotisation 2023 . retraite complémentaire" />
							</td>
						</tr>
						<tr>
							<td>Invalidité-décès</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CIPAV . invalidité et décès" />
							</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CIPAV . cotisation 2023 . invalidité et décès" />
							</td>
						</tr>
						<tr>
							<td>
								<strong>Total</strong>
							</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . cotisations caisse de retraite" />
							</td>
							<td>
								<ValueWithLink dottedName="dirigeant . indépendant . PL . CIPAV . cotisation 2023" />
							</td>
						</tr>
					</tbody>
				</ResultTable>
			</div>
		</FromTop>
	)
}

function ValueWithLink({ dottedName }: { dottedName: DottedName }) {
	const { language } = useTranslation().i18n
	const engine = useEngine()

	return (
		<RuleLink dottedName={dottedName}>
			{formatValue(engine.evaluate(dottedName), {
				language,
				displayedUnit: '€',
				precision: 0,
			})}
		</RuleLink>
	)
}
