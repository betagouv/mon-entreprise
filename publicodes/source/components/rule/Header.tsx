import React from 'react'
import { ruleParents } from '../../ruleUtils'
import './Header.css'
import { RuleLinkWithContext } from '../RuleLink'

export default function RuleHeader({ dottedName }) {
	return (
		<header className="ui__ plain card rule-header">
			<ul className="rule-header__breadcrumb">
				{ruleParents(dottedName)
					.reverse()
					.map(parentDottedName => (
						<li key={parentDottedName}>
							<RuleLinkWithContext dottedName={parentDottedName} displayIcon />
							{' › '}
						</li>
					))}
			</ul>{' '}
			<h1 className="rule-header__title">
				<RuleLinkWithContext
					dottedName={dottedName}
					displayIcon
					style={{ textDecoration: 'none' }}
				/>
			</h1>
		</header>
	)
}
