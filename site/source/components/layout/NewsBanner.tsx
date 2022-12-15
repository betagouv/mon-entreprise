import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Link } from '@/design-system/typography/link'
import { useFetchData } from '@/hooks/useFetchData'
import { useSitePaths } from '@/sitePaths'

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
	const { absoluteSitePaths } = useSitePaths()
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
		<Message className="print-hidden" icon={<Emoji emoji="✨" />}>
			Découvrez les nouveautés
			{determinant(lastRelease.name)}
			<Link
				to={absoluteSitePaths.nouveautés}
				aria-label={t(
					'Voir les nouveautés apportées par la version {{release}}',
					{ release: lastRelease.name.toLowerCase() }
				)}
			>
				{lastRelease.name.toLowerCase()}
			</Link>
			<CloseButton
				onPress={() => {
					setShowBanner(false)
					setItem(localStorageKey, lastRelease.name)
				}}
				aria-label={t('Fermer')}
			/>
		</Message>
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
