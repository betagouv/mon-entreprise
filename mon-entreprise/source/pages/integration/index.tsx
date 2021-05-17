import { Link, Route, Switch, useLocation } from 'Components/router-adapter'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
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
