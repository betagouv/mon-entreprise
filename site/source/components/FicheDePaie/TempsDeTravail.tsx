import Line from "./Line";

export const TempsDeTravail = () => (
	<section className="payslip__salarySection">
		<ul>
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
		</ul>
	</section>
)
