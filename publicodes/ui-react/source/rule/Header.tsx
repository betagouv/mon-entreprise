import { utils } from 'publicodes'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { EngineContext } from '../contexts'
import { RuleLinkWithContext } from '../RuleLink'
import Meta from './Meta'

export default function RuleHeader({ dottedName }) {
	const engine = useContext(EngineContext)
	if (!engine) {
		throw new Error('an engine should be provided in context')
	}
	const {
		title,
		rawNode: { description, question, icônes },
	} = engine.getRule(dottedName)
	const displayTitle = icônes ? title + ' ' + icônes : title
	return (
		<StyledHeader className="ui__ plain card rule-header">
			<Meta title={displayTitle} description={description || question} />
			<ul className="rule-header__breadcrumb">
				{utils
					.ruleParents(dottedName)
					.reverse()
					.map((parentDottedName) => (
						<li key={parentDottedName}>
							<RuleLinkWithContext dottedName={parentDottedName} displayIcon />
							{' › '}
						</li>
					))}
			</ul>{' '}
			<h1 className="rule-header__title">
				<RuleLinkWithContext dottedName={dottedName} displayIcon />
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

	.rule-header__title > a {
		text-decoration: none;
	}
`
