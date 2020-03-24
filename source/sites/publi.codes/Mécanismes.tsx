import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import mecanisms from 'Engine/mecanisms.yaml'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router'
import { HashLink as Link } from 'react-router-hash-link'
import { capitalise0 } from '../../utils'
import { Header } from './Header'

type MecanismProp = {
	name: string
	exemples: { base: string }
	description: string
	arguments: any
}
const Mecanism = ({ name, description, exemples }: MecanismProp) => (
	<React.Fragment key={name}>
		<h2 id={name}>
			<pre>{name}</pre>
		</h2>
		<Markdown source={description} />
		{exemples && (
			<>
				{Object.entries(exemples).map(([name, exemple]) => (
					<React.Fragment key={name}>
						<h3>{name === 'base' ? 'Exemple' : capitalise0(name)}</h3>
						<Markdown source={`\`\`\`yaml\n${exemple}\n\`\`\``} />
					</React.Fragment>
				))}{' '}
			</>
		)}
		<Link to={useLocation().pathname + '#top'}>Retour à la liste</Link>
	</React.Fragment>
)
export default function Landing() {
	useEffect(() => {
		var css = document.createElement('style')
		css.type = 'text/css'
		css.innerHTML = `
		#js {
			animation: appear 0.5s;
			opacity: 1;
		}
		#loading {
			display: none !important;
		}`
		document.body.appendChild(css)
	})
	return (
		<div className="app-content ui__ container" css="margin: 2rem 0">
			<ScrollToTop />
			<Header />
			<h1 id="top">Mécanismes existants</h1>
			<ul>
				{Object.entries(mecanisms).map(([name, data]) => (
					<li key={name}>
						<Link to={useLocation().pathname + '#' + name}>{name}</Link>
					</li>
				))}
			</ul>
			{Object.entries(mecanisms).map(([name, data]) => (
				<Mecanism {...data} name={name} />
			))}
		</div>
	)
}
