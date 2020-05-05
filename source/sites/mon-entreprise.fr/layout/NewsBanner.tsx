import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { lastRelease } from '../../../data/last-release.json'

const localStorageKey = 'last-viewed-release'

export const hideNewsBanner = () => writeStorage(localStorageKey, lastRelease)

export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

export default function NewsBanner() {
	const [lastViewedRelease] = useLocalStorage(localStorageKey)
	const sitePaths = useContext(SitePathsContext)
	const { i18n } = useTranslation()

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	if (lastViewedRelease === undefined) {
		hideNewsBanner()
		return null
	}

	const showBanner = lastViewedRelease !== lastRelease && i18n.language === 'fr'

	return showBanner ? (
		<div className="ui__ banner news">
			<span>
				{emoji('✨')} Découvrez les nouveautés {determinant(lastRelease)}
				<Link to={sitePaths.nouveautés}>{lastRelease.toLowerCase()}</Link>
			</span>
			<span onClick={hideNewsBanner} className="ui__ close-button">
				&times;
			</span>
		</div>
	) : null
}
