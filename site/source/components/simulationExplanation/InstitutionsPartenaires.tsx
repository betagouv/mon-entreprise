import { Grid } from '@mui/material'
import Value, {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { FromBottom } from '@/components/ui/animate'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import assuranceMaladieSrc from '@/images/assurance-maladie.svg'
import dgfipSrc from '@/images/logo-dgfip.svg'
import * as logosSrc from '@/images/logos-caisses-retraite'
import urssafSrc from '@/images/Urssaf.svg'
import { DottedName } from 'modele-social'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from '@/selectors/simulationSelectors'
import styled from 'styled-components'
import { Message } from '@/design-system'

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
						<Message border={false}>
							<WhenApplicable dottedName="dirigeant . indépendant . PL . CNAVPL">
								<CotisationsUrssaf rule="dirigeant . indépendant . PL . cotisations Urssaf" />
								<CaisseRetraite />
							</WhenApplicable>
							<WhenNotApplicable dottedName="dirigeant . indépendant . PL . CNAVPL">
								<CotisationsUrssaf rule="dirigeant . indépendant . cotisations et contributions" />
							</WhenNotApplicable>
							<ImpôtsDGFIP />
							<Condition expression="dirigeant . indépendant . PL . PAMC . participation CPAM > 0">
								<InstitutionLine>
									<InstitutionLogo
										href="https://www.ameli.fr/assure/droits-demarches/salaries-travailleurs-independants-et-personnes-sans-emploi/emploi-independant-non-salarie/praticien-auxiliaire-medical"
										target="_blank"
										rel="noreferrer"
									>
										<img src={assuranceMaladieSrc} title="Logo CPAM" />
									</InstitutionLogo>
									<Body>
										<Trans i18nKey="simulateurs.explanation.institutions.cpam">
											En tant que professionnel de santé conventionné, vous
											bénéficiez d'une prise en charge d'une partie de vos
											cotisations par l'Assurance Maladie.
										</Trans>
									</Body>
									<Body className="ui__ lead">
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

				<Condition expression="dirigeant . indépendant . cotisations et contributions . exonérations . ACRE > 0">
					<SmallBody>
						<Trans i18nKey="simulateurs.explanation.institutions.notice acre">
							Les montants indiqués ci-dessus sont calculés sans prendre en
							compte l'exonération de début d'activité ACRE
						</Trans>
					</SmallBody>
				</Condition>
			</FromBottom>
		</section>
	)
}

type CotisationsUrssafProps = {
	rule: DottedName
	extraNotice?: JSX.Element
}

export function CotisationsUrssaf({
	rule,
	extraNotice,
}: CotisationsUrssafProps) {
	const unit = useSelector(targetUnitSelector)

	return (
		<InstitutionLine>
			<InstitutionLogo
				href="https://www.urssaf.fr/portail/home.html"
				target="_blank"
				rel="noreferrer"
			>
				<img src={urssafSrc} title="logo Urssaf" />
			</InstitutionLogo>
			<Body>
				<Trans i18nKey="simulateurs.explanation.institutions.urssaf">
					L’Urssaf recouvre les cotisations servant au financement de la
					sécurité sociale (assurance maladie, allocations familiales,
					dépendance).
				</Trans>{' '}
				{extraNotice}
			</Body>
			<Value unit={unit} displayedUnit="€" expression={rule} />
		</InstitutionLine>
	)
}

export function ImpôtsDGFIP() {
	const unit = useSelector(targetUnitSelector)

	return (
		<Condition expression="impôt . montant > 0">
			<InstitutionLine>
				<InstitutionLogo
					href="https://www.impots.gouv.fr"
					target="_blank"
					rel="noreferrer"
				>
					<img src={dgfipSrc} title="logo DGFiP" />
				</InstitutionLogo>
				<Body>
					<Trans i18nKey="simulateurs.explanation.institutions.dgfip">
						La direction générale des finances publiques (DGFiP) est l'organisme
						qui collecte l'impôt sur le revenu.{' '}
						<Condition expression="entreprise . imposition . IR . micro-fiscal">
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
						<InstitutionLine>
							<InstitutionLogo
								href={références && Object.values(références)[0]}
								target="_blank"
								rel="noreferrer"
							>
								<img src={logosSrc[caisse]} title={`logo ${caisse}`} />
							</InstitutionLogo>
							<Body>
								{description}{' '}
								<Trans i18nKey="simulateurs.explanation.CNAPL">
									Elle recouvre les cotisations liées à votre retraite et au
									régime d'invalidité-décès.
								</Trans>
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
			<H3>Vos cotisations</H3>
			<Grid container>
				<Grid item lg={12}>
					<Message border={false}>
						<CotisationsUrssaf
							rule="artiste-auteur . cotisations"
							extraNotice={
								<Condition expression="artiste-auteur . revenus . traitements et salaires > 0">
									<SmallBody>
										<Trans i18nKey="simulateurs.explanation.institutions.précompte-artiste-auteur">
											Pour vos revenus en traitement et salaires, ces
											cotisations sont « précomptées », c'est à dire payées à la
											source par le diffuseur.
										</Trans>
									</SmallBody>
								</Condition>
							}
						/>
						<Condition expression="artiste-auteur . cotisations . IRCEC > 0">
							<InstitutionLine>
								<InstitutionLogo
									href="http://www.ircec.fr/"
									target="_blank"
									rel="noreferrer"
								>
									<img src={logosSrc.IRCEC} title="logo IRCEC" />
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
		max-width: 100%;
		max-height: 50px;
	}
`

const InstitutionLine = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: ${({ theme }) => theme.spacings.md};
	flex-wrap: wrap;

	> ${InstitutionLogo} {
		display: block;
		width: 13ch;
		text-align: center;
	}

	> :nth-child(2) {
		flex: 1;
		padding: 0 4rem 0 2rem;
		margin: 0;
	}

	> :nth-child(3) {
		font-weight: bold;
		text-align: right;
	}

	@media (max-width: 680px) {
		> :nth-child(3) {
			flex-grow: 9;
		}

		> :nth-child(2) {
			order: 3;
			padding: 0;
			min-width: 80vw;
		}
	}
`
