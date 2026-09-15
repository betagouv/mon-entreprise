import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body, Container, Grid, H2, Link } from '@/design-system'

type Props = {
	id?: string
	imgSrc: string
}

export const QuiSommesNous = ({ id, imgSrc }: Props) => {
	const { t } = useTranslation()

	return (
		<ContainerWithXlPaddingBottom
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[700]
					: theme.colors.bases.primary[100]
			}
		>
			<AboutGrid container columnSpacing={6}>
				<DecorativeImageHiddenOnMobile item md={4} lg={3} xl={2}>
					<img src={imgSrc} alt="" />
				</DecorativeImageHiddenOnMobile>

				<Grid item md={8} lg={9} xl={10}>
					<H2 id={id}>
						{t('components.qui-sommes-nous.titre', 'Qui sommes-nous ?')}
					</H2>

					<Trans i18nKey="components.qui-sommes-nous.texte">
						<Body>
							Nous sommes une{' '}
							<Link
								aria-label={t(
									'components.qui-sommes-nous.aria-label.équipe',
									'petite équipe, nouvelle fenêtre'
								)}
								href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe"
							>
								petite équipe
							</Link>{' '}
							autonome et pluridisciplinaire au sein de l’
							<Link
								href="https://www.urssaf.fr"
								aria-label={t(
									'components.qui-sommes-nous.aria-label.urssaf',
									'Urssaf, nouvelle fenêtre'
								)}
							>
								Urssaf
							</Link>
							. Nous avons à cœur d’être au près de vos besoins afin d’améliorer
							en permanence ce site conformément au{' '}
							<Link
								href="https://beta.gouv.fr/manifeste"
								aria-label={t(
									'components.qui-sommes-nous.aria-label.beta-gouv',
									'manifeste beta.gouv.fr, nouvelle fenêtre'
								)}
							>
								manifeste beta.gouv.fr
							</Link>
							.
						</Body>

						<Body>
							Nous avons développé ce site pour accompagner les créateurs
							d’entreprise dans le développement de leur activité.
						</Body>

						<Body>
							Notre objectif est de lever toutes les incertitudes vis à vis de
							l’administration afin que vous puissiez vous concentrer sur ce qui
							compte&nbsp;: votre activité.
						</Body>
					</Trans>
				</Grid>
			</AboutGrid>
		</ContainerWithXlPaddingBottom>
	)
}

const ContainerWithXlPaddingBottom = styled(Container)`
	padding-bottom: ${({ theme }) => theme.spacings.xl};
`

const AboutGrid = styled(Grid)`
	align-items: end;
`

const DecorativeImageHiddenOnMobile = styled(Grid)`
	display: none;

	img {
		width: 100%;
		padding-bottom: ${({ theme }) => theme.spacings.sm};
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`
