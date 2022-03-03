import { lazy, Suspense, useEffect } from 'react'
import styled from 'styled-components'
import Emoji from './utils/Emoji'
import { iframeResize } from 'iframe-resizer'
import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Loader } from '@/design-system/icons/Loader'

const Iframe = styled.iframe`
	width: 1px;
	min-width: 100%;
	height: 80vh;
`

const IframeContainer = styled.div`
	margin: 0 -3rem;
`

export const PlacesDesEntreprisesIframe = () => {
	useEffect(() => {
		iframeResize({}, '#pdeIframe')
	}, [])

	return (
		<IframeContainer>
			<Iframe
				title="Formulaire de demande entreprise"
				src="https://place-des-entreprises.beta.gouv.fr/aide-entreprise/mon-entreprise-urssaf-fr"
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

export const PlacesDesEntreprises = () => (
	<Container>
		<PopoverWithTrigger
			title="Échanger avec un conseiller :"
			trigger={(props) => (
				<Button {...props} light size="XS">
					<Emoji emoji="📞" /> Échanger avec un conseiller
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
				<LazyIframe />
			</Suspense>
		</PopoverWithTrigger>
	</Container>
)
