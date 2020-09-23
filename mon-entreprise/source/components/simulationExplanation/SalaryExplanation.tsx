import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useEvaluation, useInversionFail } from 'Components/utils/EngineContext'
import React, { useContext, useRef } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import * as Animate from 'Components/ui/animate'
import { answeredQuestionsSelector } from 'Selectors/simulationSelectors'

export default function SalaryExplanation() {
	const showDistributionFirst = !useSelector(answeredQuestionsSelector).length
	const distributionRef = useRef<HTMLDivElement>(null)

	if (useInversionFail()) {
		return null
	}
	return (
		<Animate.fromTop key={showDistributionFirst.toString()}>
			{showDistributionFirst ? (
				<>
					<RevenueRepatitionSection />
					<DistributionSection />
					<PaySlipSection />
				</>
			) : (
				<>
					<RevenueRepatitionSection />
					<div css="text-align: center">
						<button
							className="ui__ small simple button"
							onClick={() =>
								distributionRef.current?.scrollIntoView({
									behavior: 'smooth',
									block: 'start'
								})
							}
						>
							{emoji('📊')} <Trans>Voir la répartition des cotisations</Trans>
						</button>
					</div>
					<div ref={distributionRef}>
						<DistributionSection />
						<PaySlipSection />
					</div>
				</>
			)}
			<br />
			<p className="ui__ notice">
				<Trans i18nKey="payslip.notice">
					Le simulateur vous aide à comprendre votre bulletin de paie, sans lui
					être opposable. Pour plus d&apos;informations, rendez vous sur&nbsp;
					<a href="https://www.service-public.fr/particuliers/vosdroits/F559">
						service-public.fr
					</a>
					.
				</Trans>
			</p>
			<p className="ui__ notice">
				<Trans i18nKey="payslip.disclaimer">
					Il ne prend pour l'instant pas en compte les accords et conventions
					collectives, ni la myriade d'aides aux entreprises. Trouvez votre
					convention collective{' '}
					<a href="https://socialgouv.github.io/conventions-collectives">ici</a>
					, et explorez les aides sur&nbsp;
					<a href="https://www.aides-entreprises.fr">aides-entreprises.fr</a>.
				</Trans>
			</p>
		</Animate.fromTop>
	)
}

function RevenueRepatitionSection() {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)
	const data = useEvaluation(
		[
			'contrat salarié . rémunération . net après impôt',
			'impôt',
			'contrat salarié . cotisations'
		],
		{ unit: '€/mois' }
	)
	return (
		<section>
			<h2>
				<Trans i18nKey="payslip.repartition">Répartition du total chargé</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...data[0],
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{
						...data[1],
						title: t('impôt'),
						color: palettes[1][0]
					},
					{
						...data[2],
						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}

function PaySlipSection() {
	return (
		<section>
			<h2>
				<Trans>Fiche de paie</Trans>
			</h2>
			<PaySlip />
		</section>
	)
}

const DistributionSection = () => (
	<section>
		<h2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</h2>
		<Distribution />
	</section>
)
