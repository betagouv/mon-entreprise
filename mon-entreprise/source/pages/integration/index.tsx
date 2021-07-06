import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TrackChapter } from '../../ATInternetTracking'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	return (
		<>
			<TrackChapter chapter1="integration" />
			<ScrollToTop />

			{pathname !== sitePaths.integration.index && (
				<BackNavigationForDevs className="ui__ dark-bg">
					<Link
						className="ui__ simple small push-left button"
						to={sitePaths.integration.index}
					>
						← <Trans>Outils pour les développeurs</Trans> {emoji('👨‍💻')}
					</Link>
				</BackNavigationForDevs>
			)}
			{/* TODO: Nous pourrions automatiser la publication de cette bannière
			de recrutement lorsqu'une annonce est postée sur beta.gouv.fr
			https://github.com/betagouv/beta.gouv.fr/issues/6343 */}
			{/* <div
				className="ui__ card plain"
				css={`
					margin: 1rem 0;
					transform: translateY(1rem);

					text-align: center;
					padding: 0.4rem;
				`}
			>
				📯{' '}
				<strong>
					<a href="https://beta.gouv.fr/recrutement/2021/05/25/mon-entreprise-fr.recrute.js.html">
						Mon-entreprise.fr recrute !
					</a>
				</strong>{' '}
				<small>Freelance Typescript / React pour 6 mois minimum</small>
			</div> */}
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}

const BackNavigationForDevs = styled.div`
	transform: translateY(1rem);
	padding: 0.25rem 1rem;
	width: max-content;
	border-radius: 0.25rem;
`
