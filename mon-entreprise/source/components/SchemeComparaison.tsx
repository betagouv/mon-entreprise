import { setSimulationConfig } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur,
} from 'Actions/companyStatusActions'
import classnames from 'classnames'
import Conversation from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import Value from 'Components/EngineValue'
import dirigeantComparaison from '../sites/mon-entreprise.fr/pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import Engine from 'publicodes'
import revenusSVG from 'Images/revenus.svg'
import { useCallback, useMemo, useState, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import InfoBulle from 'Components/ui/InfoBulle'
import './SchemeComparaison.css'
import { useEngine } from './utils/EngineContext'
import { DottedName } from 'modele-social'

type SchemeComparaisonProps = {
	hideAutoEntrepreneur?: boolean
	hideAssimiléSalarié?: boolean
}

export default function SchemeComparaison({
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false,
}: SchemeComparaisonProps) {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(dirigeantComparaison))
	}, [])
	const engine = useEngine()
	const plafondAutoEntrepreneurDépassé =
		engine.evaluate(
			'dirigeant . auto-entrepreneur . contrôle seuil de CA dépassé'
		).nodeValue === true

	const [showMore, setShowMore] = useState(false)
	const [conversationStarted, setConversationStarted] = useState(
		!!Object.keys(useSelector(situationSelector)).length
	)
	const startConversation = useCallback(() => setConversationStarted(true), [
		setConversationStarted,
	])

	const parsedRules = engine.getParsedRules()
	const situation = useSelector(situationSelector)
	const displayResult =
		useSelector(situationSelector)['entreprise . charges'] != undefined
	const assimiléEngine = useMemo(
		() =>
			new Engine<DottedName>(parsedRules).setSituation({
				...situation,
				dirigeant: "'assimilé salarié'",
			}),
		[situation]
	)
	const autoEntrepreneurEngine = useMemo(
		() =>
			new Engine<DottedName>(parsedRules).setSituation({
				...situation,
				dirigeant: "'auto-entrepreneur'",
			}),
		[situation]
	)
	const indépendantEngine = useMemo(
		() =>
			new Engine<DottedName>(parsedRules).setSituation({
				...situation,
				dirigeant: "'indépendant'",
			}),
		[situation]
	)
	return (
		<>
			<div
				className={classnames('comparaison-grid', {
					hideAutoEntrepreneur,
					hideAssimiléSalarié,
				})}
			>
				<h2 className="AS">
					{emoji('☂')} <Trans>Assimilé salarié</Trans>
					<small>
						<Trans i18nKey="comparaisonRégimes.AS.tagline">
							Le régime tout compris
						</Trans>
					</small>
				</h2>
				<h2 className="indep">
					{emoji('👩‍🔧')}{' '}
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
				</h2>
				<h2 className="auto">
					{emoji('🚶‍♂️')} <Trans>Auto-entrepreneur</Trans>
					<small>
						<Trans i18nKey="comparaisonRégimes.auto.tagline">
							Pour commencer sans risques
						</Trans>
					</small>
				</h2>

				<h3 className="legend">
					<Trans i18nKey="comparaisonRégimes.status.legend">
						Statuts juridiques possibles
					</Trans>
				</h3>
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
					<h3 className="legend">Couverture accidents du travail</h3>
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
					<h3 className="legend">
						Assurance maladie{' '}
						<small>(médicaments, soins, hospitalisations)</small>
					</h3>
					<div className="AS-indep-et-auto">Identique pour tous</div>
				</Trans>
				<Trans i18nKey="comparaisonRégimes.mutuelle">
					<h3 className="legend">
						Mutuelle santé
						<small />
					</h3>
					<div className="AS">Obligatoire</div>
					<div className="indep-et-auto">Fortement conseillée</div>
				</Trans>

				<Trans i18nKey="comparaisonRégimes.indemnités">
					<h3 className="legend">Indemnités journalières</h3>
				</Trans>
				<div className="green AS">++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>
				<Trans i18nKey="comparaisonRégimes.retraite">
					<h3 className="legend">Retraite</h3>
				</Trans>
				<div className="green AS">+++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>

				{showMore ? (
					<>
						<Trans i18nKey="comparaisonRégimes.ACRE">
							<h3 className="legend">ACRE</h3>
							<div className="AS-et-indep">
								1 an <small>(automatique et inconditionnelle)</small>
							</div>
							<div className="auto">
								Entre 3 et 4 trimestres{' '}
								<small>(sous conditions d'éligibilité)</small>
							</div>
						</Trans>
						<Trans i18nKey="comparaisonRégimes.déduction">
							<h3 className="legend">Déduction des charges</h3>
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
							<h3 className="legend">Paiement des cotisations</h3>
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
							<h3 className="legend">
								Contrats prévoyance et retraite facultatives déductibles
							</h3>
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
							<h3 className="legend">Paiement de cotisations minimales</h3>
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
							<h3 className="legend">
								Revenu minimum pour l'ouverture des droits aux prestations
							</h3>
							<div className="AS">Oui</div>
							<div className="indep">
								Non <small>(cotisations minimales obligatoires)</small>
							</div>
							<div className="auto">Oui</div>
						</Trans>
						{!hideAutoEntrepreneur && (
							<Trans i18nKey="comparaisonRégimes.plafondCA">
								<h3 className="legend">Plafond de chiffre d'affaires</h3>
								<div className="AS-et-indep">
									<Trans>Non</Trans>
								</div>
								<div className="auto">
									<Trans>Oui</Trans>
									<small>
										(72 500 € en services / 176 200 € en vente de biens,
										restauration ou hébergement)
									</small>
								</div>
							</Trans>
						)}
						<Trans i18nKey="comparaisonRégimes.comptabilité">
							<h3 className="legend">
								Gestion comptable, sociale, juridique...
							</h3>
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
							<button
								onClick={() => setShowMore(true)}
								className="ui__ simple small button"
							>
								Afficher plus d'informations
							</button>
						</div>
					</Trans>
				)}
				<div className="all colored">
					{!conversationStarted ? (
						<>
							<Trans i18nKey="comparaisonRégimes.simulationText">
								<h3>
									Comparer mes revenus, pension de retraite et indemnité maladie
								</h3>
								<img src={revenusSVG} css="height: 8rem" />
								<button
									className="ui__ cta plain button"
									onClick={startConversation}
								>
									Lancer la simulation
								</button>
							</Trans>
						</>
					) : (
						<div className="ui__ container">
							<SeeAnswersButton />
							<Conversation />
						</div>
					)}
				</div>
				{displayResult && (
					<>
						<Trans i18nKey="comparaisonRégimes.revenuNetAvantImpot">
							<h3 className="legend">
								Revenu net de cotisations <small>(avant impôts)</small>
							</h3>
						</Trans>
						<div className="AS">
							<Value
								linkToRule={false}
								engine={assimiléEngine}
								precision={0}
								unit="€/an"
								expression="contrat salarié . rémunération . net"
							/>
						</div>
						<div className="indep">
							<Value
								linkToRule={false}
								engine={indépendantEngine}
								precision={0}
								expression="dirigeant . indépendant . revenu net de cotisations"
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
									expression="dirigeant . auto-entrepreneur . net de cotisations"
								/>
							</>
						</div>
						<h3 className="legend">
							<Trans i18nKey="comparaisonRégimes.retraiteEstimation.legend">
								<span>Pension de retraite</span>
								<small>(avant impôts)</small>
							</Trans>
						</h3>
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
									Pension calculée pour 172 trimestres cotisés au régime des
									indépendants sans variations de revenus.
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
							<h3 className="legend">
								Nombre de trimestres validés <small>(pour la retraite)</small>
							</h3>
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
							<h3 className="legend">
								Indemnités journalières <small>(en cas d'arrêt maladie)</small>
							</h3>
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
			<div className="ui__ container">
				<br />
				<h3>
					<Trans i18nKey="comparaisonRégimes.titreSelection">
						Créer mon entreprise en tant que :
					</Trans>
				</h3>
				<div className="ui__ answer-group">
					{!hideAssimiléSalarié && (
						<button
							className="ui__  button"
							onClick={() => {
								dispatch(defineDirectorStatus('SALARIED'))
								!hideAutoEntrepreneur && dispatch(isAutoentrepreneur(false))
							}}
						>
							<Trans i18nKey="comparaisonRégimes.choix.AS">
								Assimilé&nbsp;salarié
							</Trans>
						</button>
					)}
					<button
						className="ui__  button"
						onClick={() => {
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
					</button>
					{!hideAutoEntrepreneur && (
						<button
							className="ui__ button"
							onClick={() => {
								!hideAssimiléSalarié &&
									dispatch(defineDirectorStatus('SELF_EMPLOYED'))
								dispatch(isAutoentrepreneur(true))
							}}
						>
							<Trans i18nKey="comparaisonRégimes.choix.auto">
								Auto-entrepreneur
							</Trans>
						</button>
					)}
				</div>
			</div>
		</>
	)
}
