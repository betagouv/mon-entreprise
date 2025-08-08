import { useTranslation } from 'react-i18next'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { CessationActivitéToggles } from '@/pages/simulateurs/cessation-activité/Toggles'

export const CessationActivitéGoals = () => {
	const { t } = useTranslation()

	return (
		<SimulationGoals toggles={<CessationActivitéToggles />}>
			<Condition expression="entreprise . imposition = 'IR'">
				<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
					<SimulationGoal
						appear={false}
						dottedName="entreprise . chiffre d'affaires"
						label={t("Chiffre d'affaires pour l'année de cessation")}
					/>
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise">
					<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise != oui">
					<SimulationGoal appear={false} dottedName="entreprise . charges" />
				</Condition>
			</Condition>
			<Condition expression="entreprise . imposition = 'IS'">
				<SimulationGoal
					appear={false}
					dottedName="dirigeant . rémunération . totale"
					label={t("Rémunération totale pour l'année de cessation")}
				/>
			</Condition>

			<SimulationGoal
				small
				editable={false}
				dottedName="dirigeant . indépendant . cotisations et contributions"
				label={t(
					"Total des cotisations à devoir pour l'année de cessation d'activité"
				)}
			/>
			<Condition expression="entreprise . imposition . régime . micro-entreprise">
				<SimulationGoal appear={false} dottedName="entreprise . charges" />
			</Condition>
		</SimulationGoals>
	)
}
