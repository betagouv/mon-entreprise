import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Header = ({ noSubtitle = false, sectionName = '' }) => (
	<header css="text-align: center; a {text-decoration: none}">
		<Link to="/">
			<h1>
				<Logo />
			</h1>
		</Link>

		<Navigation items={items} />
	</header>
)
const activeStyle = {
	fontWeight: 'bold',
	textDecoration: 'underline',
} as React.CSSProperties

const items = [
	['langage', 'Le langage'],
	['communauté', 'Communauté'],
	['studio', 'Bac à sable'],
]
export const Navigation = ({ items }) => {
	return (
		<nav
			css={`
				text-align: center;
				a {
					text-decoration: none;
				}
			`}
		>
			{items.map(([to, label], index) => (
				<>
					{index > 0 && ' • '}
					<NavLink activeStyle={activeStyle} to={'/' + to}>
						{label}
					</NavLink>
				</>
			))}
		</nav>
	)
}

const Logo = () => (
	<>
		<span css="border: 3px solid var(--color); color: var(--color); padding: 0.1rem 0.4rem 0.1rem 0.6rem ; width: 5rem">
			publi
		</span>
		<span css="background: var(--color); color: white; padding: 0.1rem 0.6rem 0.1rem 0.3rem; width: 5rem; border: 3px solid var(--color)">
			codes
		</span>
	</>
)
