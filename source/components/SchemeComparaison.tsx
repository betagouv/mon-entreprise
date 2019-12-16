import { setSimulationConfig, setSituationBranch } from 'Actions/actions'
import {
	defineDirectorStatus,
	isAutoentrepreneur
} from 'Actions/companyStatusActions'
import classnames from 'classnames'
import { T } from 'Components'
import Conversation from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import PeriodSwitch from 'Components/PeriodSwitch'
import ComparaisonConfig from 'Components/simulationConfigs/rémunération-dirigeant.yaml'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import { encodeRuleName, getRuleFromAnalysis } from 'Engine/rules.js'
import revenusSVG from 'Images/revenus.svg'
import { default as React, useCallback, useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	branchAnalyseSelector
} from 'Selectors/analyseSelectors'
import { DottedName } from 'Types/rule'
import Animate from 'Ui/animate'
import InfoBulle from 'Ui/InfoBulle'
import './SchemeComparaison.css'

let getBranchIndex = (branch: string) =>
	({ assimilé: 0, indépendant: 1, 'auto-entrepreneur': 2 }[branch])

let getRuleFrom = analyses => (branch: string, dottedName: DottedName) => {
	let i = getBranchIndex(branch)
	return getRuleFromAnalysis(analyses[i])(dottedName)
}

type SchemeComparaisonProps = {
	hideAutoEntrepreneur?: boolean
	hideAssimiléSalarié?: boolean
}

