import { Button } from 'DesignSystem/buttons'
import { SROnly } from 'DesignSystem/global-style'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

export default function SearchButton() {
	const { t } = useTranslation()

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
					<StyledLabel>
						<Trans>Rechercher</Trans>
					</StyledLabel>
				</StyledButton>
			)}
		>
			<SearchRulesAndSimulators />
		</PopoverWithTrigger>
	)
}
const StyledButton = styled(Button)`
	display: flex;
	flex: 0;
	align-items: center;
	margin-right: ${({ theme }) => theme.spacings.md};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		order: 3;
		margin-right: 0;
	}
`

const StyledIcon = styled.svg`
	height: ${({ theme }) => theme.spacings.md};
	margin-right: ${({ theme }) => theme.spacings.xs};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		margin-right: 0;
	}
`

const StyledLabel = styled.span`
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		${SROnly}
	}
`
