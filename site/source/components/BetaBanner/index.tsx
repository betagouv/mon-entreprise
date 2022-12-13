import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { Message } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'

export default function BetaBanner() {
	return (
		<Message type="info" icon="🚧" border={false} mini>
			<Trans i18nKey="betawarning">
				<Body>
					<StyledStrong>Cet outil est en version bêta</StyledStrong> : nous
					travaillons à <Strong>valider les informations et les calculs</Strong>
					, mais des <Strong>erreurs peuvent être présentes.</Strong>
				</Body>
			</Trans>
			{/* <Body>
								Bien qu'il ne soit pas terminé, nous avons choisi de le publier
								pour prendre en compte vos retours le plus tôt possible. Si vous
								pensez avoir trouvé un problème ou si vous voulez nous partager
								une remarque, vous pouvez nous contacter via le bouton « Faire
								une suggestion » en bas de page.
							</Body> */}
		</Message>
	)
}

const StyledStrong = styled(Strong)`
	color: ${({ theme }) => theme.colors.extended.info[600]};
`
