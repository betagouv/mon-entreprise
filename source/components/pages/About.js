import React, { Component } from 'react'
import './Pages.css'
import Header from './Header'
export default class About extends Component {
	render() {
		return (
			<section className="page" id="about">
				<Header />
				<h1>À propos</h1>
				<p>
					<a href="https://beta.gouv.fr" target="_blank">
						L'incubateur des services numériques de l'État a lancé
					</a>{' '}
					en 2014 le développement d’une <em>ressource ouverte</em> de calcul
					des prélèvements sociaux sur les revenus d'activité en France.
				</p>
				<p>
					Ce premier service, un{' '}
					<em>module simulation des sommes en jeu lors d'une embauche</em>, peut
					être <em>intégré facilement et gratuitement</em> par toute
					organisation sur son site Web.
				</p>
				<p>
					Ce travail est contributif : venez définir avec nous la feuille de
					route du service (implémentation des conventions collectives, ajout
					des statuts autres que le travail salarié, ...).
				</p>
				<MailChimp />
				<a
					className="button"
					href="mailto:contact@embauche.beta.gouv.fr?subject=Rejoindre l'OpenLab&body=Bonjour, je suis intéressé par votre produit et votre démarche et souhaite participer au prochain OpenLab. Bonne journée !"
				>
					Ou contactez-nous directement
				</a>
				{/* <p>Notre prochaine rencontre OpenLab aura lieu <strong>le mercredi 18 janvier 2017 à 10h</strong>, au 86 allée de Bercy, 75012, salle 381-R</p> */}
			</section>
		)
	}
}

let MailChimp = () => (
	<div id="mc_embed_signup">
		<form
			action="https://gouv.us13.list-manage.com/subscribe/post?u=732a4d1b0d2e8a1a1fd3d01db&amp;id=53bed2b6ac"
			method="post"
			id="mc-embedded-subscribe-form"
			name="mc-embedded-subscribe-form"
			className="validate"
			target="_blank"
			noValidate
		>
			<div id="mc_embed_signup_scroll">
				<label htmlFor="mce-EMAIL">
					Inscrivez-vous à notre liste de diffusion
				</label>
				<div
					style={{ position: 'absolute', left: '-5000px', ariaHidden: 'true' }}
				>
					<input
						type="text"
						name="b_732a4d1b0d2e8a1a1fd3d01db_53bed2b6ac"
						tabIndex="-1"
						value=""
					/>
				</div>
				<div className="clear">
					<input
						type="submit"
						value="M'inscrire"
						name="subscribe"
						id="mc-embedded-subscribe"
						className="button"
					/>
				</div>
			</div>
		</form>
	</div>
)
