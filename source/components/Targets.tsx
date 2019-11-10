import { ThemeColoursContext } from 'Components/utils/withColours'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import './Targets.css'

export default function Targets() {
	const colours = useContext(ThemeColoursContext)
	const sitePaths = useContext(SitePathsContext)
	const analysis = useSelector(analysisWithDefaultsSelector)
	let { nodeValue, unité: unit, dottedName } = analysis.targets[0]
	return (
		<div id="targets">
			<span className="icon">→</span>
			<span className="content" style={{ color: colours.textColour }}>
				<span className="figure">
					<span className="value">{nodeValue?.toFixed(1)}</span>{' '}
					<span className="unit">{unit}</span>
				</span>
				<Link
					title="Quel est calcul ?"
					style={{ color: colours.colour }}
					to={sitePaths.documentation.index + '/' + dottedName}
					className="explanation"
				>
					{emoji('📖')}
				</Link>
			</span>
		</div>
	)
}
