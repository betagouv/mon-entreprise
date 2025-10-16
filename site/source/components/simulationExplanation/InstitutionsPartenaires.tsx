import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import assuranceMaladieSrc from '@/assets/images/assurance-maladie.svg'
import dgfipSrc from '@/assets/images/logo-dgfip.svg'
import urssafSrc from '@/assets/images/Urssaf.svg'
import RuleLink from '@/components/RuleLink'
import { FromBottom } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import {
	Body,
	Emoji,
	Grid,
	H2,
	H3,
	Message,
	SmallBody,
	Spacing,
} from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'
import * as logosSrc from '@/utils/logos'

import { Condition } from '../EngineValue/Condition'
import Value from '../EngineValue/Value'
import { WhenApplicable } from '../EngineValue/WhenApplicable'
import { WhenNotApplicable } from '../EngineValue/WhenNotApplicable'

export default function InstitutionsPartenaires() {
	const unit = useSelector(targetUnitSelector)

	return (
		<section>
			<FromBottom>
				<H3 as="h2">
					<Trans i18nKey="simulateurs.explanation.institutions.titre">
						Vos institutions partenaires
					</Trans>
				</H3>
				<Grid container>
					<Grid item lg={12} xl={10}>
						<Message border={false} role="list">
							<WhenApplicable dottedName="dirigeant . indépendant . PL . CNAVPL">
								<CotisationsUrssaf
									rule="dirigeant . indépendant . PL . cotisations Urssaf"
									role="listitem"
								/>
								<CaisseRetraite role="listitem" />
							</WhenApplicable>
							<WhenNotApplicable dottedName="dirigeant . indépendant . PL . CNAVPL">
								<CotisationsUrssaf
									rule="dirigeant . indépendant . cotisations et contributions . Urssaf"
									role="listitem"
								/>
							</WhenNotApplicable>
							<ImpôtsDGFIP role="listitem" />
							<Condition expression="dirigeant . indépendant . PL . PAMC . participation CPAM > 0">
								<InstitutionLine role="listitem">
									<InstitutionLogo
										href="https://www.ameli.fr/assure/droits-demarches/salaries-travailleurs-independants-et-personnes-sans-emploi/emploi-independant-non-salarie/praticien-auxiliaire-medical"
										target="_blank"
										rel="noreferrer"
										aria-label="Logo CPAM, accéder à ameli.fr, nouvelle fenêtre"
									>
										<img src={assuranceMaladieSrc} alt="Logo CPAM" />
									</InstitutionLogo>
									<Body>
										<Trans i18nKey="simulateurs.explanation.institutions.cpam">
											En tant que professionnel de santé conventionné, vous
											bénéficiez d'une prise en charge d'une partie de vos
											cotisations par l'Assurance Maladie.
										</Trans>
									</Body>
									<Body>
										<Emoji emoji="🎁" />{' '}
										<RuleLink dottedName="dirigeant . indépendant . PL . PAMC . participation CPAM">
											<Value
												unit={unit}
												displayedUnit="€"
												expression="- dirigeant . indépendant . PL . PAMC . participation CPAM"
											/>
										</RuleLink>
									</Body>
								</InstitutionLine>
							</Condition>
						</Message>
					</Grid>
				</Grid>
			</FromBottom>
		</section>
	)
}

type CotisationsUrssafProps = {
	rule: DottedName
	extraNotice?: JSX.Element
	role?: string
}

export function CotisationsUrssaf({
	rule,
	extraNotice,
	...props
}: CotisationsUrssafProps) {
	const unit = useSelector(targetUnitSelector)

	return (
		<InstitutionLine {...props}>
			<InstitutionLogo
				href="https://www.urssaf.fr/portail/home.html"
				target="_blank"
				rel="noreferrer"
				aria-label="Logo URSSAF, accéder à urssaf.fr, nouvelle fenêtre"
			>
				<img src={urssafSrc} alt="Logo Urssaf" />
			</InstitutionLogo>
			<div>
				<Body>
					<Trans i18nKey="simulateurs.explanation.institutions.urssaf">
						L’Urssaf recouvre les cotisations servant au financement de la
						sécurité sociale (assurance maladie, allocations familiales,
						dépendance
						<WhenNotApplicable
							dottedName={'dirigeant . indépendant . PL . CNAVPL'}
						>
							{' '}
							et retraite{' '}
							{/* IRCEC recouvre les cotisations de retraite complémentaire pour les artistes-auteurs */}
							<Condition expression="artiste-auteur . cotisations > 0">
								{' '}
								de base
							</Condition>
						</WhenNotApplicable>
						).
					</Trans>
				</Body>
				{extraNotice && <SmallBody>{extraNotice}</SmallBody>}
			</div>
			<Value unit={unit} displayedUnit="€" expression={rule} />
		</InstitutionLine>
	)
}

export function ImpôtsDGFIP({ role }: { role?: string }) {
	const unit = useSelector(targetUnitSelector)

	return (
		<Condition expression="impôt . montant > 0">
			<InstitutionLine role={role}>
				<InstitutionLogo
					href="https://www.impots.gouv.fr"
					target="_blank"
					rel="noreferrer"
					aria-label="Logo DGFiP, accéder à impots.gouv.fr, nouvelle fenêtre"
				>
					<img src={dgfipSrc} alt="Logo DGFiP" />
				</InstitutionLogo>
				<Body>
					<Trans i18nKey="simulateurs.explanation.institutions.dgfip">
						La direction générale des finances publiques (DGFiP) est l'organisme
						qui collecte l'impôt sur le revenu.{' '}
						<Condition expression="entreprise . imposition . régime . micro-entreprise">
							Le montant calculé{' '}
							<strong>
								prend en compte l'abattement du régime micro-fiscal
							</strong>
							.
						</Condition>
					</Trans>
				</Body>
				<Value unit={unit} displayedUnit="€" expression="impôt . montant" />
			</InstitutionLine>
		</Condition>
	)
}

