import { SitePathsContext } from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import HumanWeight from './HumanWeight'

export default ({ nodeValue, formule, dottedName }) => {
	const sitePaths = useContext(SitePathsContext)
	let interestingFormula = formule && formule.explanation.text !== '0'
	return (
		<div
			css={`
				font-size: 85%;
				a {
					color: inherit;
				}
				text-align: center;
			`}
		>
			<div>
				<HumanWeight nodeValue={nodeValue} />
				{interestingFormula && (
					<div>
						<span css="font-size: 120%">{emoji('🔬 ')}</span>
						<Link
							to={
								sitePaths.documentation.index + '/' + encodeRuleName(dottedName)
							}
						>
							comprendre le calcul
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
