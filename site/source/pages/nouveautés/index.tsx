import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useMatch, useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { determinant, useHideNewsBanner } from '@/components/layout/NewsBanner'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import {
	Container,
	Emoji,
	GenericButtonOrNavLinkProps,
	Grid,
	Item,
	MarkdownWithAnchorLinks,
	Select,
	typography,
} from '@/design-system'
import { useFetchData } from '@/hooks/useFetchData'
import { useSitePaths } from '@/sitePaths'

const { Body, H1, Link } = typography

const slugify = (name: string) => name.toLowerCase().replace(' ', '-')

type Releases = typeof import('@/public/data/releases.json')

export default function Nouveautés() {
	const { data } = useFetchData<Releases>('/data/releases.json')
	const navigate = useNavigate()
	const { absoluteSitePaths } = useSitePaths()
	const slug = useMatch(encodeURI(absoluteSitePaths.nouveautés.date))?.params
		?.date
	useHideNewsBanner()

	const { t } = useTranslation()

	const releasesWithId = useMemo(
		() => (data && data.map((v, id) => ({ ...v, id }))) ?? [],
		[data]
	)

	if (!data?.length) {
		return null
	}

	const selectedRelease = data.findIndex(({ name }) => slugify(name) === slug)

	const getPath = (index: number) =>
		`${absoluteSitePaths.nouveautés.index}/${slugify(data[index].name)}`

	if (!slug || selectedRelease === -1) {
		return <Navigate to={getPath(0)} replace />
	}

	const releaseName = data[selectedRelease].name.toLowerCase()

	return (
		<>
			<TrackPage chapter1="informations" name="nouveautes" />
			<Meta
				title={t('news.title', 'Nouveautés')}
				description={t(
					'news.description',
					'Nous améliorons le site en continu à partir de vos retours. Découvrez les dernières nouveautés'
				)}
			/>
			<ScrollToTop key={selectedRelease} />

			<Container>
				<H1>
					Les nouveautés <Emoji emoji="✨" />
				</H1>
				<Body>
					Nous améliorons le site en continu à partir de{' '}
					<Link
						aria-label={t(
							"vos retours, accéder aux statistiques d'utilisation"
						)}
						to={absoluteSitePaths.stats + '#demandes-utilisateurs'}
					>
						vos retours
					</Link>
					. Découvrez les{' '}
					{selectedRelease === 0
						? 'dernières nouveautés'
						: `nouveautés ${determinant(releaseName)}${releaseName}`}
					&nbsp;:
				</Body>

				<Grid container spacing={2}>
					<MobileGridItem item xs={12}>
						<Select
							label="Date de la newsletter"
							value={selectedRelease}
							items={releasesWithId}
							onSelectionChange={(id) => {
								if (id !== selectedRelease) {
									navigate(getPath(Number(id)))
								}
							}}
						>
							{(release) => (
								<Item textValue={release.name}>{release.name}</Item>
							)}
						</Select>
					</MobileGridItem>
					<DesktopGridItem item lg={3}>
						<Sidebar aria-label="Navigation lettres d'actualités" role="navigation">
							<StyledUl>
								{data.map(({ name }, index) => (
									<li key={name}>
										<SidebarLink to={getPath(index)}>{name}</SidebarLink>
									</li>
								))}
							</StyledUl>
						</Sidebar>
					</DesktopGridItem>
					<Grid item xs={12} lg={9}>
						<MainBlock>
							<MarkdownWithAnchorLinks>
								{data[selectedRelease].description}
							</MarkdownWithAnchorLinks>

							<NavigationButtons>
								{selectedRelease + 1 < data.length ? (
									<Link to={getPath(selectedRelease + 1)}>
										<span aria-hidden>←</span> {data[selectedRelease + 1].name}
									</Link>
								) : (
									<span /> // For spacing
								)}
								{selectedRelease > 0 && (
									<Link to={getPath(selectedRelease - 1)}>
										{data[selectedRelease - 1].name} <span aria-hidden>→</span>
									</Link>
								)}
							</NavigationButtons>
						</MainBlock>
					</Grid>
				</Grid>
				<MoreInfosOnUs />
			</Container>
		</>
	)
}

const MobileGridItem = styled(Grid)`
	display: block;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		display: none;
	}
`

const DesktopGridItem = styled(Grid)`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		display: block;
	}
`

const SidebarLink = styled(Link)<GenericButtonOrNavLinkProps>`
	display: block;
	border-radius: 0;
	padding: 0.5rem 1rem;
	border-bottom: 1px solid #e6e9ec;
	&:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[700]
				: theme.colors.bases.primary[100]};
	}
`

const Sidebar = styled.nav`
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 20px;
	margin-right: 25px;
	padding-left: 0;
	font-size: 0.9em;
	border-right: 1px solid var(--lighterColor);

	li {
		list-style-type: none;
		list-style-position: inside;
		padding: 0;
		margin: 0;
	}
`

const StyledUl = styled.ul`
	padding-left: 0;
`

const MainBlock = styled.div`
	flex: 1;

	> h1:first-child,
	h2:first-child,
	h3:first-child {
		margin-top: 0px;
	}

	img {
		max-width: 100%;
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
