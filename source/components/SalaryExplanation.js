import { T } from 'Components'
import Distribution from 'Components/Distribution'
import PaySlip from 'Components/PaySlip'
import withTracker from 'Components/utils/withTracker'
import { compose } from 'ramda'
import React, { useRef } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import * as Animate from 'Ui/animate'

class ErrorBoundary extends React.Component {
	state = {}
	static getDerivedStateFromError() {
		return {
			error:
				'The SalaryExplanation component triggered an error. This often happens in its subcomponents reducers'
		}
	}
	render() {
		if (this.state.error)
			return <div css="background: red; ">Erreur : {this.state.error}</div>
		return this.props.children
	}
}

export default compose(
	withTracker,
	connect(state => ({
		showDistributionFirst: !state.conversationSteps.foldedSteps.length
	}))
)(function SalaryExplanation({ showDistributionFirst }) {
	const distributionRef = useRef({})
	return (
		<ErrorBoundary>
			<Animate.fromTop key={showDistributionFirst}>
				{showDistributionFirst ? (
					<>
						<DistributionSection />
						<PaySlipSection />
					</>
				) : (
					<>
						<div css="text-align: center">
							<button
								className="ui__ small simple button"
								onClick={() =>
									distributionRef.current.scrollIntoView({
										behavior: 'smooth',
										block: 'start'
									})
								}>
								{emoji('📊')} <T>Voir la répartition des cotisations</T>
							</button>
						</div>
						<PaySlipSection />
						<div ref={distributionRef}>
							<DistributionSection />
						</div>
					</>
				)}
				<br />
				<p className="ui__ notice">
					<Trans i18nKey="payslip.notice">
						Le simulateur vous aide à comprendre votre bulletin de paie, sans
						lui être opposable. Pour plus d&apos;informations, rendez vous
						sur&nbsp;
						<a
							alt="service-public.fr"
							href="https://www.service-public.fr/particuliers/vosdroits/F559">
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
						<a href="https://socialgouv.github.io/conventions-collectives">
							ici
						</a>
						, et explorez les aides sur&nbsp;
						<a href="https://www.aides-entreprises.fr">aides-entreprises.fr</a>.
					</Trans>
				</p>
			</Animate.fromTop>
		</ErrorBoundary>
	)
})

const PaySlipSection = connect(state => ({
	period: formValueSelector('conversation')(state, 'période')
}))(({ period }) => (
	<section>
		<h2>
			<Trans>
				{period === 'mois'
					? 'Fiche de paie mensuelle'
					: 'Détail annuel des cotisations'}
			</Trans>
		</h2>
		<PaySlip />
	</section>
))

const DistributionSection = () => (
	<section>
		<h2>
			<Trans>À quoi servent mes cotisations ?</Trans>
		</h2>
		<Distribution />
	</section>
)
