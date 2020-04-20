import RuleLink from 'Components/RuleLink'
import { makeJsx } from 'Engine/evaluation'
import React from 'react'
import { Trans } from 'react-i18next'
import { DottedName } from 'Rules'
import { Node } from './common'

export default function Recalcul({ nodeValue, explanation }) {
	return (
		<Node
			classes="mecanism recalcul"
			name="recalcul"
			value={nodeValue}
			unit={explanation.unit}
		>
			<>
				{explanation.recalcul && (
					<Trans i18nKey="calcul-avec">
						Recalcul de la règle{' '}
						<RuleLink dottedName={explanation.recalcul.dottedName} /> avec les
						valeurs suivantes :
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
		</Node>
	)
}
