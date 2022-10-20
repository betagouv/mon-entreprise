import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
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

			<Body>
				Cette page n'est pas une page d'aide, mais une déclaration de conformité
				au{' '}
				<abbr title="Référentiel Général d’Amélioration de l’Accessibilité">
					RGAA
				</abbr>{' '}
				4.0&nbsp;qui vise à définir le niveau d'accessibilité général constaté
				sur le site conformément à la réglementation. Cette page est obligatoire
				pour être conforme au RGAA 4.0.
			</Body>
			<H2>Qu’est-ce que l’accessibilité numérique&nbsp;?</H2>
			<Body>
				Un site web accessible est un site qui permet à tous les internautes
				d’accéder à ses contenus sans difficulté, y compris aux personnes qui
				présentent un handicap et utilisent des logiciels ou matériels
				spécialisés.
			</Body>
			<Body>Un site accessible permet par exemple de&nbsp;:</Body>
			<Ul>
				<Li>
					Naviguer avec des synthèses vocales ou des plages braille (notamment
					utilisées par les internautes aveugles ou malvoyants).
				</Li>
				<Li>
					Personnaliser l’affichage du site selon ses besoins (grossissement des
					caractères, modification des couleurs, etc.).
				</Li>
				<Li>
					Naviguer sans utiliser la souris, avec le clavier uniquement ou via un
					écran tactile.
				</Li>
			</Ul>
			<H2>Déclaration d’accessibilité</H2>
			<Body>
				L'Acoss s’engage à rendre ses sites internet accessibles conformément à
				l’article 47 de la loi n° 2005-102 du 11 février 2005.
			</Body>
			<Body>
				À cette fin, elle rédige{' '}
				<Link
					href="https://www.acoss.fr/files/RGAA/accessibilite_numerique-schema_pluriannuel_2020_2022-Acoss.pdf"
					target="_blank"
					rel="noreferrer"
					aria-label="la stratégie et le plan d’action à mettre en œuvre, en savoir plus, nouvelle fenêtre"
				>
					la stratégie et le plan d’action à mettre en œuvre
				</Link>
				.
			</Body>
			<Body>
				Cette déclaration d’accessibilité s’applique à{' '}
				<Link
					href="https://mon-entreprise.urssaf.fr"
					aria-label="https://mon-entreprise.urssaf.fr, nouvelle fenêtre"
				>
					https://mon-entreprise.urssaf.fr
				</Link>
				.
			</Body>
			<H3>État de conformité</H3>
			<Body>
				<Link
					href="https://mon-entreprise.urssaf.fr"
					aria-label="https://mon-entreprise.urssaf.fr, nouvelle fenêtre"
				>
					https://mon-entreprise.urssaf.fr
				</Link>{' '}
				n’est actuellement pas en conformité avec le{' '}
				<Link
					href="https://numerique.gouv.fr/publications/rgaa-accessibilite/"
					target="_blank"
					rel="noreferrer"
					aria-label="Référentiel général d’amélioration de l’accessibilité (RGAA), en savoir plus, nouvelle fenêtre"
				>
					référentiel général d’amélioration de l’accessibilité (RGAA)
				</Link>
				. L’audit de conformité sera prochainement planifié. Les corrections
				seront prises en compte suite à l’audit.
			</Body>
			<H3>Droit à la compensation</H3>
			<Body>
				Dans l’attente d’une mise en conformité totale, vous pouvez obtenir une
				version accessible des documents ou des informations qui y seraient
				contenues en envoyant un courriel à{' '}
				<Link href="mailto:accessibilite@acoss.fr?subject=%5Bmon-entreprise.urssaf.fr%5D%20Accessibilit%C3%A9%20num%C3%A9rique%20%3A%20Droit%20%C3%A0%20la%20compensation&cc=contact@mon-entreprise.beta.gouv.fr">
					accessibilite@acoss.fr
				</Link>{' '}
				en indiquant le nom du document concerné et/ou les informations que vous
				souhaiteriez obtenir. Les informations demandées vous seront transmises
				dans les meilleurs délais.
			</Body>
			<H3>Amélioration et contact</H3>
			<Body>
				Vous pouvez nous aider à améliorer l’accessibilité du site en nous
				signalant les problèmes éventuels que vous rencontrez. Pour ce faire,
				envoyez-nous un courriel à{' '}
				<Link href="mailto:accessibilite@acoss.fr?subject=%5Bmon-entreprise.urssaf.fr%5D%20Accessibilit%C3%A9%20num%C3%A9rique%20%3A%20Am%C3%A9lioration&cc=contact@mon-entreprise.beta.gouv.fr">
					accessibilite@acoss.fr
				</Link>
				.
			</Body>
			<H3>Défenseur des droits</H3>
			<Body>Cette procédure est à utiliser dans le cas suivant.</Body>
			<Body>
				Vous avez signalé au responsable du site internet un défaut
				d’accessibilité qui vous empêche d’accéder à un contenu ou à un des
				services du portail et vous n’avez pas obtenu de réponse satisfaisante.
			</Body>
			<Ul>
				<Li>
					Écrire un message au Défenseur des droits (
					<Link
						href="https://formulaire.defenseurdesdroits.fr/"
						target="_blank"
						rel="noreferrer"
						aria-label="https://formulaire.defenseurdesdroits.fr/, nouvelle fenêtre"
					>
						https://formulaire.defenseurdesdroits.fr/
					</Link>
					)
				</Li>
				<Li>
					Contacter le délégué du Défenseur des droits dans votre région (
					<Link
						href="https://www.defenseurdesdroits.fr/saisir/delegues"
						target="_blank"
						rel="noreferrer"
						aria-label="https://www.defenseurdesdroits.fr/saisir/delegues, nouvelle fenêtre"
					>
						https://www.defenseurdesdroits.fr/saisir/delegues
					</Link>
					)
				</Li>
				<Li>
					Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)
					à&nbsp;:
					<br />
					Défenseur des droits
					<br />
					Libre réponse 71120
					<br />
					75342&nbsp;Paris CEDEX 07
				</Li>
			</Ul>

			<SmallBody>Mis à jour le 29/01/2021</SmallBody>
		</Trans>
	)
}
