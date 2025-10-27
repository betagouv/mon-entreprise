import { Trans, useTranslation } from 'react-i18next'

import { ConseillersEntreprisesButton } from '@/components/ConseillersEntreprisesButton'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { Body, Emoji, H2, Li, Link, Strong, Ul } from '@/design-system'

export const SeoExplanations = () => {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.activité-partielle.seo">
			<H2>Comment calculer l’indemnité d’activité partielle légale&nbsp;?</H2>
			<Body>
				L’indemnité d’activité partielle de base est fixée par la loi à{' '}
				<Strong>
					<Value
						linkToRule={false}
						expression={
							'salarié . activité partielle . indemnités . légale . taux'
						}
					/>{' '}
					du brut
				</Strong>
				. Elle est proratisée en fonction du nombre d’heures chômées. Pour un
				salarié à 2&nbsp;300&nbsp;€ brut mensuel, qui travaille à 50&nbsp;% de
				son temps usuel, cela donne{' '}
				<Strong>2&nbsp;300&nbsp;€ × 50&nbsp;% × 60&nbsp;% = 805&nbsp;€</Strong>
			</Body>
			<Body>
				A cette indemnité de base s’ajoute l’indemnité complémentaire pour les
				salaires proches du SMIC. Ce complément intervient lorsque le cumul de
				la rémunération et de l’indemnité de base est en dessous d’un SMIC net.
				Ces indemnités sont prises en charge par l’employeur, qui sera ensuite
				remboursé en parti ou en totalité par l’État.
			</Body>
			<Body>
				<Emoji emoji="👉" />{' '}
				<RuleLink dottedName="salarié . activité partielle . indemnités">
					Voir le détail du calcul de l’indemnité
				</RuleLink>
			</Body>
			<H2>Comment calculer la part remboursée par l’État&nbsp;?</H2>
			<Body>
				L’État prend en charge une partie de l’indemnité partielle pour les
				salaires allant jusqu’à <Strong>4,5 SMIC</Strong>, avec un minimum à{' '}
				<Strong>
					<Value
						linkToRule={false}
						expression={
							'salarié . activité partielle . indemnisation entreprise . plancher horaire * 1 heure'
						}
					/>
				</Strong>{' '}
				par heures chômée.
			</Body>
			<Body>
				<Emoji emoji="👉" />{' '}
				<RuleLink dottedName="salarié . activité partielle . indemnisation entreprise">
					Voir le détail du calcul du remboursement de l’indemnité
				</RuleLink>
			</Body>
			<H2>Échanger avec un conseiller sur l’activité partielle</H2>
			<Body as="div">
				Vous souhaitez&nbsp;:
				<Ul>
					<Li>vérifier l’allocation perçue, le reste à charge</Li>
					<Li>
						connaître la procédure de consultation du{' '}
						<abbr title="Comité social et économique">CSE</abbr>, la demande
						d’autorisation préalable
					</Li>
					<Li>vous informer sur l’activité partielle longue durée</Li>
					<Li>
						former vos salariés en activité partielle à de nouvelles compétences
						(coûts pédagogique pris en charge)
					</Li>
				</Ul>
				<Body>
					Service public simple et rapide&nbsp;: le conseiller qui peut vous
					aider vous rappelle. Partenaires mobilisés&nbsp;: les directions
					départementales de l’emploi, du travail et des solidarités.
				</Body>
				<ConseillersEntreprisesButton variant="activite_partielle" />
			</Body>

			<H2>
				Quelles sont les cotisations sociales à payer pour l’indemnité
				d’activité partielle&nbsp;?
			</H2>
			<Body>
				L’indemnité d’activité partielle est soumise à la CSG-CRDS et à une
				contribution maladie dans certains cas. Pour en savoir plus, voir la
				page explicative sur{' '}
				<Link
					aria-label={t(
						'pages.simulateurs.activité-partielle.aria-label-urssaf',
						"le site de l'Urssaf, accéder au site de l'Urssaf, nouvelle fenêtre"
					)}
					href="https://www.urssaf.fr/accueil/employeur/reduire-cesser-activite/activite-partielle.html"
				>
					le site de l’Urssaf
				</Link>
				.
			</Body>
		</Trans>
	)
}
