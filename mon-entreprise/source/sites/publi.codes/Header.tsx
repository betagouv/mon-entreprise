import React from 'react'
import { Link, NavLink } from 'react-router-dom'
const activeStyle = {
	fontWeight: 'bold',
	textDecoration: 'underline'
} as React.CSSProperties
export const Header = ({ noSubtitle = false, sectionName = '' }) => (
	<header css="text-align: center; a {text-decoration: none}">
		<Link to="/">
			<h1>
				<span css="border: 3px solid var(--color); color: var(--color); padding: 0.1rem 0.4rem 0.1rem 0.6rem ; width: 5rem">
					publi
				</span>
				<span css="background: var(--color); color: white; padding: 0.1rem 0.6rem 0.1rem 0.3rem; width: 5rem; border: 3px solid var(--color)">
					codes
				</span>
				{sectionName && (
					<span css="margin-left: 20px; font-weight: lighter; color: var(--lighterInverseTextColor);">
						{sectionName}
					</span>
				)}
			</h1>
		</Link>
		{!noSubtitle && (
			<p css="max-width: 28rem; margin: 0 auto; font-size: 120%">
				Le langage pour les algorithmes d'intérêt public.
			</p>
		)}
		<br />
		<nav css="display">
			<NavLink activeStyle={activeStyle} to="/studio">
				Bac à sable
			</NavLink>
			{' • '}
			<NavLink activeStyle={activeStyle} to="/mécanismes">
				Liste des mécanismes
			</NavLink>
			{' • '}
			<NavLink activeStyle={activeStyle} to="/api">
				API
			</NavLink>
		</nav>
	</header>
)
