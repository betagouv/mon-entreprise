import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActiviteMixte'
import { Condition } from '@/components/EngineValue/Condition'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation/index'
import { DateCessationQuestion } from '@/pages/simulateurs/cessation-activite/components/DateCessationQuestion'
import { RégimeImpositionQuestion } from '@/pages/simulateurs/cessation-activite/components/RegimeImpositionQuestion'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { AvertissementAnnéeDeSimulationModifiée } from './components/AvertissementAnneeDeSimulationModifiee'

export const CessationActivitéGoals = () => {
	const engine = useEngine()
	const dividendesValue = engine.evaluate('independant . dividendes')
		.nodeValue as number
	const dividendesVersés = dividendesValue > 0
	const { t } = useTranslation()

	return (
		<SimulationGoals
			toggles={
				<LeftAlignedContainer>
					<DateCessationQuestion />
					<RégimeImpositionQuestion />
					<AvertissementAnnéeDeSimulationModifiée />
				</LeftAlignedContainer>
			}
		>
			<Condition expression="entreprise . imposition = 'IR'">
				<Condition expression="entreprise . imposition . IR . régime micro-fiscal = non">
					<SimulationGoal
						appear={false}
						dottedName="entreprise . chiffre d'affaires"
						label={t(
							'pages.simulateurs.cessation-activite.label.chiffre-affaires',
							"Chiffre d'affaires pour l'année de cessation"
						)}
					/>
					<SimulationGoal appear={false} dottedName="entreprise . charges" />
				</Condition>

				<Condition expression="entreprise . imposition . IR . régime micro-fiscal">
					<ChiffreAffairesActivitéMixte
						dottedName="entreprise . chiffre d'affaires"
						label={t(
							'pages.simulateurs.cessation-activite.label.chiffre-affaires',
							"Chiffre d'affaires pour l'année de cessation"
						)}
					/>
				</Condition>

				<SimulationGoal
					small
					editable={false}
					dottedName="independant . cotisations et contributions"
					label={t(
						'pages.simulateurs.cessation-activite.label.cotisations',
						"Total des cotisations à devoir pour l'année de cessation d'activité"
					)}
				/>
			</Condition>

			<Condition expression="entreprise . imposition = 'IS'">
				<SimulationGoal
					appear={false}
					dottedName="independant . rémunération . brute"
					label={t(
						'pages.simulateurs.cessation-activite.label.rémunération',
						"Rémunération brute pour l'année de cessation"
					)}
				/>

				<SimulationGoal
					appear={false}
					dottedName="independant . dividendes . soumis à prélèvements sociaux"
				/>
				<SimulationGoal
					appear={false}
					dottedName="independant . dividendes . soumis à cotisations sociales"
				/>

				<SimulationGoal
					small={!dividendesVersés}
					editable={false}
					dottedName="independant . cotisations et contributions . avec dividendes"
					label={t(
						'pages.simulateurs.cessation-activite.label.cotisations',
						"Total des cotisations à devoir pour l'année de cessation d'activité"
					)}
				/>
			</Condition>
		</SimulationGoals>
	)
}

const LeftAlignedContainer = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacings.sm};
`
