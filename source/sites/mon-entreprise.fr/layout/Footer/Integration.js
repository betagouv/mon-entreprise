import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import urssafLogo from 'Images/urssaf.svg'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Integration.css'

export default function Integration() {
	const [opened, setOpened] = useState(false)
	return (
		<>
			<button onClick={() => setOpened(true)} className="ui__ link-button">
				Intégrer le simulateur
			</button>
			{opened && (
				<Overlay onClose={() => setOpened(false)} style={{ textAlign: 'left' }}>
					<ScrollToTop />
					<section id="integration">
						<div>
							<h1>Intégrez le module Web</h1>
							<p>En ajoutant une ligne à votre page Web :</p>
							<code>
								<span>{'<'}</span>
								<em>
									script
									<br />
									id
								</em>
								="script-simulateur-embauche" <em>data-couleur</em>="
								<span id="scriptColor">#2975D1</span>" <em>src</em>
								="https://embauche.beta.gouv.fr/dist/simulateur.js">
								<span>{'<'}</span>
								<span>/</span>
								<em>script</em>
								<span>></span>
							</code>
							<p>
								Vous pouvez{' '}
								<strong>choisir la couleur principale du module</strong> pour le
								fondre dans le thème visuel de votre page : changez simplement
								la valeur de <i>data-couleur</i> ci-dessus. Pour la choisir,
								utilisez notre <Link to="/dev/couleur">outil interactif</Link>.
							</p>
							<p>
								L'attribut <i>data-lang="en"</i> vous permet quand à lui de
								choisir l'anglais comme langue par défaut du simulateur (elle
								restera modifiable par l'utilisateur).
							</p>
						</div>
						<div className="blocks" id="integrations">
							<h1>Quelques intégrations</h1>

							<div id="integrationList">
								<article>
									<a href="https://www.urssaf.fr/portail/home/utile-et-pratique/estimateur-de-cotisations-2019.html?ut=estimateurs">
										<img src={urssafLogo} alt="urssaf.fr" />
										<h2>Urssaf</h2>
									</a>
								</article>
								<article>
									<a href="http://les-aides.fr/embauche">
										<img src={require('./images/cci.png')} alt="Les-aides.fr" />
										<h2>CCI de France</h2>
									</a>
								</article>

								<article>
									<a href="https://recruteurs.apec.fr/Recrutement/Pratique-RH/Tous-les-dossiers-Recrutement/Diagnostiquer/Vous-envisagez-de-recruter-calculez-le-cout-de-cette-embauche">
										<img src={require('./images/apec.png')} alt="" />
										<h2>APEC</h2>
									</a>
								</article>

								<article>
									<a href="http://travail-emploi.gouv.fr/emploi/accompagnement-des-tpe-pme/tpe-pme/article/le-simulateur-du-cout-d-embauche">
										<img
											src={require('./images/min-tra.jpg')}
											alt="Ministère du travail"
										/>
										<h2>Ministère du travail</h2>
									</a>
								</article>

								<article>
									<a href="https://entreprise.pole-emploi.fr/cout-salarie/">
										<img
											src={require('./images/pole-emploi.png')}
											alt="Pôle Emploi"
										/>
										<h2>Pôle Emploi</h2>
									</a>
								</article>

								<article>
									<a href="mailto:contact@mon-entreprise.beta.gouv.fr?subject=Proposition de réutilisation">
										<span className="question-mark">?</span>
										<h2>
											Une idée&nbsp;?
											<br />
											Contactez-nous&nbsp;!
										</h2>
									</a>
								</article>
							</div>
						</div>
					</section>
				</Overlay>
			)}
		</>
	)
}
