import { Button } from 'DesignSystem/buttons'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import styled from 'styled-components'

const Iframe = styled.iframe`
	max-height: 75vh;
`

export const PlacesDesEntreprises = () => (
	<>
		<PopoverWithTrigger
			title="Échanger avec un conseiller :"
			trigger={(props) => (
				<Button {...props} light size="XS">
					Échanger avec un conseiller
				</Button>
			)}
		>
			<Iframe
				title="Formulaire de demande entreprise"
				src="https://place-des-entreprises.beta.gouv.fr/aide-entreprise/mon-entreprise-urssaf-fr"
				width="100%"
				height="800px"
				frameBorder="0"
				id="pdeIframe"
			/>
		</PopoverWithTrigger>
	</>
)
