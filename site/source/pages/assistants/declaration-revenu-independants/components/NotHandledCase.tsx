import { styled } from 'styled-components'

import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

import notHandled from './undraw_access_denied_re_awnf.svg'

export default function NotHandledCase({
	children,
}: {
	children: React.ReactNode
}) {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<Message type="info">
			<Grid
				container
				css={`
					justify-content: center;
					align-items: center;
				`}
				spacing={3}
			>
				<ReverseOrderOnMobile item xs={6} md={3}>
					<img
						src={notHandled}
						alt=""
						css={`
							width: 100%;
							padding: 1rem;
						`}
					/>
				</ReverseOrderOnMobile>
				<Grid item md={9}>
					{children}
				</Grid>
				<Grid item lg={2} />
				<Grid item md="auto">
					<Button color="tertiary" to={absoluteSitePaths.assistants.index}>
						Découvrir les simulateur et assistant pour mon entreprise
					</Button>
				</Grid>
				<Grid item>
					<SmallBody>
						Si vous souhaitez que cet assistant à la déclaration gère votre cas
						dans le futur, laissez-nous message en cliquant sur le bouton "
						<Emoji emoji="👋" />" à droite de votre écran.
					</SmallBody>
				</Grid>
			</Grid>
		</Message>
	)
}

const ReverseOrderOnMobile = styled(Grid)`
	order: 1;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		order: 0;
	}
`
