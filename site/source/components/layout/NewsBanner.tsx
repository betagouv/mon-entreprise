import Emoji from '@/components/utils/Emoji'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Banner, HideButton, InnerBanner } from '@/design-system/banner'
import { Link } from '@/design-system/typography/link'
import { useFetchData } from '@/hooks/useFetchData'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getItem, setItem } from '../../storage/safeLocalStorage'

const localStorageKey = 'last-viewed-release'

type LastRelease = typeof import('@/public/data/last-release.json')

export const useHideNewsBanner = () => {
	const { data: lastReleaseData } = useFetchData<LastRelease>(
		'/data/last-release.json'
	)

	useEffect(() => {
		if (lastReleaseData) {
			setItem(localStorageKey, lastReleaseData.name)
		}
	}, [lastReleaseData])
}

export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

function NewsBanner({ lastRelease }: { lastRelease: LastRelease }) {
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
			lastViewedRelease == null ? lastRelease.name : lastViewedRelease
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

export default function NewsBannerWrapper() {
	const { data: lastReleaseData } = useFetchData<LastRelease>(
		'/data/last-release.json'
	)

	return lastReleaseData === null ? null : (
		<NewsBanner lastRelease={lastReleaseData} />
	)
}
