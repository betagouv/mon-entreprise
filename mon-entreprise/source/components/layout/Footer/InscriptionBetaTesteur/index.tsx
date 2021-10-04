import Overlay from 'Components/Overlay'
import { useState } from 'react'
import FeedbackSvg from './feedback.svg'

export default function InscriptionBetaTesteur() {
	const [opened, setOpened] = useState(false)
	const handleClose = () => {
		setOpened(false)
	}
	const handleOpen = () => {
		setOpened(true)
	}

	return (
		<>
			<button onClick={handleOpen} className="ui__ link-button">
				Devenir beta-testeur
			</button>
			{opened && (
				<Overlay onClose={handleClose} style={{ textAlign: 'left' }}>
					<img
						src={FeedbackSvg}
						css={`
							height: auto !important;
							max-width: 25rem;
							padding-top: 2rem;
						`}
					/>
					<h2>Votre avis nous intéresse</h2>
					<p>
						Inscrivez-vous pour accéder aux nouveautés en avant-première et
						donner votre avis sur les évolutions du site et des outils
						mon-entreprise.
					</p>
					<p>
						Vous recevrez des informations sur des ateliers de tests
						utilisateurs, des sondages pour donner votre avis, ou encore des
						liens pour tester de nouvelles fonctionnalités.
					</p>
					<p className="ui__ notice">
						Fréquence : moins d'un email tous les mois
					</p>
					<a
						className="ui__ plain button cta"
						target="_blank"
						href="https://b713d5c4.sibforms.com/serve/MUIEACTpgg9LvLVG7P4mkAbGA91OHsC2kuCsR3VlW9bV2m0vliZ31_DvZbtg8R5Lhqzd1Mc1iwuIsBw3FHBDG8Mbr4pjpVSbTzq6SLdox3f41GzWuIsT2IPSZ6x7-wh3ohDNDmHE7wbrenXUnqyPnH8Dm0cP2Hxnrq7T72GzINJR9DWwZd-LsqY2XZrvElFcRz6TlR6l36wGik3X"
					>
						S'inscrire sur la liste
					</a>
				</Overlay>
			)}
		</>
	)
}
