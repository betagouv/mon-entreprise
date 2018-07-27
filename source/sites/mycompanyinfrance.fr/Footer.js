import React from 'react'
const Footer = () => (
	<>
		<footer>
			<ul>
				<li>
					Un service fourni par l'<a href="http://www.urssaf.fr/">URSSAF</a>
					<br />
					et incubé par <a href="https://beta.gouv.fr">beta.gouv.fr</a>
				</li>
				<li>
					<a href="http://www.urssaf.fr/">
						<img aria-label="DINSIC" role="img" />
					</a>
					<a href="https://beta.gouv.fr">
						<img aria-label="beta.gouv.fr" role="img" />
					</a>
				</li>
			</ul>
			<ul>
				<li>
					<a href="https://github.com/betagouv/syso/releases">Nouveautés</a>
				</li>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://doc.demarches-simplifiees.fr/cgu#4-mentions-legales">
						Mentions légales
					</a>
				</li>
				<li>
					<a href="mailto:contact@embauche.beta.gouv.fr">Contact</a>
				</li>
			</ul>
		</footer>
	</>
)

export default Footer
