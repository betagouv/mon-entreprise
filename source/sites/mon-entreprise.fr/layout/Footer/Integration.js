import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { useState } from 'react'
import { T } from 'Components'
import { Link } from 'react-router-dom'
import './Integration.css'
import withSitePaths from 'Components/utils/withSitePaths'
import emoji from 'react-easy-emoji'

export default withSitePaths(function Integration({ sitePaths }) {
	const [opened, setOpened] = useState(false)
	return (
		<>
			<button onClick={() => setOpened(true)} className="ui__ link-button">
				Intégrer nos simulateurs
			</button>
			{opened && (
				<Overlay onClose={() => setOpened(false)} style={{ textAlign: 'left' }}>
					<ScrollToTop />
					<section id="integration">
						<div>
							<h1>Intégrez nos simulateurs !</h1>
							<p>
								En fonction de vos besoins et de vos ressources techniques, deux
								options s'offrent à vous :{' '}
							</p>
							<Link
								className="ui__ button-choice "
								onClick={() => setOpened(false)}
								to={sitePaths.integration.iframe}>
								{emoji('📱')} <T>Intégrer l'interface de simulation</T>
							</Link>
							<Link
								className="ui__ button-choice "
								onClick={() => setOpened(false)}
								to={sitePaths.integration.library}>
								{emoji('🧰')} <T>Intégrer la bibliothèque de calcul</T>
							</Link>
						</div>
					</section>
				</Overlay>
			)}
		</>
	)
})
