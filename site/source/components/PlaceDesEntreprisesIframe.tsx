import { iframeResize } from 'iframe-resizer'
import { ReactEventHandler, useEffect } from 'react'
import styled from 'styled-components'

const Iframe = styled.iframe`
	width: 1px;
	min-width: 100%;
	height: 80vh;
	border: 0;
`

const IframeContainer = styled.div`
	margin: 0 -3rem;
`

export const PlaceDesEntreprisesIframe = ({
	src,
	onLoad,
}: {
	src: string
	onLoad?: ReactEventHandler<HTMLIFrameElement>
}) => {
	useEffect(() => {
		iframeResize({}, '#pdeIframe')
	}, [])

	return (
		<IframeContainer>
			<Iframe
				title="Formulaire de demande entreprise"
				src={src}
				id="pdeIframe"
				onLoad={onLoad}
			/>
		</IframeContainer>
	)
}
