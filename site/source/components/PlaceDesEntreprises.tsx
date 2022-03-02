import { Button } from 'DesignSystem/buttons'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { lazy, Suspense, useEffect } from 'react'
import styled from 'styled-components'
import Emoji from './utils/Emoji'
import { iframeResize } from 'iframe-resizer'

const Container = styled.div`
	display: flex;
	justify-content: center;
`

const Iframe = styled.iframe`
	width: 1px;
	min-width: 100%;
`

export const PlacesDesEntreprisesIframe = () => {
	useEffect(() => {
		iframeResize({}, '#pdeIframe')
	}, [])

	return (
		<Iframe
			title="Formulaire de demande entreprise"
			src="https://place-des-entreprises.beta.gouv.fr/aide-entreprise/mon-entreprise-urssaf-fr"
			frameBorder="0"
			id="pdeIframe"
		/>
	)
}

const LazyIframe = lazy(async () => {
	return import('./PlaceDesEntreprises').then(
		({ PlacesDesEntreprisesIframe }) => ({
			default: PlacesDesEntreprisesIframe,
		})
	)
})

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
			<Suspense fallback={null}>
				<LazyIframe />
			</Suspense>
		</PopoverWithTrigger>
	</Container>
)
