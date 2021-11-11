import {
	defineDirectorStatus,
	isAutoentrepreneur,
	useDispatchAndGoToNextQuestion,
} from 'Actions/companyStatusActions'
import classnames from 'classnames'
import Conversation from 'Components/conversation/Conversation'
import Value from 'Components/EngineValue'
import InfoBulle from 'Components/ui/InfoBulle'
import AnswerGroup from 'DesignSystem/answer-group'
import { Button } from 'DesignSystem/buttons'
import { H2, H3 } from 'DesignSystem/typography/heading'
import revenusSVG from 'Images/revenus.svg'
import { useCallback, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import dirigeantComparaison from '../pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import SeeAnswersButton from './conversation/SeeAnswersButton'
import PeriodSwitch from './PeriodSwitch'
import './SchemeComparaison.css'
import { SimulationGoal, SimulationGoals } from './SimulationGoals'
import { FromBottom } from './ui/animate'
import Emoji from './utils/Emoji'
import { useEngine } from './utils/EngineContext'
import useSimulationConfig from './utils/useSimulationConfig'

type SchemeComparaisonProps = {
	hideAutoEntrepreneur?: boolean
	hideAssimiléSalarié?: boolean
}

export default function SchemeComparaison({
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false,
}: SchemeComparaisonProps) {
	useSimulationConfig(dirigeantComparaison)
	const dispatch = useDispatchAndGoToNextQuestion()
	const engine = useEngine()

	const [showMore, setShowMore] = useState(false)
	const [conversationStarted, setConversationStarted] = useState(
		!!Object.keys(useSelector(situationSelector)).length
	)
	const startConversation = useCallback(
		() => setConversationStarted(true),
		[setConversationStarted]
	)

	const situation = useSelector(situationSelector)
	const displayResult =
		useSelector(situationSelector)['dirigeant . rémunération . totale'] !=
		undefined
	const assimiléEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				dirigeant: "'assimilé salarié'",
			}),
		[situation]
	)
	const autoEntrepreneurEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				dirigeant: "'auto-entrepreneur'",
			}),
		[situation]
	)
	const indépendantEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				dirigeant: "'indépendant'",
			}),
		[situation]
	)
	const plafondAutoEntrepreneurDépassé =
		autoEntrepreneurEngine.evaluate(
			"entreprise . chiffre d'affaires . seuil micro dépassé"
		).nodeValue === true

	return (
		<>
			<div
				className={classnames('comparaison-grid', {
					hideAutoEntrepreneur,
					hideAssimiléSalarié,
				})}
			>
				<H2 className="AS">
					<Emoji emoji="☂" /> <Trans>Assimilé salarié</Trans>
					<small>
						<Trans i18nKey="comparaisonRégimes.AS.tagline">
							Le régime tout compris
						</Trans>
					</small>
				</H2>
				<H2 className="indep">
					<Emoji emoji="👩‍🔧" />{' '}
					{hideAssimiléSalarié ? (
						<Trans>Entreprise Individuelle</Trans>
					) : (
						<Trans>Indépendant</Trans>
					)}
					<small>
						<Trans i18nKey="comparaisonRégimes.indep.tagline">
							La protection sociale à la carte
						</Trans>
					</small>
				</H2>
				<H2 className="auto">
					<Emoji emoji="🚶‍♂️" /> <Trans>Auto-entrepreneur</Trans>
					<small>
						<Trans i18nKey="comparaisonRégimes.auto.tagline">
							Pour commencer sans risques
						</Trans>
					</small>
				</H2>

				<H3 className="legend">
					<Trans i18nKey="comparaisonRégimes.status.legend">
						Statuts juridiques possibles
					</Trans>
				</H3>
				<div className="AS">
					<div>
						<Trans i18nKey="comparaisonRégimes.status.AS">
							SAS, SASU ou SARL avec gérant minoritaire
						</Trans>
					</div>
				</div>
				<div className="indep">
					<div>
						{hideAssimiléSalarié ? (
							<Trans i18nKey="comparaisonRégimes.status.indep.2">
								EI ou EIRL
							</Trans>
						) : (
							<Trans i18nKey="comparaisonRégimes.status.indep.1">
								EI, EIRL, EURL ou SARL avec gérant majoritaire
							</Trans>
						)}
					</div>
				</div>
				<div className="auto">
					<Trans i18nKey="comparaisonRégimes.status.auto">
						Auto-entreprise
					</Trans>
				</div>

				<Trans i18nKey="comparaisonRégimes.AT">
					<H3 className="legend">Couverture accidents du travail</H3>
				</Trans>
				<div className="AS">
					<Trans>
						<Trans>Oui</Trans>
					</Trans>
				</div>
				<div className="indep-et-auto">
					<Trans>Non</Trans>
				</div>
				<Trans i18nKey="comparaisonRégimes.assuranceMaladie">
					<H3 className="legend">
						Assurance maladie{' '}
						<small>(médicaments, soins, hospitalisations)</small>
					</H3>
					<div className="AS-indep-et-auto">Identique pour tous</div>
				</Trans>
				<Trans i18nKey="comparaisonRégimes.mutuelle">
					<H3 className="legend">
						Mutuelle santé
						<small />
					</H3>
					<div className="AS">Obligatoire</div>
					<div className="indep-et-auto">Fortement conseillée</div>
				</Trans>

				<Trans i18nKey="comparaisonRégimes.indemnités">
					<H3 className="legend">
						Indemnités journalières <small>(en cas d'arrêt maladie)</small>
					</H3>
				</Trans>
				<div className="green AS">++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>
				<Trans i18nKey="comparaisonRégimes.retraite">
					<H3 className="legend">Retraite</H3>
				</Trans>
				<div className="green AS">+++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>

				{showMore ? (
					<>
						<Trans i18nKey="comparaisonRégimes.ACRE">
							<H3 className="legend">ACRE</H3>
							<div className="AS-et-indep">
								1 an <small>(automatique et inconditionnelle)</small>
							</div>
							<div className="auto">
								Entre 3 et 4 trimestres{' '}
								<small>(sous conditions d'éligibilité)</small>
							</div>
						</Trans>
						<Trans i18nKey="comparaisonRégimes.déduction">
							<H3 className="legend">Déduction des charges</H3>
							<div className="AS-et-indep">
								Oui <small>(régime fiscal du réel)</small>
							</div>
							<div className="auto">
								Non
								<small>
									(mais abattement forfaitaire pour le calcul de l'impôt sur le
									revenu)
								</small>
							</div>
						</Trans>

						<Trans i18nKey="comparaisonRégimes.cotisations">
							<H3 className="legend">Paiement des cotisations</H3>
							<div className="AS">Mensuel</div>
							<div className="indep">
								Provision mensuelle ou trimestrielle
								<small>
									(avec régularisation après coup en fonction du revenu réel)
								</small>
							</div>
							<div className="auto">Mensuel ou trimestriel</div>
						</Trans>
						<Trans i18nKey="comparaisonRégimes.complémentaireDeductible">
							<H3 className="legend">
								Contrats prévoyance et retraite facultatives déductibles
							</H3>
							<div className="AS">
								Oui <small>(sous certaines conditions)</small>
							</div>
							<div className="indep">
								Oui <small>(Loi Madelin)</small>
							</div>
						</Trans>
						<div className="auto">
							<Trans>Non</Trans>
						</div>
						<Trans i18nKey="comparaisonRégimes.cotisationMinimale">
							<H3 className="legend">Paiement de cotisations minimales</H3>
						</Trans>
						<div className="AS">
							<Trans>Non</Trans>
						</div>
						<div className="indep">
							<Trans>Oui</Trans>
						</div>
						<div className="auto">
							<Trans>Non</Trans>
						</div>
						<Trans i18nKey="comparaisonRégimes.seuil">
							<H3 className="legend">
								Revenu minimum pour l'ouverture des droits aux prestations
							</H3>
							<div className="AS">Oui</div>
							<div className="indep">
								Non <small>(cotisations minimales obligatoires)</small>
							</div>
							<div className="auto">Oui</div>
						</Trans>
						{!hideAutoEntrepreneur && (
							<Trans i18nKey="comparaisonRégimes.plafondCA">
								<H3 className="legend">Plafond de chiffre d'affaires</H3>
								<div className="AS-et-indep">
									<Trans>Non</Trans>
								</div>
								<div className="auto">
									<Trans>Oui</Trans>
									<small>
										(72 600 € en services / 176 200 € en vente de biens,
										restauration ou hébergement)
									</small>
								</div>
							</Trans>
						)}
						<Trans i18nKey="comparaisonRégimes.comptabilité">
							<H3 className="legend">
								Gestion comptable, sociale, juridique...
							</H3>
							<div className="AS-et-indep">
								Accompagnement fortement conseillé
								<small>
									(expert comptable, comptable, centre de gestion agrée...)
								</small>
							</div>

							<div className="auto">
								Simplifiée{' '}
								<small>(peut être gérée par l'auto-entrepreneur)</small>
							</div>
						</Trans>
					</>
				) : (
					<Trans i18nKey="comparaisonRégimes.comparaisonDétaillée">
						<div className="all">
							<Button light size="XS" onPress={() => setShowMore(true)}>
								Afficher plus d'informations
							</Button>
						</div>
					</Trans>
				)}

				<div className=" all  colored">
					{!conversationStarted ? (
						<>
							<Trans i18nKey="comparaisonRégimes.simulationText">
								<H3>
									Comparer mes revenus, pension de retraite et indemnité maladie
								</H3>
								<img src={revenusSVG} css="height: 8rem" />
								<Button onPress={startConversation}>
									Lancer la simulation
								</Button>
							</Trans>
						</>
					) : (
						<div className="">
							<SimulationGoals
								toggles={<PeriodSwitch />}
								legend={
									'Estimations sur votre rémunération brute et vos charges'
								}
								css={
									displayResult
										? `
									border-bottom: none;
									border-bottom-left-radius: 0 !important;
									border-bottom-right-radius: 0 !important;
								`
										: ''
								}
							>
								<SimulationGoal dottedName="dirigeant . rémunération . totale" />
								<SimulationGoal dottedName="entreprise . charges" />
							</SimulationGoals>
							{displayResult && (
								<FromBottom>
									<div
										className="ui__ card "
										css={`
											padding: 1rem;
											border-top: none;
											border-top-left-radius: 0 !important;
											border-top-right-radius: 0 !important;
										`}
									>
										<Conversation
											customEndMessages={
												<>
													<p className="ui__ notice">
														Vous pouvez consulter les différentes estimations
														dans le tableau ci-dessous
													</p>

													<SeeAnswersButton />
												</>
											}
										/>
									</div>
								</FromBottom>
							)}
						</div>
					)}
				</div>
				{displayResult && (
					<>
						<Trans i18nKey="comparaisonRégimes.revenuNetAvantImpot">
							<H3 className="legend">
								Revenu net de cotisations <small>(avant impôts)</small>
							</H3>
						</Trans>
						<div className="AS">
							<Value
								linkToRule={false}
								engine={assimiléEngine}
								precision={0}
								unit="€/an"
								expression="dirigeant . rémunération . nette"
							/>
						</div>
						<div className="indep">
							<Value
								linkToRule={false}
								engine={indépendantEngine}
								precision={0}
								expression="dirigeant . rémunération . nette"
							/>
						</div>
						<div className="auto">
							<>
								{plafondAutoEntrepreneurDépassé && 'Plafond de CA dépassé'}
								<Value
									linkToRule={false}
									engine={autoEntrepreneurEngine}
									precision={0}
									className={''}
									unit="€/an"
									expression="dirigeant . rémunération . nette - entreprise . charges"
								/>
							</>
						</div>

						<H3 className="legend">
							<Trans i18nKey="comparaisonRégimes.retraiteEstimation.legend">
								<span>Pension de retraite</span>
								<small>(avant impôts)</small>
							</Trans>
						</H3>
						<div className="AS">
							<Value
								linkToRule={false}
								engine={assimiléEngine}
								precision={0}
								expression="protection sociale . retraite"
							/>{' '}
							<InfoBulle>
								<Trans i18nKey="comparaisonRégimes.retraiteEstimation.infobulles.AS">
									Pension calculée pour 172 trimestres cotisés au régime général
									sans variations de revenus.
								</Trans>
							</InfoBulle>
						</div>
						<div className="indep">
							<Value
								linkToRule={false}
								engine={indépendantEngine}
								precision={0}
								expression="protection sociale . retraite"
							/>{' '}
							<InfoBulle>
								<Trans i18nKey="comparaisonRégimes.retraiteEstimation.infobulles.indep">
									Pension calculée à titre indicatif pour 172 trimestres cotisés
									au régime des indépendants sans variations de revenus.
								</Trans>
							</InfoBulle>
						</div>
						<div className="auto">
							{plafondAutoEntrepreneurDépassé ? (
								'—'
							) : (
								<>
									<Value
										linkToRule={false}
										engine={autoEntrepreneurEngine}
										precision={0}
										expression="protection sociale . retraite"
									/>{' '}
									<InfoBulle>
										<Trans i18nKey="comparaisonRégimes.retraiteEstimation.infobulles.auto">
											Pension calculée pour 172 trimestres cotisés en
											auto-entrepreneur sans variations de revenus.
										</Trans>
									</InfoBulle>
								</>
							)}
						</div>
						<Trans i18nKey="comparaisonRégimes.trimestreValidés">
							<H3 className="legend">
								Nombre de trimestres validés <small>(pour la retraite)</small>
							</H3>
						</Trans>
						<div className="AS">
							<Value
								linkToRule={false}
								engine={assimiléEngine}
								precision={0}
								displayedUnit="trimestre"
								expression="protection sociale . retraite . trimestres validés"
							/>
						</div>
						<div className="indep">
							<Value
								linkToRule={false}
								engine={indépendantEngine}
								precision={0}
								expression="protection sociale . retraite . trimestres validés"
								displayedUnit="trimestre"
							/>
						</div>
						<div className="auto">
							{plafondAutoEntrepreneurDépassé ? (
								'—'
							) : (
								<Value
									linkToRule={false}
									engine={autoEntrepreneurEngine}
									precision={0}
									expression="protection sociale . retraite . trimestres validés"
									displayedUnit="trimestres"
								/>
							)}
						</div>
						<Trans i18nKey="comparaisonRégimes.indemnités">
							<H3 className="legend">
								Indemnités journalières <small>(en cas d'arrêt maladie)</small>
							</H3>
						</Trans>
						<div className="AS">
							<span>
								<Value
									linkToRule={false}
									engine={assimiléEngine}
									precision={0}
									expression="protection sociale . santé . indemnités journalières"
								/>
							</span>
							<small>
								(
								<Value
									linkToRule={false}
									engine={assimiléEngine}
									precision={0}
									expression="protection sociale . accidents du travail et maladies professionnelles"
								/>{' '}
								<Trans>
									pour les accidents de trajet/travail et maladie pro
								</Trans>
								)
							</small>
						</div>
						<div className="indep">
							<Value
								linkToRule={false}
								engine={indépendantEngine}
								precision={0}
								expression="protection sociale . santé . indemnités journalières"
							/>
						</div>
						<div className="auto">
							{plafondAutoEntrepreneurDépassé ? (
								'—'
							) : (
								<span>
									<Value
										linkToRule={false}
										engine={autoEntrepreneurEngine}
										precision={0}
										expression="protection sociale . santé . indemnités journalières"
									/>
								</span>
							)}
						</div>
					</>
				)}
			</div>

			<div className="">
				<br />
				<H3>
					<Trans i18nKey="comparaisonRégimes.titreSelection">
						Créer mon entreprise en tant que :
					</Trans>
				</H3>
				<AnswerGroup>
					{[
						!hideAssimiléSalarié && (
							<Button
								key="assimiléSalarié"
								onPress={() => {
									dispatch(defineDirectorStatus('SALARIED'))
									!hideAutoEntrepreneur && dispatch(isAutoentrepreneur(false))
								}}
							>
								<Trans i18nKey="comparaisonRégimes.choix.AS">
									Assimilé&nbsp;salarié
								</Trans>
							</Button>
						),

						<Button
							key="EI"
							onPress={() => {
								!hideAssimiléSalarié &&
									dispatch(defineDirectorStatus('SELF_EMPLOYED'))
								!hideAutoEntrepreneur && dispatch(isAutoentrepreneur(false))
							}}
						>
							{hideAssimiléSalarié ? (
								<Trans i18nKey="comparaisonRégimes.choix.EI">
									Entreprise individuelle
								</Trans>
							) : (
								<Trans i18nKey="comparaisonRégimes.choix.indep">
									Indépendant
								</Trans>
							)}
						</Button>,

						!hideAutoEntrepreneur && (
							<Button
								key="auto-entrepreneur"
								onPress={() => {
									!hideAssimiléSalarié &&
										dispatch(defineDirectorStatus('SELF_EMPLOYED'))
									dispatch(isAutoentrepreneur(true))
								}}
							>
								<Trans i18nKey="comparaisonRégimes.choix.auto">
									Auto-entrepreneur
								</Trans>
							</Button>
						),
					]}
				</AnswerGroup>
			</div>
		</>
	)
}
