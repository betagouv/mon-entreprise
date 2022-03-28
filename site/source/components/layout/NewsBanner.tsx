import { Appear } from '@/components/ui/animate'
import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import lastRelease from '@/data/last-release.json'
import { Banner, HideButton, InnerBanner } from '@/design-system/banner'
import { Link } from '@/design-system/typography/link'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getItem, setItem } from '../../storage/safeLocalStorage'

const localStorageKey = 'last-viewed-release'

export const hideNewsBanner = () => {
	setItem(localStorageKey, lastRelease.name)
}

export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

export default function NewsBanner() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	const lastViewedRelease = getItem(localStorageKey)
	const [showBanner, setShowBanner] = useState(
		lastViewedRelease && lastViewedRelease !== lastRelease.name
	)

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	useEffect(() => {
		setItem(
			localStorageKey,
			lastViewedRelease == undefined ? lastRelease.name : lastViewedRelease
		)
	}, [])

	if (!showBanner) {
		return null
	}

	return (
		<Banner className="print-hidden" onClick={() => setShowBanner(false)}>
			<InnerBanner>
				<span>
					<Emoji emoji="✨" /> Découvrez les nouveautés{' '}
					{determinant(lastRelease.name)}
					<Link to={sitePaths.nouveautés}>
						{lastRelease.name.toLowerCase()}
					</Link>
				</span>
				<HideButton
					onPress={() => setShowBanner(false)}
					aria-label={t('Fermer')}
				>
					&times;
				</HideButton>
			</InnerBanner>
		</Banner>
	)
}
