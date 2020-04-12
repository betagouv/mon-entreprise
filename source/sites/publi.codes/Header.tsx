import React from 'react'
import { Link } from 'react-router-dom'

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
	</header>
)
