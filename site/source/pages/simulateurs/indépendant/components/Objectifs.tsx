import { useTranslation } from 'react-i18next'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const ObjectifsIndépendant = ({
	toggles,
}: {
	toggles?: React.ReactNode
}) => (
	<SimulationGoals toggles={toggles}>
		<PeriodSwitch />

		<Condition expression="entreprise . imposition = 'IR'">
			<ObjectifsIR />
		</Condition>

		<Condition expression="entreprise . imposition = 'IS'">
			<ObjectifsIS />
		</Condition>

		<SimulationGoal dottedName="indépendant . rémunération . nette . après impôt" />
	</SimulationGoals>
)

const ObjectifsIR = () => {
	const { t } = useTranslation()

	return (
		<>
			<Condition expression="entreprise . imposition . IR . régime micro-fiscal = non">
				<SimulationGoal
					appear={false}
					dottedName="entreprise . chiffre d'affaires"
				/>
			</Condition>

			<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
				<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
			</Condition>

			<Condition expression="entreprise . imposition . IR . régime micro-fiscal != oui">
				<SimulationGoal appear={false} dottedName="entreprise . charges" />
			</Condition>

			<SimulationGoal
				small
				editable={false}
				dottedName="indépendant . cotisations et contributions"
			/>

			<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
				<SimulationGoal appear={false} dottedName="entreprise . charges" />
			</Condition>

			<SimulationGoal
				dottedName="indépendant . rémunération . nette"
				label={t(
					'pages.simulateurs.indépendant.label.rémunération-nette',
					'Revenu net'
				)}
			/>

			<SimulationGoal
				small
				editable={false}
				dottedName="indépendant . rémunération . impôt"
			/>
		</>
	)
}

const ObjectifsIS = () => {
	const engine = useEngine()
	const dividendesValue = engine.evaluate('indépendant . dividendes')
		.nodeValue as number
	const dividendesVersés = dividendesValue > 0

	return (
		<>
			<SimulationGoal
				appear={false}
				dottedName="indépendant . rémunération . brute"
			/>

			<SimulationGoal appear={false} dottedName="indépendant . dividendes" />

			<SimulationGoal
				small={!dividendesVersés}
				editable={false}
				dottedName="indépendant . cotisations et contributions . avec dividendes"
			/>

			<SimulationGoal dottedName="indépendant . rémunération . nette . avec dividendes" />

			<Condition expression="indépendant . rémunération . impôt . avec dividendes">
				<SimulationGoal
					small={!dividendesVersés}
					editable={false}
					dottedName="indépendant . rémunération . impôt . avec dividendes"
				/>
			</Condition>
		</>
	)
}
