import withColours from 'Components/utils/withColours'
import { createMarkdownDiv } from 'Engine/marked'
import { path } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { capitalise0 } from '../../utils'
import Destinataire from './Destinataire'
import './Header.css'
import Namespace from './Namespace'

let RuleHeader = withColours(
	({
		ns,
		type,
		description,
		question,
		flatRule,
		flatRules,
		name,
		title,
		icon,
		colours
	}) => (
		<section id="ruleHeader">
			<header style={{ background: colours.colour }}>
				<div id="ruleHeader__main">
					{ns && (
						<Namespace {...{ ns, flatRules, colour: colours.textColour }} />
					)}
					<h1 style={{ color: colours.textColour }}>
						{title || capitalise0(name)}
					</h1>
				</div>
				{icon && <span id="ruleHeader__icon"> {emoji(icon)}</span>}
			</header>
			<div id="ruleHeader__content">
				<div id="ruleHeader__description">
					{createMarkdownDiv(description || question)}
				</div>
				{(type || path([type, 'destinataire'])(flatRule)) && (
					<div id="ruleHeader__infobox">
						{type && (
							<div className="infobox__item">
								<h4>Type&nbsp;:</h4>
								<Trans>{capitalise0(type)}</Trans>
							</div>
						)}
						<Destinataire
							destinataire={path([type, 'destinataire'])(flatRule)}
						/>
					</div>
				)}
			</div>
		</section>
	)
)
export default RuleHeader
