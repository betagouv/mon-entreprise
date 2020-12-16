import { HeadingWithAnchorLink, Markdown } from '../components/markdown'
import { ScrollToTop } from '../components/Scroll'
import { Fragment, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link'
import mecanisms from '../../docs/mecanisms.yaml'
import { capitalise0 } from 'publicodes'
import { Header } from '../components/Header'
const sortedMecanisms = Object.entries(mecanisms).sort(([a], [b]) =>
	a.localeCompare(b)
)

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
		<>
			<ScrollToTop />

			<h1 id="top">Mécanismes existants</h1>
			<ul>
				{sortedMecanisms.map(([name]) => (
					<li key={name}>
						<Link to={pathname + '#' + name.replace(/ /g, '-')}>{name}</Link>
					</li>
				))}
			</ul>
			{sortedMecanisms.map(([name, data]) => (
				<Fragment key={name}>
					<Explanation {...(data as any)} name={name} />
					<Link to={pathname + '#top'}>Retour à la liste</Link>
				</Fragment>
			))}
		</>
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
				<HeadingWithAnchorLink level={2}>
					<pre>{name}</pre>
				</HeadingWithAnchorLink>
			)}
			<Markdown source={description} />
			{exemples && (
				<>
					{Object.entries(exemples).map(([name, exemple]) => (
						<Fragment key={name}>
							<h3>{name === 'base' ? 'Exemple' : capitalise0(name)}</h3>
							<Markdown source={`\`\`\`yaml\n${exemple}\n\`\`\``} />
						</Fragment>
					))}{' '}
				</>
			)}
		</>
	)
}
