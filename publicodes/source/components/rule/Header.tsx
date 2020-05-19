import React from 'react'
import { ruleParents } from '../../ruleUtils'
import { RuleLinkWithContext } from '../RuleLink'
import styled from 'styled-components'

export default function RuleHeader({ dottedName }) {
	return (
		<StyledHeader className="ui__ plain card rule-header">
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
		</StyledHeader>
	)
}

const StyledHeader = styled.header`
	padding: 1rem;
	.rule-header__breadcrumb {
		margin: 0;
		padding: 0;
	}

	.rule-header__breadcrumb > li {
		display: inline;
		padding: 0;
	}

	.rule-header__title {
		margin: 0.6rem 0;
	}
`
