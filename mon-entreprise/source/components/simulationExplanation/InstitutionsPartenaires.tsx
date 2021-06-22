import Value, { Condition, WhenNotApplicable } from 'Components/EngineValue'
import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import assuranceMaladieSrc from 'Images/assurance-maladie.svg'
import dgfipSrc from 'Images/logo-dgfip.svg'
import * as logosSrc from 'Images/logos-caisses-retraite'
import urssafSrc from 'Images/Urssaf.svg'
import { DottedName } from 'modele-social'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'

export default function InstitutionsPartenaires() {
	const unit = useSelector(targetUnitSelector)
	return (
		<section>
			<FromBottom>
				<h2>
					<Trans i18nKey="simulateurs.explanation.institutions.titre">
						Vos institutions partenaires
					</Trans>
				</h2>
				<div className="ui__ full-width box-container">
					<Condition expression="entreprise . activité . libérale réglementée">
						<CotisationsUrssaf rule="dirigeant . indépendant . PL . cotisations Urssaf" />
						<CaisseRetraite />
					</Condition>
					<WhenNotApplicable dottedName="entreprise . activité . libérale réglementée">
						<CotisationsUrssaf rule="dirigeant . indépendant . cotisations et contributions" />
					</WhenNotApplicable>
					<ImpôtsDGFIP />
					<Condition expression="dirigeant . indépendant . PL . PAMC . participation CPAM > 0">
						<div className="ui__  card box">
							<a
								target="_blank"
								href="https://www.ameli.fr/assure/droits-demarches/salaries-travailleurs-independants-et-personnes-sans-emploi/emploi-independant-non-salarie/praticien-auxiliaire-medical"
							>
								<LogoImg src={assuranceMaladieSrc} title="Logo CPAM" />
							</a>
							<p className="ui__ notice">
								<Trans i18nKey="simulateurs.explanation.institutions.cpam">
									En tant que professionnel de santé conventionné, vous
									bénéficiez d'une prise en charge d'une partie de vos
									cotisations par l'Assurance Maladie.
								</Trans>
							</p>
							<p className="ui__ lead">
								<Emoji emoji="🎁" />{' '}
								<Value
									unit={unit}
									displayedUnit="€"
									expression="dirigeant . indépendant . PL . PAMC . participation CPAM"
								/>
							</p>
						</div>
					</Condition>
				</div>
				<Condition expression="dirigeant . indépendant . cotisations et contributions . exonérations . ACRE > 0">
					<p className="ui__ notice">
						<Trans i18nKey="simulateurs.explanation.institutions.notice acre">
							Les montants indiqués ci-dessus sont calculés sans prendre en
							compte l'exonération de début d'activité ACRE
						</Trans>
					</p>
				</Condition>
			</FromBottom>
		</section>
	)
}

export function CotisationsUrssaf({ rule }: { rule: DottedName }) {
	const unit = useSelector(targetUnitSelector)
	return (
		<div className="ui__  card box">
			<a target="_blank" href="https://www.urssaf.fr/portail/home.html">
				<LogoImg src={urssafSrc} title="logo Urssaf" />
			</a>
			<p className="ui__ notice">
				Les cotisations recouvrées par l'Urssaf, qui servent au financement de
				la sécurité sociale (assurance maladie, allocations familiales,
				dépendance)
			</p>
			<p className="ui__ lead">
				<Value unit={unit} displayedUnit="€" expression={rule} />
			</p>
		</div>
	)
}

export function ImpôtsDGFIP() {
	const unit = useSelector(targetUnitSelector)
	return (
		<Condition expression="impôt > 0">
			<div className="ui__  card box">
				<a target="_blank" href="https://www.impots.gouv.fr">
					<LogoImg src={dgfipSrc} title="logo DGFiP" />
				</a>
				<p className="ui__ notice">
					<Trans i18nKey="simulateurs.explanation.institutions.dgfip">
						La direction générale des finances publiques (DGFiP) est l'organisme
						qui collecte l'impôt sur le revenu.
					</Trans>
				</p>
				<p className="ui__ lead">
					<Value unit={unit} displayedUnit="€" expression="impôt . montant" />
				</p>
			</div>
		</Condition>
	)
}

function CaisseRetraite() {
	const engine = useEngine()
	const unit = useSelector(targetUnitSelector)
	const caisses = [
		'CARCDSF',
		'CARPIMKO',
		'CIPAV',
		'CARMF',
		'CNBF',
		'CAVEC',
	] as const

	return (
		<>
			{caisses.map((caisse) => {
				const dottedName =
					`dirigeant . indépendant . PL . ${caisse}` as DottedName
				const { description, références } = engine.getRule(dottedName).rawNode
				return (
					<Condition expression={dottedName} key={caisse}>
						<div className="ui__  card box">
							<a
								target="_blank"
								href={références && Object.values(références)[0]}
							>
								<LogoImg src={logosSrc[caisse]} title={`logo ${caisse}`} />
							</a>
							<p className="ui__ notice">
								{description}{' '}
								<Trans i18nKey="simulateurs.explanation.CNAPL">
									Elle recouvre les cotisations liées à votre retraite et au
									régime d'invalidité-décès.
								</Trans>
							</p>

							<p className="ui__ lead">
								<Value
									unit={unit}
									displayedUnit="€"
									expression="dirigeant . indépendant . PL . cotisations caisse de retraite"
								/>
							</p>
						</div>
					</Condition>
				)
			})}
		</>
	)
}

const LogoImg = styled.img`
	padding: 1rem;
	height: 5rem;
	max-width: 100%;
`
