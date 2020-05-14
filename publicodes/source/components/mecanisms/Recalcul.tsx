import { RuleLinkWithContext } from '../RuleLink'
import { makeJsx } from '../../evaluation'
import React from 'react'
import { Trans } from 'react-i18next'
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
						<RuleLinkWithContext dottedName={explanation.recalcul.dottedName} />{' '}
						avec les valeurs suivantes :
					</Trans>
				)}
				<ul>
					{Object.keys(explanation.amendedSituation).map(dottedName => (
						<li key={dottedName}>
							<RuleLinkWithContext dottedName={dottedName} /> ={' '}
							{makeJsx(explanation.amendedSituation[dottedName])}
						</li>
					))}
				</ul>
			</>
		</Node>
	)
}
