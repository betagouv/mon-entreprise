import references from 'Images/références/références.yaml'
import { toPairs } from 'ramda'
import React from 'react'
import { capitalise0 } from '../../utils'
import './References.css'

const findRefKey = (link: string) =>
	Object.keys(references).find(r => link.indexOf(r) > -1)

const cleanDomain = (link: string) =>
	(link.indexOf('://') > -1 ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)

type RefProps = {
	name: string
	link: string
}

function Ref({ name, link }: RefProps) {
	let refKey = findRefKey(link),
		refData = (refKey && references[refKey]) || {},
		domain = cleanDomain(link)
	return (
		<li
			css={`
				display: flex;
				align-items: baseline;
			`}
			key={name}
		>
			<span className="imageWrapper">
				{refData.image && (
					<img src={require('Images/références/' + refData.image)} />
				)}
			</span>
			<a
				href={link}
				target="_blank"
				css={`
					margin-right: 1rem;
				`}
			>
				{capitalise0(name)}
			</a>
			<span className="ui__ label">{domain}</span>
		</li>
	)
}

type ReferencesProps = {
	refs: { [name: string]: string }
}

export default function References({ refs }: ReferencesProps) {
	let references = toPairs(refs)
	return (
		<ul className="references">
			{references.map(([name, link]) => (
				<Ref key={link} name={name} link={link} />
			))}
		</ul>
	)
}
