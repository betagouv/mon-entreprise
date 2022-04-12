import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import notHandled from './undraw_access_denied_re_awnf.svg'

export default function NotHandledCase({
	children,
}: {
	children: React.ReactNode
}) {
	const sitePaths = useContext(SitePathsContext)

	return (
		<Message type="info">
			<Grid container justifyContent="center" spacing={3} alignItems="center">
				<Grid item xs={6} md={3} sx={{ order: { md: 0, xs: 1, sm: 1 } }}>
					<img
						src={notHandled}
						alt=""
						css={`
							width: 100%;
							padding: 1rem;
						`}
					/>
				</Grid>
				<Grid item md={9}>
					{children}
				</Grid>
				<Grid item lg={2} />
				<Grid item md="auto">
					<Button color="tertiary" to={sitePaths.gérer.index}>
						Découvrir les simulateur et assistant pour mon entreprise
					</Button>
				</Grid>
				<Grid item>
					<SmallBody>
						Si vous souhaitez que cet assistant à la déclaration gère votre cas
						dans le futur, laissez-nous message en cliquant sur le bouton "Faire
						une suggestion" en bas de la page.
					</SmallBody>
				</Grid>
			</Grid>
		</Message>
	)
}
