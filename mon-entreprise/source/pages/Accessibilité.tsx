import { H1, H2, H3 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'
import { TrackPage } from '../ATInternetTracking'
import Meta from '../components/utils/Meta'

export default function Accessibilité() {
	return (
		<Trans i18nKey="pages.accessibilité">
			<H1>Accessibilité</H1>
			<Meta
				page="accessibilité"
				title="Accessibilité"
				description="Référentiel Général d’Amélioration de l’Accessibilité"
			/>
			<TrackPage chapter1="informations" name="accessibilite" />

			<p>
				Cette page n'est pas une page d'aide, mais une déclaration de conformité
				au{' '}
				<abbr title="Référentiel Général d’Amélioration de l’Accessibilité">
					RGAA
				</abbr>{' '}
				4.0&nbsp;qui vise à définir le niveau d'accessibilité général constaté
				sur le site conformément à la réglementation. Cette page est obligatoire
				pour être conforme au RGAA 4.0.
			</p>
			<H2>Qu’est-ce que l’accessibilité numérique&nbsp;?</H2>
			<p>
				Un site web accessible est un site qui permet à tous les internautes
				d’accéder à ses contenus sans difficulté, y compris aux personnes qui
				présentent un handicap et utilisent des logiciels ou matériels
				spécialisés.
			</p>
			<p>Un site accessible permet par exemple de&nbsp;:</p>
			<ul>
				<li>
					Naviguer avec des synthèses vocales ou des plages braille (notamment
					utilisées par les internautes aveugles ou malvoyants).
				</li>
				<li>
					Personnaliser l’affichage du site selon ses besoins (grossissement des
					caractères, modification des couleurs, etc.).
				</li>
				<li>
					Naviguer sans utiliser la souris, avec le clavier uniquement ou via un
					écran tactile.
				</li>
			</ul>
			<H2>Déclaration d’accessibilité</H2>
			<p>
				L'Acoss s’engage à rendre ses sites internet accessibles conformément à
				l’article 47 de la loi n° 2005-102 du 11 février 2005.
			</p>
			<p>
				À cette fin, elle rédige{' '}
				<a
					href="https://www.acoss.fr/files/RGAA/accessibilite_numerique-schema_pluriannuel_2020_2022-Acoss.pdf"
					target="_blank"
					title="La stratégie et le plan d’action à mettre en œuvre - Nouvelle fenêtre"
				>
					la stratégie et le plan d’action à mettre en œuvre
				</a>
				.
			</p>
			<p>
				Cette déclaration d’accessibilité s’applique à{' '}
				<a href="https://mon-entreprise.fr">https://mon-entreprise.fr</a>.
			</p>
			<H3>État de conformité</H3>
			<p>
				<a href="https://mon-entreprise.fr">https://mon-entreprise.fr</a> n’est
				actuellement pas en conformité avec le{' '}
				<a
					href="https://numerique.gouv.fr/publications/rgaa-accessibilite/"
					target="_blank"
					title="Référentiel général d’amélioration de l’accessibilité (RGAA) - Nouvelle fenêtre"
				>
					référentiel général d’amélioration de l’accessibilité (RGAA)
				</a>
				. L’audit de conformité sera prochainement planifié. Les corrections
				seront prises en compte suite à l’audit.
			</p>
			<H3>Droit à la compensation</H3>
			<p>
				Dans l’attente d’une mise en conformité totale, vous pouvez obtenir une
				version accessible des documents ou des informations qui y seraient
				contenues en envoyant un courriel à{' '}
				<a href="mailto:accessibilite@acoss.fr?subject=%5Bmon-entreprise.fr%5D%20Accessibilit%C3%A9%20num%C3%A9rique%20%3A%20Droit%20%C3%A0%20la%20compensation&cc=contact@mon-entreprise.beta.gouv.fr">
					accessibilite@acoss.fr
				</a>{' '}
				en indiquant le nom du document concerné et/ou les informations que vous
				souhaiteriez obtenir. Les informations demandées vous seront transmises
				dans les meilleurs délais.
			</p>
			<H3>Amélioration et contact</H3>
			<p>
				Vous pouvez nous aider à améliorer l’accessibilité du site en nous
				signalant les problèmes éventuels que vous rencontrez. Pour ce faire,
				envoyez-nous un courriel à{' '}
				<a href="mailto:accessibilite@acoss.fr?subject=%5Bmon-entreprise.fr%5D%20Accessibilit%C3%A9%20num%C3%A9rique%20%3A%20Am%C3%A9lioration&cc=contact@mon-entreprise.beta.gouv.fr">
					accessibilite@acoss.fr
				</a>
				.
			</p>
			<H3>Défenseur des droits</H3>
			<p>Cette procédure est à utiliser dans le cas suivant.</p>
			<p>
				Vous avez signalé au responsable du site internet un défaut
				d’accessibilité qui vous empêche d’accéder à un contenu ou à un des
				services du portail et vous n’avez pas obtenu de réponse satisfaisante.
			</p>
			<ul>
				<li>
					Écrire un message au Défenseur des droits (
					<a
						href="https://formulaire.defenseurdesdroits.fr/"
						target="_blank"
						title="https://formulaire.defenseurdesdroits.fr/ - Nouvelle fenêtre"
					>
						https://formulaire.defenseurdesdroits.fr/
					</a>
					)
				</li>
				<li>
					Contacter le délégué du Défenseur des droits dans votre région (
					<a
						href="https://www.defenseurdesdroits.fr/saisir/delegues"
						target="_blank"
						title="https://www.defenseurdesdroits.fr/saisir/delegues - Nouvelle fenêtre"
					>
						https://www.defenseurdesdroits.fr/saisir/delegues
					</a>
					)
				</li>
				<li>
					Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)
					à&nbsp;:
					<br />
					Défenseur des droits
					<br />
					Libre réponse 71120
					<br />
					75342&nbsp;Paris CEDEX 07
				</li>
			</ul>

			<p className="ui__ notice">Mis à jour le 29/01/2021</p>
		</Trans>
	)
}
