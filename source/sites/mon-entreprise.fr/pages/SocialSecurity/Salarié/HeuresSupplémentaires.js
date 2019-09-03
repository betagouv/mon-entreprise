/* @flow */
import { T } from 'Components'
import Conversation from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import PeriodSwitch from 'Components/PeriodSwitch'
import heuresSupConfig from 'Components/simulationConfigs/heures-supplémentaires.yaml'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import withLanguage from 'Components/utils/withLanguage'
import ValueInput from 'Components/ValueInput/ValueInput'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'

export default compose(
	withSimulationConfig(heuresSupConfig),
	reduxForm('conversation'),
	withLanguage,
	withTranslation(),
	connect(state => ({
		analysis: analysisWithDefaultsSelector(state)
	}))
)(function HeuresSupplémentaires({ t, language }) {
	return (
		<>
			<Helmet>
				<title>
					{t(
						'simulateurs.salarié.heuresSupplémentaires.page.titre',
						`Calcul des heures supplémentaires`
					)}
				</title>
				<meta
					name="description"
					content={t(
						'simulateurs.salarié.page.description',
						"Calculez la rémunération exacte de vos heures supplémentaires grâce au simulateur de l'Urssaf"
					)}
				/>
			</Helmet>
			<h1>
				<T k="simulateurs.salarié.heuresSupplémentaires.titre">
					Simulateur de rémunération d'heures supplémentaires
				</T>
			</h1>
			<p>
				<T k="simulateurs.salarié.heuresSupplémentaires.description">
					Ce simulateur permet de calculer la rémunération des heures
					supplémentaires, en brut et en gain net après impôts, en tenant compte
					de la réduction d'impôt et de cotisations.
				</T>
			</p>
			<div style={{ marginTop: '2rem' }}>
				Salaire brut :
				<Field
					name="contrat salarié . rémunération . brut de base"
					component={ValueInput}
					language={language}
					debounce={600}
					unit={'€'}
				/>
				Nombre d'heures supplémentaires :
				<Field
					name="contrat salarié . temps de travail . heures supplémentaires"
					component={ValueInput}
					language={language}
					debounce={600}
					unit={'h'}
				/>
			</div>
			<div className="ui__ card plain">
				<h2 css="margin-top: 0">
					{emoji('💶 ⏰ ')}Rémunération des heures supplémentaires{' '}
				</h2>
				<p></p>

				<h3>Brut :</h3>

				<h3>Net après impôts :</h3>
			</div>
			<PeriodSwitch />
			<SeeAnswersButton />
			<Conversation />
		</>
	)
})
