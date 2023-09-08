import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H1, H2, H3, H4, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import { TrackPage } from '../components/ATInternetTracking'
import Meta from '../components/utils/Meta'

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
				est en conformité partielle avec le{' '}
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
			<Body>L’audit de conformité réalisé par URBILOG révèle que :</Body>
			<Ul>
				<Li>79% des critères du RGAA version 4.1 sont respectés.</Li>
				<Li>Le taux moyen de conformité du service en ligne est de 93%.</Li>
			</Ul>
			<Body>
				Nombre de critères applicables : 63 ; Nombre de critères conformes : 50
				; Nombre de critères non conformes : 13
			</Body>
			<H3>Contenus non accessibles</H3>
			<Body>
				Les contenus listés ci-dessous ne sont pas accessibles pour les raisons
				suivantes :
			</Body>
			<H4>Non conformité</H4>
			<H5>1. Images</H5>
			<Body>
				Chaque image de décoration est-elle correctement ignorée par les
				technologies d’assistance ?
			</Body>
			<H5>2. Cadres</H5>
			<Body>Néant</Body>
			<H5>3. Couleurs</H5>
			<Ul>
				<Li>
					Dans chaque page web, l’information ne doit pas être donnée uniquement
					par la couleur. Cette règle est-elle respectée ?{' '}
				</Li>
				<Li>
					Dans chaque page web, les couleurs utilisées dans les composants
					d’interface ou les éléments graphiques porteurs d’informations
					sont-elles suffisamment contrastées (hors cas particuliers) ?
				</Li>
			</Ul>
			<H5>4. Multimédia</H5>
			<Body>Néant</Body>
			<H5>5. Tableaux</H5>
			<Body>
				Pour chaque tableau de données, chaque en-tête de colonne et chaque
				en-tête de ligne sont-ils correctement déclarés ?
			</Body>
			<H5>6. Liens</H5>
			<Body>Chaque lien est-il explicite (hors cas particuliers) ?</Body>
			<H5>7. Scripts</H5>
			<Ul>
				<Li>
					Chaque script est-il, si nécessaire, compatible avec les technologies
					d’assistance ?
				</Li>
				<Li>
					Chaque script est-il contrôlable par le clavier et par tout dispositif
					de pointage (hors cas particuliers) ?
				</Li>
				<Li>
					Pour chaque script qui initie un changement de contexte, l’utilisateur
					est-il averti ou en a-t-il le contrôle ?
				</Li>
			</Ul>
			<H5>8. Éléments obligatoires</H5>
			<Body>Néant</Body>
			<H5>9. Structuration de l'information</H5>
			<Body>
				Dans chaque page web, chaque liste est-elle correctement structurée ?
			</Body>
			<H5>10. Présentation de l'information</H5>
			<Body>
				Dans chaque page web, l’information reste-t-elle compréhensible lorsque
				les feuilles de styles sont désactivées ?
			</Body>
			<H5>11. Formulaires</H5>
			<Ul>
				<Li>
					Dans chaque formulaire, chaque regroupement de champs de même nature
					a-t-il une légende ?
				</Li>
				<Li>
					Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent
					(hors cas particuliers) ?
				</Li>
			</Ul>
			<H5>12. Navigation</H5>
			<Body>Néant</Body>
			<H5>13. Consultation</H5>
			<Body>
				Dans chaque page web, chaque document bureautique en téléchargement
				possède-t-il, si nécessaire, une version accessible (hors cas
				particuliers) ?
			</Body>
			<H4>Dérogation pour charge disproportionnée</H4> <Body>Néant</Body>
			<H4>Contenus non-soumis à l'obligation d'accessibilité</H4>
			<Body>Néant</Body>
			<H3>Établissement de cette déclaration d'accessibilité</H3>{' '}
			<Body>
				Cette déclaration d'accessibilité a été établie le 11 mai 2023.
			</Body>
			<H4>Technologies utilisées pour la réalisation du site</H4>
			<Ul>
				<Li> HTML 5</Li>
				<Li> CSS</Li>
				<Li> JavaScript </Li>
				<Li> SVG </Li>
				<Li> Aria </Li>
			</Ul>
			<H4>Environnement de test</H4>
			<Body>
				Les vérifications de restitution de contenus ont été réalisées sur la
				base de la combinaison fournie par la base de référence du RGAA 4.1,
				avec les versions suivantes :{' '}
			</Body>
			<Ul>
				<Li> NVDA 2022.4 et Firefox 110 </Li>
				<Li> VoiceOver Mac OS 13.2 et Safari : 16.3</Li>
			</Ul>
			<H4>Outils pour évaluer l'accessibilité</H4>
			<Ul>
				<Li>
					Barre extension de contrôle de taux de contraste{' '}
					<span lang="en">WCAG Color Contrast Checker</span>
				</Li>
				<Li> Barre extension Assistant RGAA V4.1 Compéthance</Li>
				<Li> Barre extension Web Developer toolbar</Li>
				<Li> Inspecteur du navigateur</Li>
				<Li> UserCSS/Stylus</Li>
			</Ul>
			<H4>Pages du site ayant fait l'objet de la vérification de conformité</H4>
			<Ul>
				<Li>
					<Link href="/">Accueil</Link>
				</Li>
				<Li>
					<Link href="/accessibilit%C3%A9">Accessibilité</Link>
				</Li>
				<Li>
					<Link href="/plan-de-site">Plan de site</Link>
				</Li>
				<Li>
					<Link href="/stats">Statistiques</Link>
				</Li>
				<Li>
					<Link href="/documentation">Documentation</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er">Créer une entreprise</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er/statut-juridique/nombre-associ%C3%A9s">
						Nombre d'associés
					</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er/statut-juridique/responsabilit%C3%A9">
						Responsabilité
					</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er/statut-juridique/auto-entrepreneur-ou-entreprise-individuelle">
						Choix du statut juridique
					</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er/statut-juridique/liste">
						Liste des statuts juridiques
					</Link>
				</Li>
				<Li>
					<Link href="/cr%C3%A9er/apr%C3%A8s-la-cr%C3%A9ation">
						Après la création
					</Link>
				</Li>
				<Li>
					<Link href="/simulateurs">Simulateurs</Link>
				</Li>
				<Li>
					<Link href="/simulateurs/salaire-brut-net">
						Simulateur de revenus pour salarié
					</Link>
				</Li>
				<Li>
					<Link href="/g%C3%A9rer/declaration-charges-sociales-independant">
						Assistant à la détermination des charges sociales déductibles
					</Link>
				</Li>
				<Li>
					<Link href="/simulateurs/profession-liberale">
						Simulateur de revenus pour profession libérale
					</Link>
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
			<SmallBody>Mis à jour le 11 mai 2023</SmallBody>
		</Trans>
	)
}

const StyledLink = styled(Link)`
	word-break: break-all;
`