function CaisseRetraite({ role }: { role?: string }) {
	const engine = useEngine()
	const unit = useSelector(targetUnitSelector)
	const caisses = [
		'CARCDSF',
		'CARPIMKO',
		'CIPAV',
		'CARMF',
		'CNBF',
		'CAVEC',
		'CAVP',
	] as const

	return (
		<>
			{caisses.map((caisse) => {
				const dottedName =
					`dirigeant . indépendant . PL . ${caisse}` as DottedName
				const { description, références } = engine.getRule(dottedName).rawNode

				return (
					<Condition expression={dottedName} key={caisse}>
						<InstitutionLine role={role}>
							<InstitutionLogo
								href={références && Object.values(références)[0]}
								target="_blank"
								rel="noreferrer"
							>
								<img
									src={logosSrc[caisse]}
									title={`logo ${caisse}`}
									alt={caisse}
								/>
							</InstitutionLogo>

							<Body>
								<Condition expression="dirigeant . indépendant . PL . CIPAV">
									{description}{' '}
									<SmallBody>
										<Trans i18nKey="simulateurs.explanation.institutions.CIPAV">
											Depuis le 1er janvier 2023, l’Urssaf recouvre les
											cotisations de retraite de base, de retraite
											complémentaire et d’invalidité-décès des professionnels
											libéraux relevant de la Cipav. La Cipav conserve la
											gestion du dossier de retraite ou de prévoyance.
										</Trans>
									</SmallBody>
								</Condition>
								<Condition expression="dirigeant . indépendant . PL . CIPAV = non">
									{description}{' '}
									<Trans i18nKey="simulateurs.explanation.institutions.CNAPL">
										Elle recouvre les cotisations liées à votre retraite et au
										régime d'invalidité-décès.
									</Trans>
								</Condition>
							</Body>

							<Value
								unit={unit}
								displayedUnit="€"
								expression="dirigeant . indépendant . PL . cotisations caisse de retraite"
							/>
						</InstitutionLine>
					</Condition>
				)
			})}
		</>
	)
}

export function InstitutionsPartenairesArtisteAuteur() {
	const unit = useSelector(targetUnitSelector)
	const { description: descriptionIRCEC } = useEngine().getRule(
		'artiste-auteur . cotisations . IRCEC'
	).rawNode

	return (
		<section>
			<Spacing md />
			<Grid container>
				<Grid item lg={12}>
					<Message border={false} role="list">
						<H3>Vos cotisations</H3>
						<CotisationsUrssaf
							rule="artiste-auteur . cotisations"
							extraNotice={
								<Condition expression="artiste-auteur . revenus . traitements et salaires > 0">
									<Trans i18nKey="simulateurs.explanation.institutions.précompte-artiste-auteur">
										Pour vos revenus en traitement et salaires, ces cotisations
										sont « précomptées », c'est à dire payées à la source par le
										diffuseur.
									</Trans>
								</Condition>
							}
							role="listitem"
						/>
						<Condition expression="artiste-auteur . cotisations . IRCEC > 0">
							<InstitutionLine role="listitem">
								<InstitutionLogo
									href="http://www.ircec.fr/"
									target="_blank"
									rel="noreferrer"
									aria-label="Logo IRCEC, accéder à ircec.fr, nouvelle fenêtre"
								>
									<img src={logosSrc.IRCEC} alt="Logo IRCEC" />
								</InstitutionLogo>
								<Body>{descriptionIRCEC}</Body>
								<Value
									displayedUnit="€"
									unit={unit}
									expression="artiste-auteur . cotisations . IRCEC"
								/>
							</InstitutionLine>
						</Condition>
					</Message>
				</Grid>
			</Grid>
		</section>
	)
}

export function InstitutionsPartenairesAutoEntrepreneur() {
	return (
		<section>
			<FromBottom>
				<H2>
					<Trans i18nKey="simulateurs.explanation.institutions.titre">
						Vos institutions partenaires
					</Trans>
				</H2>
				<Grid container>
					<Grid item lg={12} xl={10}>
						<Message border={false}>
							<CotisationsUrssaf rule="dirigeant . auto-entrepreneur . cotisations et contributions" />
							<ImpôtsDGFIP />
						</Message>
					</Grid>
				</Grid>
			</FromBottom>
		</section>
	)
}

const InstitutionLogo = styled.a`
	img {
		max-width: 110px;
		max-height: 50px;
	}
`

const InstitutionLine = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: ${({ theme }) => theme.spacings.md} 0;
	flex-wrap: nowrap;

	> ${InstitutionLogo} {
		display: block;
		width: 13ch;
		text-align: center;
	}

	> :nth-child(2) {
		flex: 1 1 0%;
		margin: 0;
		padding: 0 4rem 0 2rem;
	}

	@media (max-width: 680px) {
		flex-wrap: wrap;

		> :nth-child(1) {
			flex-basis: 50%;
			display: flex;
		}

		> :nth-child(2) {
			order: 3;
			padding: 0.5rem 0 0 0;
		}

		> :nth-child(3) {
			order: 2;
			flex-basis: 50%;
			display: flex;
			justify-content: flex-end;
		}
	}
`
