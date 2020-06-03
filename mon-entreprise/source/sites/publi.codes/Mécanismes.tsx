import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link'
import mecanisms from '../../../../publicodes/docs/mecanisms.yaml'
import { capitalise0 } from '../../utils'
import { Header } from './Header'

export default function Landing() {
	const { pathname } = useLocation()
	useEffect(() => {
		const css = document.createElement('style')
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
				{Object.keys(mecanisms).map(name => (
					<li key={name}>
						<Link to={pathname + '#' + name}>{name}</Link>
					</li>
				))}
			</ul>
			{Object.entries(mecanisms).map(([name, data]) => (
				<React.Fragment key={name}>
					<Explanation {...(data as any)} name={name} />
					<Link to={pathname + '#top'}>Retour à la liste</Link>
				</React.Fragment>
			))}
		</div>
	)
}

type ExplanationProp = {
	exemples: { base: string }
	description: string
	name: string
}
function Explanation({ name, description, exemples }: ExplanationProp) {
	return (
		<>
			{!!name && (
				<h2 id={name}>
					<pre>{name}</pre>
				</h2>
			)}
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
		</>
	)
}
