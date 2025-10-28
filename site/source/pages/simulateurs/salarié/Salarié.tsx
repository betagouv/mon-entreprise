import { ASTNode, reduceAST } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { css, styled } from 'styled-components'

import { ConseillersEntreprisesButton } from '@/components/ConseillersEntreprisesButton'
import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation'
import { FadeIn, FromTop } from '@/components/ui/animate'
import BrowserOnly from '@/components/utils/BrowserOnly'
import {
	Body,
	Emoji,
	H2,
	Li,
	Link,
	Message,
	SmallBody,
	Strong,
	Ul,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { useSitePaths } from '@/sitePaths'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

import urlIllustrationNetBrutEn from './illustration-net-brut-en.png'
import urlIllustrationNetBrut from './illustration-net-brut.png'

export default function SalariéSimulation() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation
				explanations={<SalaryExplanation />}
				customEndMessages={
					<>
						<Trans i18nKey="simulation-end.hiring.text">
							Vous pouvez maintenant concrétiser votre projet d'embauche.
						</Trans>
					</>
				}
				afterQuestionsSlot={
					<BrowserOnly>
						{/** L'équipe Code Du Travail Numérique ne souhaite pas référencer
						 * le simulateur dirigeant de SASU sur son site. */}
						{!import.meta.env.SSR &&
							!document.referrer?.includes('code.travail.gouv.fr') && (
								<WhenNotAlreadyDefined dottedName="entreprise . catégorie juridique">
									<FadeIn>
										<Message
											border={false}
											mini
											icon={<Emoji emoji="👨‍✈️" />}
											className="print-hidden"
										>
											<SmallBody>
												<Trans i18nKey="pages.simulateurs.salarié.SASU">
													Vous êtes dirigeant d'une SAS(U) ?{' '}
													<Link to={absoluteSitePaths.simulateurs.sasu}>
														Accédez au simulateur de revenu dédié
													</Link>
												</Trans>
											</SmallBody>
										</Message>
									</FadeIn>
								</WhenNotAlreadyDefined>
							)}
					</BrowserOnly>
				}
			>
				<SimulateurWarning
					simulateur="salarié"
					informationsComplémentaires={
						<>
							<Body>
								<Trans i18nKey="pages.simulateurs.salarié.warning.réformes">
									Le simulateur intègre les{' '}
									<Strong>mises à jour de 2026</Strong>, y compris la réduction
									générale dégressive unique (RGDU).
								</Trans>
							</Body>
							<Body>
								<Trans i18nKey="pages.simulateurs.salarié.warning.général">
									Le simulateur ne prend pour l’instant pas en compte les
									accords et conventions collectives, ni la myriade d’aides aux
									entreprises. Trouvez votre convention collective{' '}
									<Link
										href="https://code.travail.gouv.fr/outils/convention-collective#entreprise"
										aria-label="ici, trouvez votre convention collective sur code.travail.gouv.fr, nouvelle fenêtre"
									>
										ici
									</Link>
									, et explorez les aides sur&nbsp;
									<Link
										href="https://www.aides-entreprises.fr"
										aria-label="aides-entreprises.fr, nouvelle fenêtre"
									>
										aides-entreprises.fr
									</Link>
									.
								</Trans>
							</Body>
						</>
					}
				/>
				<SalariéSimulationGoals />
			</Simulation>
		</>
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

function SalariéSimulationGoals() {
	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal dottedName="salarié . coût total employeur" />
			<AidesGlimpse />

			<SimulationGoal dottedName="salarié . contrat . salaire brut" />
			<SimulationGoal
				small
				dottedName="salarié . contrat . salaire brut . équivalent temps plein"
			/>
			<SimulationGoal dottedName="salarié . rémunération . net . à payer avant impôt" />
			<TitreRestaurant />
			<SimulationGoal dottedName="salarié . rémunération . net . payé après impôt" />
		</SimulationGoals>
	)
}

function TitreRestaurant() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName =
		'salarié . rémunération . frais professionnels . titres-restaurant . montant'

	return (
		<Condition expression={`${dottedName} > 0`}>
			<FromTop>
				<StyledInfo>
					<RuleLink dottedName={dottedName}>
						+{' '}
						<Value
							expression={dottedName}
							displayedUnit="€"
							unit={targetUnit}
							linkToRule={false}
						/>{' '}
						<Trans>en titres-restaurant</Trans> <Emoji emoji=" 🍽" />
					</RuleLink>
				</StyledInfo>
			</FromTop>
		</Condition>
	)
}

function AidesGlimpse() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName = 'salarié . coût total employeur . aides' as DottedName
	const engine = useEngine()
	const aides = engine.getRule(dottedName)
	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aideLink = reduceAST(
		(acc, node) => {
			if (node.sourceMap?.mecanismName === 'somme') {
				const aidesNotNul =
					(node.sourceMap?.args.valeur as ASTNode[])
						.map((n) => engine.evaluate(n))
						.filter(({ nodeValue }) => nodeValue !== false) ?? []
				if (aidesNotNul.length === 1 && 'dottedName' in aidesNotNul[0]) {
					return aidesNotNul[0].dottedName as DottedName
				} else {
					return acc
				}
			}
		},
		dottedName,
		aides
	)

	return (
		<Condition expression={`${dottedName} > 0`}>
			<FromTop>
				<StyledInfo>
					<RuleLink dottedName={aideLink}>
						<Trans>en incluant</Trans>{' '}
						<Value
							expression={dottedName}
							displayedUnit="€"
							unit={targetUnit}
							linkToRule={false}
						/>{' '}
						<Trans>d'aides</Trans>{' '}
						<Emoji emoji={aides.rawNode.icônes as string} />
					</RuleLink>
				</StyledInfo>
			</FromTop>
		</Condition>
	)
}

const StyledInfo = styled(SmallBody)`
	position: relative;
	text-align: right;
	margin-top: -1.5rem;
	margin-bottom: 1.5rem;
	right: 0;
	z-index: 3;
`
