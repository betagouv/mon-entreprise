import RuleLink from 'Components/RuleLink'
import { makeJsx } from 'Engine/evaluation'
import React from 'react'
import { Trans } from 'react-i18next'
import { DottedName } from 'Types/rule'
import { Node } from './common'

export default function Recalcul(nodeValue, explanation) {
	return (
		<Node
			classes="mecanism recalcul"
			name="recalcul"
			value={nodeValue}
			unit={explanation.unit}
			child={
				<>
					{explanation.règle && (
						<Trans i18nKey="calcul-avec">
							Calcul de <RuleLink dottedName={explanation.règle} /> avec :
						</Trans>
					)}
					<ul>
						{Object.keys(explanation.amendedSituation).map(dottedName => (
							<li
								key={dottedName}
								css={`
									.node.inlineExpression {
										display: inline !important;
									}
								`}
							>
								<RuleLink dottedName={dottedName as DottedName} /> ={' '}
								{makeJsx(explanation.amendedSituation[dottedName])}
							</li>
						))}
					</ul>
				</>
			}
		/>
	)
}