export default function SchemeComparaison({
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false
}: SchemeComparaisonProps) {
	const dispatch = useDispatch()
	dispatch(setSimulationConfig(ComparaisonConfig))

	const analyses = useSelector(analysisWithDefaultsSelector)
	const plafondAutoEntrepreneurDépassé = useSelector((state: RootState) =>
		branchAnalyseSelector(state, {
			situationBranchName: 'Auto-entrepreneur'
		}).controls?.find(
			({ test }) =>
				test.includes && test.includes('base des cotisations > plafond')
		)
	)

	let getRule = getRuleFrom(analyses)
	const [showMore, setShowMore] = useState(false)
	const [conversationStarted, setConversationStarted] = useState(
		!!getRule('assimilé', 'revenu net après impôt')?.nodeValue
	)
	const startConversation = useCallback(() => setConversationStarted(true), [
		setConversationStarted
	])

	return (
		<>
			<div
				className={classnames('comparaison-grid', {
					hideAutoEntrepreneur,
					hideAssimiléSalarié
				})}
			>
				<h2 className="AS">
					{emoji('☂')} <T>Assimilé salarié</T>
					<small>
						<T k="comparaisonRégimes.AS.tagline">Le régime tout compris</T>
					</small>
				</h2>
				<h2 className="indep">
					{emoji('👩‍🔧')}{' '}
					{hideAssimiléSalarié ? (
						<T>Entreprise Individuelle</T>
					) : (
						<T>Indépendant</T>
					)}
					<small>
						<T k="comparaisonRégimes.indep.tagline">
							La protection sociale à la carte
						</T>
					</small>
				</h2>
				<h2 className="auto">
					{emoji('🚶‍♂️')} <T>Auto-entrepreneur</T>
					<small>
						<T k="comparaisonRégimes.auto.tagline">
							Pour commencer sans risques
						</T>
					</small>
				</h2>

				<h3 className="legend">
					<T k="comparaisonRégimes.status.legend">
						Statuts juridiques possibles
					</T>
				</h3>
				<div className="AS">
					<div>
						<T k="comparaisonRégimes.status.AS">
							SAS, SASU ou SARL avec gérant minoritaire
						</T>
					</div>
				</div>
				<div className="indep">
					<div>
						{hideAssimiléSalarié ? (
							<T k="comparaisonRégimes.status.indep.2">EI ou EIRL</T>
						) : (
							<T k="comparaisonRégimes.status.indep.1">
								EI, EIRL, EURL ou SARL avec gérant majoritaire
							</T>
						)}
					</div>
				</div>
				<div className="auto">
					<T k="comparaisonRégimes.status.auto">Auto-entreprise</T>
				</div>

				<T k="comparaisonRégimes.sécuritéSociale">
					<h3 className="legend">Sécurité sociale</h3>
					<div className="AS">
						Régime général <small />
					</div>
					<div className="indep-et-auto">
						Sécurité sociale des indépendants <small />
					</div>
				</T>
				<T k="comparaisonRégimes.AT">
					<h3 className="legend">Couverture accidents du travail</h3>
				</T>
				<div className="AS">
					<T>
						<T>Oui</T>
					</T>
				</div>
				<div className="indep-et-auto">
					<T>Non</T>
				</div>
				<T k="comparaisonRégimes.assuranceMaladie">
					<h3 className="legend">
						Assurance maladie{' '}
						<small>(médicaments, soins, hospitalisations)</small>
					</h3>
					<div className="AS-indep-et-auto">Identique pour tous</div>
				</T>
				<T k="comparaisonRégimes.mutuelle">
					<h3 className="legend">
						Mutuelle santé
						<small />
					</h3>
					<div className="AS">Obligatoire</div>
					<div className="indep-et-auto">Fortement conseillée</div>
				</T>

				<T k="comparaisonRégimes.indemnités">
					<h3 className="legend">Indemnités journalières</h3>
				</T>
				<div className="green AS">++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>
				<T k="comparaisonRégimes.retraite">
					<h3 className="legend">Retraite</h3>
				</T>
				<div className="green AS">+++</div>
				<div className="green indep">++</div>
				<div className="green auto">+</div>

				{showMore ? (
					<>
						<T k="comparaisonRégimes.ACRE">
							<h3 className="legend">ACRE</h3>
							<div className="AS-et-indep">
								1 an <small>(exonération partielle de cotisations)</small>
							</div>
							<div className="auto">
								3 ans
								<small>(application de taux réduits de cotisations)</small>
							</div>
						</T>
						<T k="comparaisonRégimes.déduction">
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
						</T>

						<T k="comparaisonRégimes.cotisations">
							<h3 className="legend">Paiement des cotisations</h3>
							<div className="AS">Mensuel</div>
							<div className="indep">
								Provision mensuelle ou trimestrielle
								<small>
									(avec régularisation après coup en fonction du revenu réel)
								</small>
							</div>
							<div className="auto">Mensuel ou trimestriel</div>
						</T>
						<T k="comparaisonRégimes.complémentaireDeductible">
							<h3 className="legend">
								Contrats prévoyance et retraite facultatives déductibles
							</h3>
							<div className="AS">
								Oui <small>(sous certaines conditions)</small>
							</div>
							<div className="indep">
								Oui <small>(Loi Madelin)</small>
							</div>
						</T>
						<div className="auto">
							<T>Non</T>
						</div>
						<T k="comparaisonRégimes.cotisationMinimale">
							<h3 className="legend">Paiement de cotisations minimales</h3>
						</T>
						<div className="AS">
							<T>Non</T>
						</div>
						<div className="indep">
							<T>Oui</T>
						</div>
						<div className="auto">
							<T>Non</T>
						</div>
						<T k="comparaisonRégimes.seuil">
							<h3 className="legend">
								Revenu minimum pour l'ouverture des droits aux prestations
							</h3>
							<div className="AS">Oui</div>
							<div className="indep">
								Non <small>(cotisations minimales obligatoires)</small>
							</div>
							<div className="auto">Oui</div>
						</T>
						{!hideAutoEntrepreneur && (
							<T k="comparaisonRégimes.plafondCA">
								<h3 className="legend">Plafond de chiffre d'affaires</h3>
								<div className="AS-et-indep">
									<T>Non</T>
								</div>
								<div className="auto">
									<T>Oui</T>
									<small>
										(70 000 € en services / 170 000 € en vente de biens,
										restauration ou hébergement)
									</small>
								</div>
							</T>
						)}
						<T k="comparaisonRégimes.comptabilité">
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
						</T>
					</>
				) : (
					<T k="comparaisonRégimes.comparaisonDétaillée">
						<div className="all">
							<button
								onClick={() => setShowMore(true)}
								className="ui__ simple small button"
							>
								Afficher plus d'informations
							</button>
						</div>
					</T>
				)}
				{conversationStarted && (
					<>
						<T k="comparaisonRégimes.période">
							<h3 className="legend">Unité</h3>
						</T>
						<div className="AS-indep-et-auto" style={{ alignSelf: 'start' }}>
							<PeriodSwitch />
						</div>
					</>
				)}
				<div className="all colored">
					{!conversationStarted ? (
						<>
							<T k="comparaisonRégimes.simulationText">
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
							</T>
						</>
					) : (
						<div className="ui__ container">
							<SeeAnswersButton />
							<Conversation />
						</div>
					)}
				</div>
				{conversationStarted &&
					!!getRule('assimilé', 'revenu net après impôt')?.nodeValue && (
						<>
							<T k="comparaisonRégimes.revenuNetApresImpot">
								<h3 className="legend">Revenu net après impôt</h3>
							</T>
							<div className="AS">
								<Animate.appear className="ui__ plain card">
									<RuleValueLink
										branch="assimilé"
										rule="revenu net après impôt"
									/>
								</Animate.appear>
							</div>
							<div className="indep">
								<Animate.appear className="ui__ plain card">
									<RuleValueLink
										branch="indépendant"
										rule="revenu net après impôt"
									/>
								</Animate.appear>
							</div>
							<div className="auto">
								<Animate.appear
									className={classnames(
										'ui__ plain card',
										plafondAutoEntrepreneurDépassé && 'disabled'
									)}
								>
									{plafondAutoEntrepreneurDépassé ? (
										'Plafond de CA dépassé'
									) : (
										<RuleValueLink
											branch="auto-entrepreneur"
											rule="revenu net après impôt"
										/>
									)}
								</Animate.appear>
							</div>
							<T k="comparaisonRégimes.revenuNetAvantImpot">
								<h3 className="legend">
									Revenu net de cotisations <small>(avant impôts)</small>
								</h3>
							</T>
							<div className="AS">
								<RuleValueLink
									branch="assimilé"
									rule="contrat salarié . rémunération . net"
								/>
							</div>
							<div className="indep">
								<RuleValueLink
									branch="indépendant"
									rule="dirigeant . indépendant . revenu net de cotisations"
								/>
							</div>
							<div className="auto">
								{plafondAutoEntrepreneurDépassé ? (
									'—'
								) : (
									<RuleValueLink
										branch="auto-entrepreneur"
										rule="dirigeant . auto-entrepreneur . revenu net de cotisations"
									/>
								)}
							</div>
							<h3 className="legend">
								<T k="comparaisonRégimes.retraiteEstimation.legend">
									<span>Pension de retraite</span>
									<small>(avant impôts)</small>
								</T>
							</h3>
							<div className="AS">
								<span>
									<RuleValueLink
										branch="assimilé"
										rule="protection sociale . retraite"
									/>{' '}
									<InfoBulle>
										<T k="comparaisonRégimes.retraiteEstimation.infobulles.AS">
											Pension calculée pour 172 trimestres cotisés au régime
											général sans variations de revenus.
										</T>
									</InfoBulle>
								</span>
							</div>
							<div className="indep">
								{getRule('indépendant', 'protection sociale . retraite')
									.applicable !== false ? (
									<span>
										<RuleValueLink
											branch="indépendant"
											rule="protection sociale . retraite"
										/>{' '}
										<InfoBulle>
											<T k="comparaisonRégimes.retraiteEstimation.infobulles.indep">
												Pension calculée pour 172 trimestres cotisés au régime
												des indépendants sans variations de revenus.
											</T>
										</InfoBulle>
									</span>
								) : (
									<span className="ui__ notice">
										<T>Pas implémenté</T>
									</span>
								)}
							</div>
							<div className="auto">
								{plafondAutoEntrepreneurDépassé ? (
									'—'
								) : getRule(
										'auto-entrepreneur',
										'protection sociale . retraite'
								  ).applicable !== false ? (
									<span>
										<RuleValueLink
											branch="auto-entrepreneur"
											rule="protection sociale . retraite"
										/>{' '}
										<InfoBulle>
											<T k="comparaisonRégimes.retraiteEstimation.infobulles.auto">
												Pension calculée pour 172 trimestres cotisés en
												auto-entrepreneur sans variations de revenus.
											</T>
										</InfoBulle>
									</span>
								) : (
									<span className="ui__ notice">
										<T>Pas implémenté</T>
									</span>
								)}
							</div>
							<T k="comparaisonRégimes.trimestreValidés">
								<h3 className="legend">
									Nombre de trimestres validés <small>(pour la retraite)</small>
								</h3>
							</T>
							<div className="AS">
								<RuleValueLink
									branch="assimilé"
									rule="protection sociale . retraite . trimestres validés par an"
									appendText={<T>trimestres</T>}
									unit={null}
								/>
							</div>
							<div className="indep">
								<RuleValueLink
									branch="indépendant"
									rule="protection sociale . retraite . trimestres validés par an"
									appendText={<T>trimestres</T>}
									unit={null}
								/>
							</div>
							<div className="auto">
								{plafondAutoEntrepreneurDépassé ? (
									'—'
								) : (
									<RuleValueLink
										branch="auto-entrepreneur"
										rule="protection sociale . retraite . trimestres validés par an"
										appendText={<T>trimestres</T>}
										unit={null}
									/>
								)}
							</div>
							<T k="comparaisonRégimes.indemnités">
								<h3 className="legend">
									Indemnités journalières{' '}
									<small>(en cas d'arrêt maladie)</small>
								</h3>
							</T>
							<div className="AS">
								<span>
									<RuleValueLink
										branch="assimilé"
										appendText={
											<>
												/ <T>jour</T>
											</>
										}
										rule="protection sociale . santé . indemnités journalières"
									/>
								</span>
								<small>
									(
									<RuleValueLink
										branch="assimilé"
										rule="protection sociale . accidents du travail et maladies professionnelles"
									/>{' '}
									<T>pour les accidents de trajet/travail et maladie pro</T>)
								</small>
							</div>
							<div className="indep">
								<span>
									<RuleValueLink
										appendText={
											<>
												/ <T>jour</T>
											</>
										}
										branch="indépendant"
										rule="protection sociale . santé . indemnités journalières"
									/>
								</span>
							</div>
							<div className="auto">
								{plafondAutoEntrepreneurDépassé ? (
									'—'
								) : (
									<span>
										<RuleValueLink
											branch="auto-entrepreneur"
											rule="protection sociale . santé . indemnités journalières"
											appendText={
												<>
													/ <T>jour</T>
												</>
											}
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
					<T k="comparaisonRégimes.titreSelection">
						Créer mon entreprise en tant que :
					</T>
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
							<T k="comparaisonRégimes.choix.AS">Assimilé&nbsp;salarié</T>
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
							<T k="comparaisonRégimes.choix.EI">Entreprise individuelle</T>
						) : (
							<T k="comparaisonRégimes.choix.indep">Indépendant</T>
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
							<T k="comparaisonRégimes.choix.auto">Auto-entrepreneur</T>
						</button>
					)}
				</div>
			</div>
		</>
	)
}

type RuleValueLinkProps = {
	branch: string
	rule: DottedName
	appendText?: React.ReactNode
	unit?: null | string
}

function RuleValueLink({
	branch,
	rule: dottedName,
	appendText,
	unit
}: RuleValueLinkProps) {
	const dispatch = useDispatch()
	const analyses = useSelector(analysisWithDefaultsSelector)
	const sitePaths = useContext(SitePathsContext)
	let rule = getRuleFrom(analyses)(branch, dottedName)
	return !rule ? null : (
		<Link
			onClick={() => dispatch(setSituationBranch(getBranchIndex(branch)))}
			to={sitePaths.documentation.index + '/' + encodeRuleName(rule.dottedName)}
		>
			<Value
				maximumFractionDigits={0}
				{...rule}
				unit={
					/* //TODO the unit should be integrated in the leaf rules of base.yaml and infered by mecanisms. Will be done in a future release*/
					unit !== undefined ? unit : '€'
				}
			/>
			{appendText && <> {appendText}</>}
		</Link>
	)
}
