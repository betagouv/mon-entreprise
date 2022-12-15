import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Message } from '@/design-system'
import { CloseButton } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'

export default function BetaBanner() {
	const [showBetaBanner, toggleBetaBanner] = useState(true)
	const { t } = useTranslation()
	if (!showBetaBanner) {
		return null
	}

	return (
		<StyledBetaContainer>
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
				{/* <Body>
								Bien qu'il ne soit pas terminé, nous avons choisi de le publier
								pour prendre en compte vos retours le plus tôt possible. Si vous
								pensez avoir trouvé un problème ou si vous voulez nous partager
								une remarque, vous pouvez nous contacter via le bouton « Faire
								une suggestion » en bas de page.
							</Body> */}
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

const StyledBetaContainer = styled.div`
	padding-top: ${({ theme }) => theme.spacings.xl};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-top: ${({ theme }) => theme.spacings.md};
	}
	margin-bottom: -${({ theme }) => theme.spacings.xl};
	position: sticky;
	top: 0;
	z-index: 3;
	background-color: ${({ theme }) =>
		!theme.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'inherit'};
`
