import { useLocalStorage, writeStorage } from '@rehooks/local-storage'
import { Appear } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import { Link } from 'DesignSystem/typography/link'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import lastRelease from '../../data/last-release.json'

const localStorageKey = 'last-viewed-release'

export const hideNewsBanner = () => {
	writeStorage(localStorageKey, lastRelease.name)
}
export const determinant = (word: string) =>
	/^[aeiouy]/i.exec(word) ? 'd’' : 'de '

const Container = styled.div`
	display: flex;
	width: 100%;
	margin: auto;
	align-items: center;
	justify-content: center;
	font-family: ${({ theme }) => theme.fonts.main};
`

const InnerContainer = styled.div`
	display: flex;
	margin: auto;
	align-items: center;
	justify-content: center;
	padding: 0.5rem 1rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	border: 2px solid;
	border-color: ${({ theme }) => theme.colors.bases.primary[500]};
	border-radius: 0.375rem;
`

const HideButton = styled(Button)<GenericButtonOrLinkProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 1.5rem;
	width: 1.5rem;
	padding: 0;
	background: ${({ theme }) => theme.colors.extended.grey[100]};
	color: ${({ theme }) => theme.colors.bases.primary[600]};
	font-weight: bold;
	margin-left: 1rem;

	&:hover {
		background: ${({ theme }) => theme.colors.bases.primary[300]};
	}
`

export default function NewsBanner() {
	const [lastViewedRelease] = useLocalStorage(localStorageKey)
	const sitePaths = useContext(SitePathsContext)
	const { i18n, t } = useTranslation()

	// We only want to show the banner to returning visitors, so we initiate the
	// local storage value with the last release.
	useEffect(() => {
		writeStorage(
			localStorageKey,
			lastViewedRelease === undefined ? lastRelease.name : lastViewedRelease
		)
	}, [])

	const showBanner =
		lastViewedRelease !== lastRelease.name && i18n.language === 'fr'

	if (!showBanner) {
		return null
	}
	return (
		<Appear>
			<Container className="print-hidden">
				<InnerContainer>
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
				</InnerContainer>
			</Container>
		</Appear>
	)
}
