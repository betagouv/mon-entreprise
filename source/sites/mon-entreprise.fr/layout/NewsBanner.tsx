import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { lastRelease } from '../../../data/last-release.json'
import { inIframe } from '../../../utils'

const localStorageKey = 'last-viewed-release'

export const hideNewsBanner = () => writeStorage(localStorageKey, lastRelease)

export default function NewsBanner() {
	const [lastViewedRelease] = useLocalStorage(localStorageKey)
	const sitePaths = useContext(SitePathsContext)
	const { i18n } = useTranslation()

	const showBanner =
		lastViewedRelease !== lastRelease && i18n.language === 'fr' && !inIframe()

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	if (showBanner && lastViewedRelease === undefined) {
		hideNewsBanner()
	}

	return showBanner ? (
		<div className="ui__ banner news">
			<span>
				{emoji('✨')} Découvrez les nouveautés de{' '}
				<Link to={sitePaths.nouveautés}>{lastRelease}</Link>
			</span>
			<span onClick={hideNewsBanner} className="ui__ close-button">
				&times;
			</span>
		</div>
	) : null
}
