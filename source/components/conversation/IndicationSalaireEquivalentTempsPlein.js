import { React } from 'Components'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'

export default connect(state => ({
	analysis: analysisWithDefaultsSelector(state)
}))(({ analysis }) => {
	let cache = analysis.cache
	let salaire = cache['contrat salarié . salaire . brut de base'],
		quotité = cache['contrat salarié . quotité de travail'],
		équivalentTempsPlein = Math.round(salaire.nodeValue / quotité.nodeValue)
	if (quotité.nodeValue === 1) return null
	return (
		<div
			id="indication"
			style={{ fontStyle: 'italic', textAlign: 'right', margin: '0.6em 0 0' }}>
			Soit {équivalentTempsPlein} € bruts par mois en équivalent temps plein
		</div>
	)
})
