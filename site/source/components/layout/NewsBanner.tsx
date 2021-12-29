// import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import { Appear } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import lastRelease from 'Data/last-release.json'
import { Banner, HideButton, InnerBanner } from 'DesignSystem/banner'
import { Link } from 'DesignSystem/typography/link'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const localStorageKey = 'last-viewed-release'

export const hideNewsBanner = () => {
	// writeStorage(localStorageKey, lastRelease.name)
}
export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

export default function NewsBanner() {
	// const [lastViewedRelease] = useLocalStorage(localStorageKey)
	const sitePaths = useContext(SitePathsContext)
	const { i18n, t } = useTranslation()

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	useEffect(() => {
		// writeStorage(
		// 	localStorageKey,
		// 	lastViewedRelease === undefined ? lastRelease.name : lastViewedRelease
		// )
	}, [])

	const showBanner = false

	if (!showBanner) {
		return null
	}
	return (
		<Appear>
			<Banner className="print-hidden">
				<InnerBanner>
					<span>
						<Emoji emoji="✨" /> Découvrez les nouveautés{' '}
						{determinant(lastRelease.name)}
						<Link to={sitePaths.nouveautés}>
							{lastRelease.name.toLowerCase()}
						</Link>
					</span>
					<HideButton onPress={hideNewsBanner} aria-label={t('Fermer')}>
						&times;
					</HideButton>
				</InnerBanner>
			</Banner>
		</Appear>
	)
}
