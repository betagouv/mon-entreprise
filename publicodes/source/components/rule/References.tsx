import references from './références/références.yaml'
import { toPairs } from 'ramda'
import React from 'react'
import { capitalise0 } from '../../utils'
import styled from 'styled-components'

const findRefKey = (link: string) =>
	Object.keys(references).find(r => link.includes(r))

const cleanDomain = (link: string) =>
	(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)

type RefProps = {
	name: string
	link: string
}

function Ref({ name, link }: RefProps) {
	const refKey = findRefKey(link),
		refData = (refKey && references[refKey]) || {},
		domain = cleanDomain(link)
	return (
		<li
			style={{
				display: 'flex',
				alignItems: 'baseline'
			}}
			key={name}
		>
			<span className="imageWrapper">
				{refData.image && (
					<img src={require('./références/' + refData.image)} />
				)}
			</span>
			<a
				href={link}
				target="_blank"
				style={{
					marginRight: '1rem'
				}}
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
	const references = toPairs(refs)
	return (
		<StyledComponent>
			{references.map(([name, link]) => (
				<Ref key={link} name={name} link={link} />
			))}
		</StyledComponent>
	)
}

const StyledComponent = styled.ul`
	list-style: none;
	padding: 0;
	a {
		flex: 1;
		min-width: 45%;
		text-decoration: underline;
	}

	li {
		margin-bottom: 0.6em;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.imageWrapper {
		width: 4.5rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
	img {
		max-height: 3rem;
		vertical-align: sub;
		max-width: 100%;
		border-radius: 0.3em;
	}
`
