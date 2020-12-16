import { Link, NavLink } from 'react-router-dom'

const items = [
	['documentation', 'Documentation'] as const,
	['communauté', 'Communauté'] as const,
	['studio', 'Bac à sable'] as const,
]

export const Header = () => (
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
	background: 'var(--color)',
	color: 'var(--textColor)',
	padding: '.1rem .3rem',
} as React.CSSProperties

type NavProps = {
	items: Array<readonly [path: string, title: string]>
	sub?: string
}
export const Navigation = ({ items, sub }: NavProps) => {
	return (
		<nav
			css={`
				text-align: center;
				a {
					text-decoration: none;
				}
				${sub &&
				`


				`}
			`}
		>
			{items.map(([to, label], index) => (
				<>
					{index > 0 && <span css="margin: 0 .5rem">•</span>}
					<NavLink
						activeStyle={activeStyle}
						to={'/' + (sub ? sub + '/' : '') + to}
					>
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
