import { toPairs } from 'ramda'
import { capitalise0 } from '../../utils'
import styled from 'styled-components'

const references = {
	'service-public.fr': require('url-loader!./références/marianne.png').default,
	'urssaf.fr': require('url-loader!./références/URSSAF.png').default,
	'secu-independants.fr': require('url-loader!./références/URSSAF.png').default,
	'gouv.fr': require('url-loader!./références/marianne.png').default,
	'agirc-arrco.fr': require('url-loader!./références/agirc-arrco.png').default,
	'pole-emploi.fr': require('url-loader!./références/pole-emploi.png').default,
	'ladocumentationfrançaise.fr': require('url-loader!./références/ladocumentationfrançaise.png')
		.default,
	'senat.fr': require('url-loader!./références/senat.png').default,
	'ameli.fr': require('url-loader!./références/ameli.png').default,
	'bpifrance-creation': require('url-loader!./références/bpi-création.png')
		.default,
}

const findRefKey = (link: string) =>
	Object.keys(references).find((r) => link.includes(r))

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
	const refKey = findRefKey(link)
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
