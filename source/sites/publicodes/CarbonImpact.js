import React from 'react'
import { Link } from 'react-router-dom'
import withSitePaths from 'Components/utils/withSitePaths'
import humanWeight from './humanWeight'
import { encodeRuleName } from 'Engine/rules'

export default withSitePaths(
	({ nodeValue, formule, sitePaths, dottedName }) => {
		let interestingFormula = formule && formule.explanation.text !== '0'
		let [value, unit] = humanWeight(nodeValue)
		return (
			<div
				css={`
					font-size: 85%;
					color: #444;
				`}>
				<div>
					Soit <strong>{value}</strong> {unit}
					{interestingFormula && (
						<div>
							<Link
								to={
									sitePaths.documentation.index +
									'/' +
									encodeRuleName(dottedName)
								}>
								comprendre le calcul
							</Link>
						</div>
					)}
				</div>
			</div>
		)
	}
)
