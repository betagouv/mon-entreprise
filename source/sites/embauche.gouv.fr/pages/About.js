import { LegalNoticeContent } from 'Components/LegalNotice'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './About.css'
import './MailChimp.css'

export default class About extends Component {
	render() {
		return (
			<section className="ui__ container" id="about">
				<h1>À propos</h1>
				<section>
					<p>
						<a href="https://beta.gouv.fr">BetaGouv</a> a lancé en 2014 le
						développement d’un moteur ouvert de calcul des cotisations sociales
						en France, étape incontournable pour embaucher ou négocier un
						salaire.
					</p>
					<p>
						Ce premier service, un simulateur des sommes en jeu lors d'une
						embauche, peut être{' '}
						<Link to="/intégrer">intégré facilement et gratuitement</Link> par
						toute organisation sur son site Web.
					</p>

					<p>
						Début 2018, l'
						<a href="https://acoss.fr">ACOSS</a> (la tête des URSSAF) nous
						rejoint pour consolider ce simulateur, le traduire en anglais et
						lancer{' '}
						<a href="https://mycompanyinfrance.fr">mycompanyinfrance.fr</a>, un
						guide de création d'entreprise en France.
					</p>
					<p>
						Suivez nos mises à jour sur{' '}
						<a href="https://twitter.com/embauchegouv">
							twitter <i className="fa fa-twitter" aria-hidden="true" />
						</a>
					</p>
				</section>
				<h1>Contribuez !</h1>
				<section>
					<p>
						Venez définir avec nous la feuille de route du service
						(implémentation des conventions collectives, ajout des statuts
						autres que le travail salarié, ...).
					</p>
					<MailChimp />
					<p>
						Ou <Link to="/contact">contactez-nous</Link> directement.
					</p>
					<p>
						Le code est ouvert et contributif, rendez-vous sur{' '}
						<a href="https://github.com/betagouv/syso/">
							GitHub <i className="fa fa-github" aria-hidden="true" />
						</a>
					</p>
				</section>
				{/* <p>Notre prochaine rencontre OpenLab aura lieu <strong>le mercredi 18 janvier 2017 à 10h</strong>, au 86 allée de Bercy, 75012, salle 381-R</p> */}
				<h1>Vie privée</h1>
				<p>
					Les simulateurs hébergés sur embauche.beta.gouv.fr n'ont pas de
					mémoire : les données de simulation (salaires, code postal de
					l'entreprise, etc.) <em>ne sont pas stockées sur nos serveurs</em>.
				</p>
				<p>
					Par contre, nous recueillons des statistiques anonymes d'usage du
					site, que nous utilisons dans l'unique but d'améliorer le service,
					conformément aux{' '}
					<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
						recommandations de la CNIL
					</a>
					.
				</p>
				<iframe src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr" />
				<LegalNoticeContent />
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
			noValidate>
			<div id="mc_embed_signup_scroll">
				<label htmlFor="mce-EMAIL">
					Inscrivez-vous à notre liste de diffusion
				</label>
				<div
					style={{ position: 'absolute', left: '-5000px', ariaHidden: 'true' }}>
					<input
						type="text"
						name="b_732a4d1b0d2e8a1a1fd3d01db_53bed2b6ac"
						tabIndex="-1"
						value=""
					/>
				</div>
				<div className="clear">
					<input
						className="ui__ button"
						type="submit"
						value="M'inscrire"
						name="subscribe"
						id="mc-embedded-subscribe"
					/>
				</div>
			</div>
		</form>
	</div>
)
