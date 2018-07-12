import { createMarkdownDiv } from 'Engine/marked'
import { path } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { capitalise0 } from '../../utils'
import Destinataire from './Destinataire'
import './Header.css'
import Namespace from './Namespace'

let RuleHeader = ({
	ns,
	type,
	description,
	question,
	flatRule,
	flatRules,
	name,
	title
}) => (
	<section id="rule-meta">
		{ns && <Namespace {...{ ns, flatRules }} />}
		<header id="meta-header">
			<h1>{title || capitalise0(name)}</h1>
			{type && (
				<span className="rule-type aa">
					<Trans>{type}</Trans>
				</span>
			)}
		</header>
		<Destinataire destinataire={path([type, 'destinataire'])(flatRule)} />
		<div id="meta-content">{createMarkdownDiv(description || question)}</div>
	</section>
)
export default RuleHeader
