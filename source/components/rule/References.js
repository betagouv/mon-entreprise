import { toPairs } from 'ramda'
import React from 'react'
import { capitalise0 } from '../../utils'
import references from 'Règles/ressources/références/références.yaml'
import './References.css'

const findRefKey = link =>
	Object.keys(references).find(r => link.indexOf(r) > -1)

const cleanDomain = link =>
	(link.indexOf('://') > -1 ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)

function Ref({ name, link }) {
	let refKey = findRefKey(link),
		refData = (refKey && references[refKey]) || {},
		domain = cleanDomain(link)
	return (
		<li key={name}>
			<span className="imageWrapper">
				{refData.image && (
					<img src={require('Règles/ressources/références/' + refData.image)} />
				)}
			</span>
			<a href={link} target="_blank">
				{capitalise0(name)}
			</a>
			<span className="url">{domain}</span>
		</li>
	)
}

export default function References({ refs }) {
	let references = toPairs(refs)
	return (
		<ul className="references">
			{references.map(([name, link]) => (
				<Ref key={link} name={name} link={link} />
			))}
		</ul>
	)
}
