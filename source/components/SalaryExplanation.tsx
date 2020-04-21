import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { getRuleFromAnalysis } from 'Engine/ruleUtils'
import React, { useContext, useRef } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	defaultUnitSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'

export default function SalaryExplanation() {
	const showDistributionFirst = useSelector(
		(state: RootState) => !state.simulation?.foldedSteps.length
	)
	const analysis = useSelector(analysisWithDefaultsSelector)
	const inversionFail = analysis?.cache._meta.inversionFail
	const distributionRef = useRef<HTMLDivElement>(null)

	// We can't provide an explanation if the engine has failed to run the
	// simulation.
	if (inversionFail) {
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
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<section>
			<h2>
				<Trans i18nKey="payslip.repartition">Répartition du total chargé</Trans>
			</h2>
			<StackedBarChart
				data={[
					{
						...getRule('contrat salarié . rémunération . net après impôt'),
						title: t('Revenu disponible'),
						color: palettes[0][0]
					},
					{
						...getRule('impôt'),
						title: t('impôt'),
						color: palettes[1][0]
					},
					{
						...getRule('contrat salarié . cotisations'),

						color: palettes[1][1]
					}
				]}
			/>
		</section>
	)
}

function PaySlipSection() {
	const unit = useSelector(defaultUnitSelector)
	return (
		<section>
			<h2>
				{unit?.endsWith('mois') ? (
					<Trans>Fiche de paie</Trans>
				) : (
					<Trans>Détail annuel des cotisations</Trans>
				)}
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
