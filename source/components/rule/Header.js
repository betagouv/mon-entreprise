import { ThemeColorsContext } from 'Components/utils/colors'
import { path } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { capitalise0 } from '../../utils'
import { Markdown } from '../utils/markdown'
import Destinataire from './Destinataire'
import './Header.css'
import Namespace from './Namespace'

export default function RuleHeader({
	dottedName,
	type,
	description,
	question,
	flatRule,
	flatRules,
	acronyme,
	name,
	title,
	icon
}) {
	const colors = useContext(ThemeColorsContext)
	let destinataire = path([type, 'destinataire'])(flatRule)
	return (
		<section id="ruleHeader">
			<header className="ui__ plain card">
				<div>
					<Namespace {...{ dottedName, flatRules, color: colors.textColor }} />
					<h1 style={{ color: colors.textColor }}>
						{title || capitalise0(name)}
						{acronyme && <> ({acronyme})</>}
					</h1>
				</div>
				{icon && <span id="ruleHeader__icon"> {emoji(icon)}</span>}
			</header>
			<div id="ruleHeader__content">
				<div id="ruleHeader__description">
					<Markdown source={description || question} />
				</div>
				{destinataire && (
					<div id="ruleHeader__infobox">
						<Destinataire destinataire={destinataire} />
					</div>
				)}
			</div>
		</section>
	)
}
