import { toPairs } from 'ramda'
import { capitalise0 } from 'publicodes'
import styled from 'styled-components'
import { useContext } from 'react'
import { ReferencesImagesContext } from '../contexts'

const cleanDomain = (link: string) =>
	(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)

type RefProps = {
	name: string
	link: string
}

// TODO: currently we only allow customizing the list of "references icons", but
// this migth be limited for more advanced usages. For instance futur.eco uses a
// different renderer for references:
// https://futur.eco/documentation/transport/avion/impact We will probably want
// to allow the user to provide its own components that can be inserted at
// certains positions in the generated documentation ("hooks").
function Ref({ name, link }: RefProps) {
	const references = useContext(ReferencesImagesContext)
	const refKey = Object.keys(references).find((r) => link.includes(r))
	const domain = cleanDomain(link)
	return (
		<li
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
			key={name}
		>
			<span className="imageWrapper">
				{refKey && <img src={references[refKey]} />}
			</span>
			<a
				href={link}
				target="_blank"
				style={{
					marginRight: '1rem',
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
