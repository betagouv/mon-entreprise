import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'

import SearchRulesAndSimulators from './search/SearchRulesAndSimulators'

export default function SearchButton() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			title={t('Recherche sur le site')}
			trigger={(buttonProps) => (
				<StyledButton
					size="XS"
					className="print-hidden"
					light
					{...buttonProps}
					aria-haspopup="dialog"
					aria-label={t(
						'Rechercher, ouvrir la boite de dialogue pour entrer vos termes de recherche.'
					)}
				>
					<StyledIcon
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden
						role="img"
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
			{(closePopover) => (
				<SearchRulesAndSimulators closePopover={closePopover} />
			)}
		</PopoverWithTrigger>
	)
}
const StyledButton = styled(Button)`
	display: flex;
	flex: 0;
	align-items: center;
	margin-right: ${({ theme }) => theme.spacings.md};
`

const StyledIcon = styled.svg`
	height: ${({ theme }) => theme.spacings.md};
	margin-right: ${({ theme }) => theme.spacings.xs};
`
