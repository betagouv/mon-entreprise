import { Line } from '@/components/simulationExplanation/FicheDePaie/Line'
import { Liste } from '@/components/simulationExplanation/FicheDePaie/styledComponents'

export const TempsDeTravail = () => (
	<section>
		<Liste>
			<Line
				rule="salarié . temps de travail"
				displayedUnit="heures/mois"
				precision={1}
			/>
			<Line
				rule="salarié . temps de travail . heures supplémentaires"
				displayedUnit="heures/mois"
				precision={1}
			/>
			<Line
				rule="salarié . temps de travail . heures complémentaires"
				displayedUnit="heures/mois"
				precision={1}
			/>
		</Liste>
	</section>
)
