import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { typography } from '@/design-system'

import Meta from '../components/utils/Meta'

const { H1, Body, H2, H3, H4, Li, Link, SmallBody, Ul } = typography

export default function Accessibilité() {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.accessibilité">
			<H1>Accessibilité</H1>
			<Meta
				title={t('accessibility.title', 'Accessibilité')}
				description={t(
					'accessibility.description',
					'Référentiel Général d’Amélioration de l’Accessibilité'
				)}
			/>
			<TrackPage chapter1="informations" name="accessibilite" />
			<Body>
				Cette page n'est pas une page d'aide, mais une déclaration de conformité
				au{' '}
				<abbr
					title={t(
						'accessibility.description',
						'Référentiel Général d’Amélioration de l’Accessibilité'
					)}
				>
					RGAA
				</abbr>{' '}
				4.1&nbsp;qui vise à définir le niveau d'accessibilité général constaté
				sur le site conformément à la réglementation. Cette page est obligatoire
				pour être conforme au RGAA 4.1.
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
				L'Acoss s’engage à rendre ses sites internet, extranet, intranet
				accessibles conformément à l’article 47 de la loi n° 2005-102 du 11
				février 2005.
			</Body>
			<Body>
				À cette fin, elle rédige{' '}
				<Link
					href="https://www.urssaf.org/files/RGAA/accessibilite_numerique-schema_pluriannuel-Acoss.pdf"
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
				<Link href="/">https://mon-entreprise.urssaf.fr</Link>.
			</Body>
			<H3>État de conformité</H3>
			<Body>
				Mon-entreprise - <Link href="/">https://mon-entreprise.urssaf.fr/</Link>{' '}
				est partiellement conforme avec le{' '}
				<Link
					href="https://accessibilite.numerique.gouv.fr"
					aria-label="Référentiel général d’amélioration
				de l’accessibilité, nouvelle fenêtre"
				>
					référentiel général d’amélioration de l’accessibilité (RGAA)
				</Link>
				, version 4.1 en raison des non-conformités et des dérogations énumérées
				ci-dessous.
			</Body>
			<H3>Résultats des tests</H3>
			<Body>
				L’audit de conformité réalisé par la société{' '}
				<Link href="https://boscop.fr/" aria-label="Boscop, nouvelle fenêtre">
					boscop
				</Link>{' '}
				révèle que :
			</Body>
			<Ul>
				<Li>93,65% des critères RGAA sont respectés.</Li>
				<Li>Le taux moyen de conformité du site s’élève à 98%.</Li>
				<Li>
					La page "Simulateur de revenus pour salarié" a un taux de conformité
					de 100%.
				</Li>
			</Ul>
			<Body>
				Nombre de critères applicables : 63 ; Nombre de critères conformes : 59
				; Nombre de critères non conformes : 4
			</Body>
			<H3>Contenus non accessibles</H3>
			<Body>
				Liste des critères non conformes :
				<Ul>
					<Li>Certains liens ne sont pas explicites.</Li>
					<Li>Certains scripts ne sont pas compatibles avec les technologies d’assistance.</Li>
					<Li>
						Pour certains scripts qui initient un changement de contexte,
						l’utilisateur n’est pas averti ou en n’a pas le contrôle.
					</Li>
					<Li>
						Pour certains formulaires, certaines légendes associées à un
						regroupement de champs de même nature ne sont pas pertinentes.
					</Li>
				</Ul>
			</Body>
			<H3>Dérogation pour charge disproportionnée</H3>
			<Body>Néant</Body>
			<H3>Contenus non-soumis à l'obligation d'accessibilité</H3>
			<Body>Néant</Body>
			<H3>Établissement de cette déclaration d'accessibilité</H3>{' '}
			<Body>
				Cette déclaration d'accessibilité a été établie le 15 mai 2025.
			</Body>
			<H4>Technologies utilisées pour la réalisation du site</H4>
			<Ul>
				<Li>HTML 5</Li>
				<Li>CSS</Li>
				<Li>JavaScript</Li>
				<Li>SVG</Li>
				<Li>Aria</Li>
			</Ul>
			<H4>Environnement de test</H4>
			<Body>
				Les vérifications de restitution de contenus ont été réalisées sur la
				base de la combinaison fournie par la base de référence du RGAA 4.1,
				avec les versions suivantes :{' '}
			</Body>
			<Ul>
				<Li>NVDA et Firefox</Li>
				<Li>Jaws et Firefox</Li>
				<Li>Voiceover et Safari</Li>
			</Ul>
			<H4>Les outils utilisés lors de l’évaluation</H4>
			<Ul>
				<Li>
					<span lang="en">Colour Contrast Analyser</span> ;
				</Li>
				<Li>
					Extension « <span lang="en">Web Developer</span> » ;
				</Li>
				<Li>Extension « Assistant RGAA » ;</Li>
				<Li>
					Extension « <span lang="en">WCAG Contrast checker</span> » ;
				</Li>
				<Li>
					Extension « <span lang="en">ARC Toolkit</span> » ;
				</Li>
				<Li>
					Extension « <span lang="en">HeadingsMap</span> » ;
				</Li>
				<Li>Outils pour développeurs intégrés au navigateur Firefox ;</Li>
				<Li>Validateur HTML du W3C.</Li>
			</Ul>
			<H4>Pages du site ayant fait l'objet de la vérification de conformité</H4>
			<Ul>
				<Li>
					<Link href="/">Page d'accueil</Link>{' '}
				</Li>
				<Li>Page accessibilité</Li>
				<Li>
					<Link href="/plan-de-site">Page plan du site</Link>
				</Li>
				<Li>
					<Link href="/statistiques">Page statistique</Link>{' '}
				</Li>
				<Li>
					<Link href="/documentation">Page "Documentation"</Link>
				</Li>
				<Li>
					<Link href="/simulateurs-et-assistants">Page "Simulateurs"</Link>
				</Li>
				<Li>
					<Link href="/simulateurs/salaire-brut-net">
						Page "Simulateur de revenus pour salarié"
					</Link>
				</Li>
				<Li>
					<Link href="/assistants/declaration-charges-sociales-independant">
						Page "Assistant à la détermination des charges sociales déductibles"
					</Link>
				</Li>
				<Li>
					<Link href="/simulateurs/auto-entrepreneur">
						Page "Simulateur de revenus auto-entrepreneur"
					</Link>
				</Li>
				<Li>
					<Link href="/assistants/choix-du-statut">Page "Choix du statut"</Link>
				</Li>
				<Li>
					<Link href="/nouveaut%C3%A9s/f%C3%A9vrier-2025">
						Page "Les nouveautés"
					</Link>
				</Li>
				<Li>
					<Link href="/d%C3%A9veloppeur">
						Page "Outils pour les développeurs"
					</Link>
				</Li>
				<Li>
					<Link href="/d%C3%A9veloppeur/biblioth%C3%A8que-de-calcul">
						Page "Bibliothèque de calcul"
					</Link>
				</Li>
				<Li>
					<Link href="/budget">Page "Budget"</Link>{' '}
				</Li>
			</Ul>
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
			<H3>Voies de recours</H3>
			<Body>Cette procédure est à utiliser dans le cas suivant.</Body>
			<Body>
				Vous avez signalé au responsable du site internet un défaut
				d’accessibilité qui vous empêche d’accéder à un contenu ou à un des
				services du portail et vous n’avez pas obtenu de réponse satisfaisante.
			</Body>
			<Ul>
				<Li>
					Écrire un message au Défenseur des droits (
					<StyledLink
						href="https://formulaire.defenseurdesdroits.fr/"
						target="_blank"
						rel="noreferrer"
						aria-label="https://formulaire.defenseurdesdroits.fr/, nouvelle fenêtre"
					>
						https://formulaire.defenseurdesdroits.fr/
					</StyledLink>
					)
				</Li>
				<Li>
					Contacter le délégué du Défenseur des droits dans votre région (
					<StyledLink
						href="https://www.defenseurdesdroits.fr/saisir/delegues"
						target="_blank"
						rel="noreferrer"
						aria-label="https://www.defenseurdesdroits.fr/saisir/delegues, nouvelle fenêtre"
					>
						https://www.defenseurdesdroits.fr/saisir/delegues
					</StyledLink>
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
				<Li>
					Contacter le D&eacute;fenseur des droits par
					t&eacute;l&eacute;phone&nbsp;:{' '}
					<Link href="tel:+33969390000">
						+33&nbsp;9&nbsp;69&nbsp;39&nbsp;00&nbsp;00
					</Link>
				</Li>
			</Ul>
			<SmallBody>Mis à jour le 27 mai 2025</SmallBody>
		</Trans>
	)
}

const StyledLink = styled(Link)`
	word-break: break-all;
`
