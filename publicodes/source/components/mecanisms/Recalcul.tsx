import { RuleLinkWithContext } from '../RuleLink'
import { makeJsx } from '../../evaluation'
import React from 'react'
import { Trans } from 'react-i18next'
import { Mecanism } from './common'

export default function Recalcul({ nodeValue, explanation, unit }) {
	console.log(nodeValue, explanation)
	return (
		<Mecanism name="recalcul" value={nodeValue} unit={unit}>
			<>
				{explanation.recalcul && (
					<Trans i18nKey="calcul-avec">
						Recalcul de la règle{' '}
						<RuleLinkWithContext dottedName={explanation.recalcul.dottedName} />{' '}
						avec les valeurs suivantes :
					</Trans>
				)}
				<ul>
					{explanation.amendedSituation.map(([origin, replacement]) => (
						<li key={origin.dottedName}>
							<RuleLinkWithContext dottedName={origin.dottedName} /> ={' '}
							{makeJsx(replacement)}
						</li>
					))}
				</ul>
			</>
		</Mecanism>
	)
}
