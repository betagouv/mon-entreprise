import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Body, Emoji, Link, Message } from '@/design-system/index'
import { useFetchData } from '@/hooks/useFetchData'
import { useSitePaths } from '@/sitePaths'

import { getItem, setItem } from '../../storage/safeLocalStorage'

const localStorageKey = 'last-viewed-release'

type LastRelease = typeof import('@/public/data/last-release')

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
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Message
				className="print-hidden"
				type="secondary"
				icon={<Emoji emoji="✨" />}
				mini
				border={false}
				dismissible
				onDismiss={() => {
					setShowBanner(false)
					setItem(localStorageKey, lastRelease.name)
				}}
			>
				<Body>
					Découvrez les nouveautes {determinant(lastRelease.name)}
					<Link
						to={absoluteSitePaths.nouveautes.index}
						aria-label={t(
							'Voir les nouveautes apportées par la version {{release}}',
							{ release: lastRelease.name.toLowerCase() }
						)}
					>
						{lastRelease.name.toLowerCase()}
					</Link>
				</Body>
			</Message>
		</div>
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
