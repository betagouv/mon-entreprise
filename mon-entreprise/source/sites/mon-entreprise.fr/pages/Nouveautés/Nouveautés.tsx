import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import { MarkdownWithAnchorLinks } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import useSWR from 'swr'
import { determinant, hideNewsBanner } from '../../layout/NewsBanner'

const fetcher = (url: RequestInfo) => fetch(url).then(r => r.json())
const slugify = (name: string) => name.toLowerCase().replace(' ', '-')

type ReleasesData = Array<{
	name: string
	description: string
}>

export default function Nouveautés() {
	// The release.json file may be big, we don't want to include it in the main
	// bundle, that's why we only fetch it on this page. Alternatively we could
	// use import("data/release.json") and configure code splitting with Webpack.
	const { data } = useSWR<ReleasesData>('/data/releases.json', fetcher)
	const history = useHistory()
	const sitePaths = useContext(SitePathsContext)
	const slug = useRouteMatch<{ slug: string }>(`${sitePaths.nouveautés}/:slug`)
		?.params?.slug
	useEffect(hideNewsBanner, [])

	if (!data) {
		return null
	}

	const selectedRelease = data.findIndex(({ name }) => slugify(name) === slug)

	const getPath = (index: number) =>
		`${sitePaths.nouveautés}/${slugify(data[index].name)}`

	if (!slug || selectedRelease === -1) {
		return <Redirect to={getPath(0)} />
	}

	const releaseName = data[selectedRelease].name.toLowerCase()

	return (
		<>
			<ScrollToTop key={selectedRelease} />
			<h1>Les nouveautés {emoji('✨')}</h1>
			<p>
				Nous améliorons le site en continu à partir de vos retours. Découvrez
				les{' '}
				{selectedRelease === 0
					? 'dernières nouveautés'
					: `nouveautés ${determinant(releaseName)}${releaseName}`}
				&nbsp;:
			</p>
			<SmallScreenSelect
				value={selectedRelease}
				onChange={evt => {
					history.push(getPath(Number(evt.target.value)))
				}}
			>
				{data.map(({ name }, index) => (
					<option key={index} value={index}>
						{name}
					</option>
				))}
			</SmallScreenSelect>
			<NewsSection>
				<Sidebar>
					{data.map(({ name }, index) => (
						<li key={name}>
							<NavLink activeClassName="active" to={getPath(index)}>
								{name}
							</NavLink>
						</li>
					))}
				</Sidebar>
				<MainBlock>
					<MarkdownWithAnchorLinks
						source={data[selectedRelease].description}
						escapeHtml={false}
						renderers={{ text: TextRenderer }}
					/>
					<NavigationButtons>
						{selectedRelease + 1 < data.length ? (
							<Link to={getPath(selectedRelease + 1)}>
								← {data[selectedRelease + 1].name}
							</Link>
						) : (
							<span /> // For spacing
						)}
						{selectedRelease > 0 && (
							<Link to={getPath(selectedRelease - 1)}>
								{data[selectedRelease - 1].name} →
							</Link>
						)}
					</NavigationButtons>
				</MainBlock>
			</NewsSection>
			<MoreInfosOnUs />
		</>
	)
}

const removeGithubIssuesReferences = (text: string) =>
	text.replace(/#[0-9]{1,5}/g, '')

const TextRenderer = ({ children }: { children: string }) => (
	<>{emoji(removeGithubIssuesReferences(children))}</>
)

const NewsSection = styled.section`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	@media (min-width: 1250px) {
		margin-left: -175px;
	}
`

const Sidebar = styled.ul`
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 20px;
	margin-right: 25px;
	padding-left: 0;
	font-size: 0.9em;
	border-right: 1px solid var(--lighterColor);

	@media (max-width: 700px) {
		display: none;
	}

	li {
		list-style-type: none;
		list-style-position: inside;
		width: 150px;
		padding: 0;
		margin: 0;

		a {
			display: block;
			color: inherit;
			text-decoration: none;
			padding: 4px 10px;
			margin: 0;

			&:hover,
			&.active {
				background: var(--lightestColor);
			}

			&.active {
				font-weight: bold;
			}
		}
	}
`

const SmallScreenSelect = styled.select`
	display: none;

	@media (max-width: 700px) {
		display: initial;
	}
`

const MainBlock = styled.div`
	flex: 1;

	> h1:first-child,
	h2:first-child,
	h3:first-child {
		margin-top: 0px;
	}
`

const NavigationButtons = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 40px;

	a {
		cursor: pointer;
		background: var(--lightestColor);
		padding: 20px 30px;
	}
`
