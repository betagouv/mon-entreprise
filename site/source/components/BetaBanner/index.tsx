import React from 'react'
import { Trans } from 'react-i18next'

import { Container, Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import wipSvg from './undraw_qa_engineers_dg-5-p.svg'

export default function BetaBanner({
	children,
}: {
	children?: React.ReactNode
}) {
	return (
		<Container
			$backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.bases.tertiary[700]
					: theme.colors.bases.tertiary[100]
			}
		>
			<Grid
				container
				spacing={4}
				css={`
					align-items: center;
				`}
			>
				<Grid item sm={3}>
					<img
						src={wipSvg}
						alt=""
						style={{ width: '100%', padding: '0.25rem' }}
					/>
				</Grid>
				<Grid item sm={9}>
					{children ?? (
						<Trans i18nKey="betawarning">
							<H3 as="h2">
								<Strong>Cet outil est en version beta</Strong>
							</H3>
							<Intro>
								Nous travaillons à valider les informations et les calculs, mais
								des <Strong>erreurs peuvent être présentes</Strong>.
							</Intro>
							<Body>
								Bien qu'il ne soit pas terminé, nous avons choisi de le publier
								pour prendre en compte vos retours le plus tôt possible. Si vous
								pensez avoir trouvé un problème ou si vous voulez nous partager
								une remarque, vous pouvez nous contacter via le bouton « Faire
								une suggestion » en bas de page.
							</Body>
						</Trans>
					)}
				</Grid>
			</Grid>
		</Container>
	)
}
