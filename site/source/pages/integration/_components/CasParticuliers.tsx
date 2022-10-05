import RuleLink from '@/components/RuleLink'
import { Message } from '@/design-system'
import { Code, Strong } from '@/design-system/typography'
import { H2, H3, H4, H5 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'

export function CasParticuliers() {
	return (
		<Trans i18nKey="pages.développeur.components.CasParticuliers">
			<H2>En savoir plus sur...</H2>

			<section>
				<H3>
					Les <Code>MissingVariables</Code>
				</H3>
				<Body>
					En retour de votre appel à <Code>evaluate</Code>, vous obtiendrez un
					objet <Code>missingVariables</Code>. Ce dernier contient la liste de
					toutes les règles utilisées pour le calcul dont la valeur est absente
					dans la situation en entrée. C'est une{' '}
					<Strong>valeur par défaut</Strong> qui a été utilisée à la place.
				</Body>
				<Body>
					Pour personnaliser encore plus votre simulation, vous pouvez
					renseigner leur valeur.
				</Body>
				<Message icon>
					<Body>
						Le nombre qui leur est associé correspond à l'importance de la règle
						pour le calcul : plus il est élevé, plus la règle a été utilisée par
						d'autres règles lors du calcul.
					</Body>
				</Message>
			</section>

			<section>
				<H3>
					Les règles taguées comme <Code>experimentale</Code>
				</H3>
				<Body>
					Nos API suivent une{' '}
					<Link href="https://semver.org/lang/fr/">
						gestion sémantique de version
					</Link>
					. Cela veut dire que toutes les modifications apportées sont
					rétrocompatibles, sauf lors de changements de version majeure.
				</Body>
				<Body>
					Les règles taguées comme experimentales n'obéissent pas à cette
					spécification. Cela veut dire qu'elles peuvent être supprimées,
					modifiées, déplacées, de manière invisible pour l'utilisateur de
					l'API.
				</Body>
				<Body>
					<Strong>
						Nous vous conseillons donc d'être très prudent dans l'utilisation de
						ces règles, et de toujours bien vérifier leur existence avant de les
						inclure dans votre code applicatif.
					</Strong>
				</Body>

				<Message icon>
					<H5 as="h4">Comment savoir si une règle est expérimentale ?</H5>
					<Body>
						Vous pouvez savoir si vous utilisez une règle expérimentale en
						consultant l'objet <Code>warnings</Code> fourni en retour de votre
						appel à <Code>evaluate</Code>
					</Body>
					<Body>
						Les règles expérimentales contiennent également un avertissement
						dans la section « Réutiliser ce calcul » de la documentation.
					</Body>
				</Message>
			</section>

			<section>
				<H3>Réutiliser une donnée provenant d'API externes</H3>
				<Body>
					Certaines données des simulateurs de mon-entreprise proviennent d'API
					externes. Il vous faudra ainsi changer leur valeur par vous-même dans
					la situation donnée en entrée.
				</Body>
				<H4>Le versement mobilité</H4>
				<Body>
					<Code>
						<RuleLink dottedName="établissement . versement mobilité">
							établissement . versement mobilité
						</RuleLink>
					</Code>
				</Body>
				<Body>
					Dans le simulateur{' '}
					<Link to={useSitePaths().absoluteSitePaths.simulateurs.salarié}>
						salarié
					</Link>
					, il suffit de renseigner la commune et le taux du versement mobilité
					correspondant est automatiquement déterminé.
				</Body>
				<Body>
					Il vous faudra préciser le taux vous-même pour refaire le calcul. Vous
					pouvez le retrouver :
					<Ul>
						<Li>
							En saisissant votre commune dans un simulateur, puis en
							recherchant la règle « versement mobilité » avec le bouton «
							rechercher » en haut à droite
						</Li>
						<Li>
							Grâce au{' '}
							<Link href="https://www.urssaf.fr/portail/home/taux-et-baremes/versement-mobilite.html">
								service dédié sur urssaf.fr
							</Link>
						</Li>
					</Ul>
				</Body>
				<H4>Le taux collectif AT/MP</H4>
				<Body>
					<Code>
						<RuleLink dottedName="établissement . taux ATMP . taux collectif">
							établissement . taux ATMP . taux collectif
						</RuleLink>
					</Code>
				</Body>
				<Body>
					Ce taux collectif doit être retrouvé manuellement. Vous pouvez
					utiliser :
					<Ul>
						<Li>
							<Link href="https://github.com/betagouv/taux-collectifs-cotisation-atmp">
								Un export csv
							</Link>{' '}
							du tableau des taux nets collectifs paru au Journal Officiel
						</Li>
						<Li>
							Le service{' '}
							<Link href="https://www.net-entreprises.fr/declaration/compte-atmp/">
								Compte AT/MP
							</Link>{' '}
							de net-entreprise
						</Li>
					</Ul>
				</Body>
			</section>
		</Trans>
	)
}
