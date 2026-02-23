import { Trans, useTranslation } from 'react-i18next'
import { css, styled } from 'styled-components'

import { ConseillersEntreprisesButton } from '@/components/ConseillersEntreprisesButton'
import RuleLink from '@/components/RuleLink'
import { Body, H2, Li, Link, Strong, Ul } from '@/design-system'

import urlIllustrationNetBrutEn from '../images/illustration-net-brut-en.png'
import urlIllustrationNetBrut from '../images/illustration-net-brut.png'

export const SeoExplanations = () => {
	const { t, i18n } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.salarié.seo">
			<section>
				<H2>Comment calculer le salaire net ?</H2>
				<Body>
					Lors de l'entretien d'embauche l'employeur propose en général une
					rémunération exprimée en « brut ». Le montant annoncé inclut ainsi les
					cotisations salariales, qui servent à financer la protection sociale
					du salarié et qui sont retranchées du salaire « net » perçu par le
					salarié.
				</Body>
				<Body>
					Vous pouvez utiliser notre simulateur pour convertir le{' '}
					<strong>salaire brut en net</strong> : il vous suffit pour cela saisir
					la rémunération annoncée dans la case salaire brut. La simulation
					peut-être affinée en répondant aux différentes questions (CDD, statut
					cadre, heures supplémentaires, temps partiel, titre-restaurants,
					etc.).
				</Body>
				<StyledImage
					src={
						i18n.language === 'fr'
							? urlIllustrationNetBrut
							: urlIllustrationNetBrutEn
					}
					alt={t(
						'pages.simulateurs.salarié.alt-image1',
						'Salaire net (perçu par le salarié) est égal à Salaire brut (inscrit dans le contrat de travail) moins cotisations salariales (retraite, csg, etc)'
					)}
				/>
				<Body>
					Par ailleurs depuis 2019, l'
					<RuleLink dottedName="impôt">impôt sur le revenu</RuleLink> est
					prélevé à la source. Pour ce faire, la direction générale des finances
					publiques (DGFiP) transmet à l'employeur le taux d'imposition calculé
					à partir de la déclaration de revenus du salarié. Si ce taux est
					inconnu, par exemple lors d'une première année d'activité, l'employeur
					utilise le{' '}
					<RuleLink dottedName="impôt . taux neutre d'impôt sur le revenu">
						taux neutre
					</RuleLink>
					.
				</Body>
			</section>

			<section>
				<H2>Comment calculer le coût d'embauche ?</H2>
				<Body>
					Si vous cherchez à embaucher, vous pouvez calculer le coût total de la
					rémunération de votre salarié, ainsi que les montants de cotisations
					patronales et salariales correspondant. Cela vous permet de définir le
					niveau de rémunération en connaissant le montant global de charge que
					cela représente pour votre entreprise.
				</Body>
				<Body>
					En plus du salaire, notre simulateur prend en compte le calcul des
					avantages en nature (téléphone, véhicule de fonction, etc.), ainsi que
					la mutuelle santé obligatoire.
				</Body>
				<Body>
					Il existe des{' '}
					<RuleLink
						aria-label={t(
							'aides différées, voir le détail du calcul pour aides différées'
						)}
						dottedName="salarié . coût total employeur . aides"
					>
						aides différées
					</RuleLink>{' '}
					à l'embauche qui ne sont pas toutes prises en compte par notre
					simulateur, vous pouvez les retrouver sur{' '}
					<Link
						href="http://www.aides-entreprises.fr"
						aria-label={t(
							'le portail officiel, accéder à aides-entreprises.fr, nouvelle fenêtre'
						)}
					>
						le portail officiel
					</Link>
					.
				</Body>
			</section>

			<section className="print-hidden">
				<H2>Échanger avec un conseiller pour votre projet de recrutement</H2>

				<Body>Vous souhaitez :</Body>
				<Ul>
					<Li>
						Être conseillé(e) sur les aides à l'embauche mobilisables pour votre
						recrutement
					</Li>
					<Li>
						Vous informer sur l'apprentissage, le contrat de
						professionnalisation, les emplois francs en quartiers prioritaires,
						le <abbr title="Volontariat Territorial en Entreprise">VTE</abbr>
						...
					</Li>
					<Li>Trouver des candidats</Li>
					<Li>Recruter une personne en situation de handicap</Li>
				</Ul>
				<Body>
					<Strong>
						Service public simple et rapide : vous êtes rappelé(e) par le
						conseiller qui peut vous aider.
					</Strong>
				</Body>
				<Body>
					Partenaires mobilisés : France Travail, Apec, Cap Emploi, missions
					locales...
				</Body>
				<ConseillersEntreprisesButton variant="recrutement" />
			</section>
		</Trans>
	)
}

const StyledImage = styled.img`
	width: 100%;
	${({ theme }) =>
		theme.darkMode &&
		css`
			filter: invert() brightness(150%);
		`}
`
