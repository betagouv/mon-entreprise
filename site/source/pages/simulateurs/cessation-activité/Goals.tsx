import { useTranslation } from 'react-i18next'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { CessationActivitéToggles } from '@/pages/simulateurs/cessation-activité/Toggles'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const CessationActivitéGoals = () => {
	const engine = useEngine()
	const dividendesValue = engine.evaluate('indépendant . dividendes')
		.nodeValue as number
	const dividendesVersés = dividendesValue > 0
	const { t } = useTranslation()

	return (
		<SimulationGoals toggles={<CessationActivitéToggles />}>
			<Condition expression="entreprise . imposition = 'IR'">
				<Condition expression="entreprise . imposition . IR . régime micro-fiscal = non">
					<SimulationGoal
						appear={false}
						dottedName="entreprise . chiffre d'affaires"
						label={t(
							'pages.simulateurs.cessation-activité.label.chiffre-affaires',
							"Chiffre d'affaires pour l'année de cessation"
						)}
					/>
					<SimulationGoal appear={false} dottedName="entreprise . charges" />
				</Condition>

				<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
					<ChiffreAffairesActivitéMixte
						dottedName="entreprise . chiffre d'affaires"
						label={t(
							'pages.simulateurs.cessation-activité.label.chiffre-affaires',
							"Chiffre d'affaires pour l'année de cessation"
						)}
					/>
				</Condition>

				<SimulationGoal
					small
					editable={false}
					dottedName="indépendant . cotisations et contributions"
					label={t(
						'pages.simulateurs.cessation-activité.label.cotisations',
						"Total des cotisations à devoir pour l'année de cessation d'activité"
					)}
				/>
			</Condition>

			<Condition expression="entreprise . imposition = 'IS'">
				<SimulationGoal
					appear={false}
					dottedName="indépendant . rémunération . totale"
					label={t(
						'pages.simulateurs.cessation-activité.label.rémunération',
						"Rémunération totale pour l'année de cessation"
					)}
				/>

				<SimulationGoal appear={false} dottedName="indépendant . dividendes" />

				<SimulationGoal
					small={!dividendesVersés}
					editable={false}
					dottedName="indépendant . cotisations et contributions . avec dividendes"
					label={t(
						'pages.simulateurs.cessation-activité.label.cotisations',
						"Total des cotisations à devoir pour l'année de cessation d'activité"
					)}
				/>
			</Condition>
		</SimulationGoals>
	)
}
