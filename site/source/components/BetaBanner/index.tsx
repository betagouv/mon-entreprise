import { Trans } from 'react-i18next'
import { css, styled } from 'styled-components'

import { Body, Emoji, Message, Strong } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'

import { usePersistingState } from '../utils/persistState'

export default function BetaBanner() {
	const isEmbedded = useIsEmbedded()
	const [showBetaBanner, toggleBetaBanner] = usePersistingState(
		'betawarning',
		true as boolean
	)

	if (!showBetaBanner) {
		return null
	}

	return (
		<StyledBetaContainer $isEmbedded={isEmbedded}>
			<Message
				type="info"
				icon={<Emoji emoji="🚧" />}
				border={false}
				dismissible
				onDismiss={() => toggleBetaBanner(false)}
			>
				<Body>
					<Trans i18nKey="pages.simulateurs.commun.betawarning">
						<StyledStrong>Cet outil est en version bêta</StyledStrong>&nbsp;:
						nous travaillons à{' '}
						<Strong>valider les informations et les calculs</Strong>, mais des{' '}
						<Strong>erreurs peuvent être présentes.</Strong>
					</Trans>
				</Body>
			</Message>
		</StyledBetaContainer>
	)
}

const StyledStrong = styled(Strong)`
	color: ${({ theme }) => theme.colors.extended.info[600]};
`

const StyledBetaContainer = styled.div<{ $isEmbedded: boolean }>`
	padding-top: ${({ theme }) => theme.spacings.md};
	margin-bottom: ${({ theme }) => theme.spacings.md};
	${({ $isEmbedded }) =>
		!$isEmbedded &&
		css`
			position: sticky;
		`}
	top: 0;
	z-index: 3;
	background-color: ${({ theme }) =>
		theme.darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`
