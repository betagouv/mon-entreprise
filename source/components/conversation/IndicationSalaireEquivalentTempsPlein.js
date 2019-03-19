import { React, T } from 'Components'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'
import withLanguage from 'Components/utils/withLanguage'

export default connect(state => ({
	analysis: analysisWithDefaultsSelector(state)
}))(
	withLanguage(({ language, analysis }) => {
		let cache = analysis.cache
		let salaire = cache['contrat salarié . salaire . brut de base'],
			quotité = cache['contrat salarié . quotité de travail'],
			équivalentTempsPlein = salaire.nodeValue / quotité.nodeValue,
			formattedFigure = Intl.NumberFormat(language, {
				style: 'currency',
				currency: 'EUR',
				maximumFractionDigits: 0,
				minimumFractionDigits: 0
			}).format(équivalentTempsPlein)

		if (quotité.nodeValue === 1) return null
		return (
			<div
				id="indication"
				style={{
					fontStyle: 'italic',
					textAlign: 'right',
					margin: '0.6em 0 0'
				}}>
				{formattedFigure}{' '}
				<T k="indicationTempsPlein">en équivalent temps plein brut</T>
			</div>
		)
	})
)
