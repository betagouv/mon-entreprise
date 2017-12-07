import React, { Component } from 'react'
import ResultsGrid from 'Components/ResultsGrid'
import { salaries } from 'Components/TargetSelection'
import { isEmpty, intersection, head } from 'ramda'
import Rule from 'Components/rule/Rule'

export default class Explanation extends Component {
	render() {
		let { targetRules } = this.props

		if (!targetRules) return null

		if (!isEmpty(intersection(targetRules, salaries))) return <ResultsGrid /> // Problem if targetRules is [salaire net, aides] the Explanation will not explain 'aides'. The user will have to click on Aides to understand it. Should we display a list of <Rule /> sections ?

		if (targetRules.length > 1)
			return <p>L'explication de ces objectifs n'est pas encore disponible</p>

		return <Rule rule={head(targetRules)} />
	}
}
