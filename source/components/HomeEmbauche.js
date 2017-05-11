import React, { Component } from 'react'
import './HomeEmbauche.css'

export default class HomeEmbauche extends Component {
	render() {
		return (
			<div id="homeEmbauche">
				<nav>
					<div id="project">
						<img  src={require('../images/homeEmbauche/logo-SGMAP-fond-blanc.svg')} alt="Secrétariat général pour la modernisation de l'action publique" />
					</div>
				  <ul>
						<li><a href="#about">À propos</a></li>
						<li><a id="integrate" href="#integration">
							<strong>
								<span className="wide-screen">Intégrez le module</span>
								<span className="narrow-screen">Intégration</span>
							</strong>
						</a></li>
				    <li><a href="/contact">Contact</a></li>
				  </ul>
				</nav>
				<div id="splash">
					<div id="showcase">
						<div id="showcaseMain">
							<h1>Estimer le {' '} prix<br/>d'une {' '} embauche en {' '} France</h1>
							<div id="main-actions">
								<div>
									<a href="/simulateur" target="_blank">Simuler un CDI <i className="fa fa-hand-o-right" aria-hidden="true"></i></a>
								</div>
								<div>
									<span>Nouveau</span>
									<a href="/simu/surcoût-CDD/intro">Simuler le surcoût CDD (beta) <i className="fa fa-hand-o-right" aria-hidden="true"></i></a>
								</div>
							</div>
						</div>
						<div id="image-wrap">
							<img src={require('../images/homeEmbauche/simulateur-2017.gif')} alt="Vue animée du simulateur" className="animated" />
							<span id="play-button">&#9654;</span>
							<img src={require('../images/homeEmbauche/simulateur-2017.png')} alt="Image du simulateur" className="static" />
						</div>
					</div>
				</div>


				<section className="" id="about">
					<h1>À propos</h1>
					<p>
						L'incubateur des services numériques du Gouvernement a lancé, le 1ᵉʳ octobre 2014, le développement en mode Startup d’État d’une ressource ouverte de calcul des prélèvements sociaux sur les revenus d'activité en France.
					</p>
					<p>
						Le premier produit, un <em>module d'estimation du prix d'une embauche</em>, peut être <em>intégré facilement et gratuitement</em> par toute organisation sur son site Web. Ce module repose sur le moteur de calcul OpenFisca.
					</p>
					<p>
						Nous encourageons toutes les initiatives d'information sur le coût du travail&nbsp;: ses contreparties, la fiche de paie, les spécificités du droit conventionnel...
					</p>
					<a className="button" href="mailto:contact@embauche.beta.gouv.fr?subject=Rejoindre l'OpenLab&body=Bonjour, je suis intéressé par votre produit et votre démarche et souhaite participer au prochain OpenLab. Bonne journée !">Participez à l'évolution du produit</a>
					{/* <p>Notre prochaine rencontre OpenLab aura lieu <strong>le mercredi 18 janvier 2017 à 10h</strong>, au 86 allée de Bercy, 75012, salle 381-R</p> */}
				</section>


				<section className="light" id="integration">
					<h1>Intégrez le module Web</h1>
					<p>
		 				Intégrez le module en ajoutant une ligne à votre page Web :
					</p>
					<code>
						<span>{'<'}</span><em>script<br/>
							id</em>="script-simulateur-embauche" <em>data-couleur</em>="<span id="scriptColor">#4A89DC</span>" <em>src</em>="https://embauche.beta.gouv.fr/modules/v2/dist/simulateur.js">
						<span>{'<'}</span><span>/</span><em>script</em><span>></span>
					</code>
					<p>
						Vous pouvez <b>choisir la couleur principale du module</b> pour le fondre dans le thème visuel de votre page : changez simplement la valeur de <i>data-couleur</i> ci-dessus. Pour la choisir, utilisez notre <a href="/modules/v2/couleur.html" target="_blank">outil interactif</a>.
					</p>

				</section>

				<section className="light" id="integration">
					<h1>Ou utilisez l'API</h1>
					<p>
		 				Intégrez le calcul des prélèvements sociaux très simplement dans votre application
					</p>
					<a href="https://github.com/sgmap/cout-embauche/wiki/Documentation-de-l'API-pr%C3%A9l%C3%A8vements-sociaux" target="_blank">Lire la <em>documentation</em> &rarr;</a>
				</section>

				<section className="blocks dark" id="integrations">
					<h1>Quelques intégrations</h1>

					<article>
						<a href="/simulateur">
							<img src={require('../images/homeEmbauche/simulateur.png')} alt=""/>
							<h2>Notre démonstrateur</h2>
						</a>
					</article>

					<article>
						<a href="http://les-aides.fr/embauche">
							<img src={require('../images/homeEmbauche/cci.png')} alt="Les-aides.fr"/>
							<h2>CCI de France</h2>
						</a>
					</article>

					<article>
						<a href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche">
							<img src={require('../images/homeEmbauche/apec.png')} alt=""/>
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
							<img src={require('../images/homeEmbauche/min-tra.jpg')} alt="Ministère du travail"/>
							<h2>Ministère du travail</h2>
						</a>
					</article>

					<article>
						<a href="https://entreprise.pole-emploi.fr/cout-salarie/">
							<img src={require('../images/homeEmbauche/pole-emploi.png')} alt="Pôle Emploi"/>
							<h2>Pôle Emploi</h2>
						</a>
					</article>

					<article>
						<a href="mailto:contact@embauche.beta.gouv.fr?subject=Proposition de réutilisation">
							<span className="question-mark">?</span>
							<h2>Une idée&nbsp;?<br/>
								Contactez-nous&nbsp;!</h2>
						</a>
					</article>
				</section>

				<section id="contribute" className="light blocks extended">
					<h1>Contribuez</h1>

					<p>
						Les différentes briques sont ouvertes à la contribution et disponibles gratuitement sous licence libre.
						Aidez-nous à les améliorer !
					</p>

					<div className="block-wrap">
						<article className="alpha">
							<a href="https://github.com/sgmap/cout-embauche/">
								<img src={require('../images/homeEmbauche/widget.svg')} alt=""/>
								<h2>Module Web</h2>
							</a>
							<p>Permet l'estimation rapide et précise du coût d'une embauche</p>
						</article>
						<article id="checklist" className="alpha">
							<a href="https://github.com/openfisca/openfisca-france/tree/master/openfisca_france/tests/formulas">
								<img src={require('../images/homeEmbauche/tests.svg')} alt="" />
								<h2>Tests des calculs</h2>
							</a>
							<p>Fiabilisent le calcul des prélèvements</p>
						</article>
						<article id="openfisca" className="alpha">
							<a href="http://www.openfisca.fr">
								<img alt="OpenFisca" src={require('../images/homeEmbauche/logo-openfisca.svg')} />
								<h2>Moteur de calcul</h2>
							</a>
							<p>Implémente les règles du système socio-fiscal français</p>
						</article>
					</div>

				</section>
			</div>
		)
	}
}
