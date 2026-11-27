import { styled } from 'styled-components'

import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { Grid } from '@/design-system'

export const Objectifs = () => {
	return (
		<SimulationGoals>
			<PeriodSwitch />

			<GridContainer container>
				<GridItem item xs={12} xl={6}>
					<SimulationGoal dottedName="assimilé salarié . rémunération . totale" />
					<SimulationGoal
						editable={false}
						small
						dottedName="assimilé salarié . cotisations"
					/>
					<SimulationGoal
						dottedName="assimilé salarié . rémunération . nette . à payer avant impôt"
						editable={false}
					/>
				</GridItem>

				<DividendesGridItem item xs={12} xl={6}>
					<SimulationGoal dottedName="assimilé salarié . dividendes" />
					<SimulationGoal
						editable={false}
						small
						dottedName="assimilé salarié . dividendes . prélèvements sociaux"
					/>
					<SimulationGoal
						dottedName="assimilé salarié . dividendes . nets"
						editable={false}
					/>
				</DividendesGridItem>
			</GridContainer>

			<SimulationGoal dottedName="assimilé salarié . rémunération . nette . avec dividendes" />
			<SimulationGoal
				small
				editable={false}
				dottedName="assimilé salarié . rémunération . impôt . avec dividendes"
			/>
			<SimulationGoal dottedName="assimilé salarié . rémunération . nette . après impôt . avec dividendes" />
		</SimulationGoals>
	)
}

const GridContainer = styled(Grid)`
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		max-width: unset !important;
	}
`

const GridItem = styled(Grid)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

const DividendesGridItem = styled(GridItem)`
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		border-top: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
		border-bottom: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
		padding-top: ${({ theme }) => theme.spacings.lg};
	}
`
