import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'

import { usePersistingState } from '../utils/persistState'

export default function BetaBanner() {
	const isEmbedded = useIsEmbedded()
	const [showBetaBanner, toggleBetaBanner] = usePersistingState(
		'betawarning',
		true as boolean
	)
	const { t } = useTranslation()
	if (!showBetaBanner) {
		return null
	}

	return (
		<StyledBetaContainer $isEmbedded={isEmbedded}>
			<Message type="info" icon={<Emoji emoji="🚧" />} border={false}>
				<Trans i18nKey="betawarning">
					<Body>
						<StyledStrong>Cet outil est en version bêta</StyledStrong> : nous
						travaillons à{' '}
						<Strong>valider les informations et les calculs</Strong>, mais des{' '}
						<Strong>erreurs peuvent être présentes.</Strong>
					</Body>
				</Trans>
				<AbsoluteHideButton
					color="tertiary"
					onPress={() => toggleBetaBanner(false)}
					aria-label={t('Fermer')}
				/>
			</Message>
		</StyledBetaContainer>
	)
}

const StyledStrong = styled(Strong)`
	color: ${({ theme }) => theme.colors.extended.info[600]};
`

const AbsoluteHideButton = styled(CloseButton)`
	position: absolute;
	top: ${({ theme }) => theme.spacings.sm};
	right: ${({ theme }) => theme.spacings.sm};
`

const StyledBetaContainer = styled.div<{ $isEmbedded: boolean }>`
	padding-top: ${({ theme }) => theme.spacings.xl};
	${({ $isEmbedded, theme }) =>
		$isEmbedded
			? css`
					margin-bottom: ${theme.spacings.md};
			  `
			: css`
					position: sticky;
					margin-bottom: -${theme.spacings.xl};
			  `}
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-top: ${({ theme }) => theme.spacings.md};
	}
	top: 0;
	z-index: 3;
	background-color: ${({ theme }) =>
		!theme.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'};
`
