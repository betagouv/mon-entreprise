import withColours from 'Components/utils/withColours'
import { path } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { capitalise0 } from '../../utils'
import { Markdown } from '../utils/markdown'
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
			<header className="ui__ plain card">
				<div>
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
					<Markdown source={description || question} />
				</div>
				{do {
					let destinataire = path([type, 'destinataire'])(flatRule)
					destinataire && (
						<div id="ruleHeader__infobox">
							<Destinataire destinataire={destinataire} />
						</div>
					)
				}}
			</div>
		</section>
	)
)
export default RuleHeader
