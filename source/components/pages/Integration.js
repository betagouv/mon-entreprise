import React, { Component } from 'react'
import './Integration.css'
import './Pages.css'

export default class MyComponent extends Component {
	render() {
		return (
			<section className="page" id="integration">
				<div>
					<h1>Intégrez le module Web</h1>
					<p>Intégrez le module en ajoutant une ligne à votre page Web :</p>
					<code>
						<span>{'<'}</span>
						<em>
							script<br />
							id
						</em>="script-simulateur-embauche" <em>
							data-couleur
						</em>="<span id="scriptColor">#2975D1</span>" <em>src</em>="https://embauche.beta.gouv.fr/modules/v2/dist/simulateur.js">
						<span>{'<'}</span>
						<span>/</span>
						<em>script</em>
						<span>></span>
					</code>
					<p>
						Vous pouvez <b>choisir la couleur principale du module</b> pour le
						fondre dans le thème visuel de votre page : changez simplement la
						valeur de <i>data-couleur</i> ci-dessus. Pour la choisir, utilisez
						notre{' '}
						<a href="/modules/v2/couleur.html" target="_blank">
							outil interactif
						</a>.
					</p>
					<p>
						<i className="fa fa-info-circle" aria-hidden="true" />
						Le simulateur utilisable sur embauche.beta.gouv.fr est la toute
						dernière version. Elle sera bientôt disponible à l'intégration sous
						forme de module.
					</p>
				</div>
				<div className="blocks" id="integrations">
					<h1>Quelques intégrations</h1>

					<div id="integrationList">
						<article>
							<a href="http://les-aides.fr/embauche">
								<img
									src={require('Images/accueil/cci.png')}
									alt="Les-aides.fr"
								/>
								<h2>CCI de France</h2>
							</a>
						</article>

						<article>
							<a href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche">
								<img src={require('Images/accueil/apec.png')} alt="" />
								<h2>APEC</h2>
							</a>
						</article>

						{/* <article>
							<a href="http://www.aides-creations.fr/simulateur-charges/">
								<img src="img/aides-creations.png" alt="Aides-Créations.com"/>
								<h2>Créateur de business plan<br/>
									Aides-Créations.com</h2>
							</a>
						</article> */}

						<article>
							<a href="http://travail-emploi.gouv.fr/emploi/accompagnement-des-tpe-pme/tpe-pme/article/le-simulateur-du-cout-d-embauche">
								<img
									src={require('Images/accueil/min-tra.jpg')}
									alt="Ministère du travail"
								/>
								<h2>Ministère du travail</h2>
							</a>
						</article>

						<article>
							<a href="https://entreprise.pole-emploi.fr/cout-salarie/">
								<img
									src={require('Images/accueil/pole-emploi.png')}
									alt="Pôle Emploi"
								/>
								<h2>Pôle Emploi</h2>
							</a>
						</article>

						<article>
							<a href="mailto:contact@embauche.beta.gouv.fr?subject=Proposition de réutilisation">
								<span className="question-mark">?</span>
								<h2>
									Une idée&nbsp;?<br />
									Contactez-nous&nbsp;!
								</h2>
							</a>
						</article>
					</div>
				</div>
			</section>
		)
	}
}
