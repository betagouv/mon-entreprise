import { Button } from 'DesignSystem/buttons'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

export default function SearchButton() {
	const { pathname } = useLocation()
	const pathnameRef = useRef(pathname)
	const { t } = useTranslation()
	useEffect(() => {
		if (pathname !== pathnameRef.current) {
			pathnameRef.current = pathname
			close()
		}
	}, [pathname])

	return (
		<PopoverWithTrigger
			title={t('Que cherchez-vous ?')}
			trigger={(buttonProps) => (
				<StyledButton light {...buttonProps}>
					<StyledIcon
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="square"
							strokeLinejoin="round"
							strokeWidth={3}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</StyledIcon>
					<Trans>Rechercher</Trans>
				</StyledButton>
			)}
		>
			<SearchRulesAndSimulators />
		</PopoverWithTrigger>
	)
}
const StyledButton = styled(Button)`
	display: flex;
	align-items: center;
	margin-right: ${({ theme }) => theme.spacings.md};
`

const StyledIcon = styled.svg`
	height: ${({ theme }) => theme.spacings.md};
	margin-right: ${({ theme }) => theme.spacings.xs};
`
