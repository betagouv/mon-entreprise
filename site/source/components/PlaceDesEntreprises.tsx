import { lazy, Suspense, useEffect } from 'react'
import styled from 'styled-components'
import Emoji from './utils/Emoji'
import { iframeResize } from 'iframe-resizer'
import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Loader } from '@/design-system/icons/Loader'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { isProduction } from '@/utils'

const Iframe = styled.iframe`
	width: 1px;
	min-width: 100%;
	height: 80vh;
`

const IframeContainer = styled.div`
	margin: 0 -3rem;
`

export const PlacesDesEntreprisesIframe = ({ src }: { src: string }) => {
	useEffect(() => {
		iframeResize({}, '#pdeIframe')
	}, [])

	return (
		<IframeContainer>
			<Iframe
				title="Formulaire de demande entreprise"
				src={src}
				frameBorder="0"
				id="pdeIframe"
			/>
		</IframeContainer>
	)
}

const LazyIframe = lazy(async () => {
	return import('./PlaceDesEntreprises').then(
		({ PlacesDesEntreprisesIframe }) => ({
			default: PlacesDesEntreprisesIframe,
		})
	)
})

const Container = styled.div`
	display: flex;
	justify-content: center;
`

const ButtonLabel = styled.span`
	margin-left: 1rem;
`

export const PlacesDesEntreprisesButton = ({
	pathname,
	siret,
}: {
	pathname: string
	siret?: string
}) => {
	const { t } = useTranslation()
	const baseURL =
		'https://' +
		(isProduction()
			? 'place-des-entreprises.beta.gouv.fr'
			: 'reso-staging.osc-fr1.scalingo.io')
	const url = new URL(baseURL + pathname)

	if (siret) {
		url.searchParams.set('siret', siret)
	}

	return (
		<Container>
			<PopoverWithTrigger
				title={t('Échanger avec un conseiller')}
				trigger={(props) => (
					<Button {...props} light size="XS">
						<Emoji emoji="📞" />
						<ButtonLabel>{t('Échanger avec un conseiller')}</ButtonLabel>
					</Button>
				)}
			>
				<Suspense
					fallback={
						<Container
							css={`
								height: 300px;
								align-items: center;
							`}
						>
							<Loader />
						</Container>
					}
				>
					<>
						<Body>
							<Trans>
								Décrivez votre projet ou votre problème en donnant quelques
								éléments de contexte. Nous identifions, parmi l’ensemble des
								partenaires publics et parapublics, le conseiller compétent pour
								votre demande. Celui-ci vous contacte par téléphone sous 5 jours
								et vous accompagne en fonction de votre situation.
							</Trans>
						</Body>
						<LazyIframe src={url.href} />
					</>
				</Suspense>
			</PopoverWithTrigger>
		</Container>
	)
}
