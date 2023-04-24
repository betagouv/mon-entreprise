import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import revenusSVG from '@/assets/images/revenus.svg'
import { Message } from '@/design-system'
import AnswerGroup from '@/design-system/answer-group'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import {
	defineDirectorStatus,
	isAutoentrepreneur,
	useDispatchAndGoToNextQuestion,
} from '@/store/actions/companyStatusActions'

type SchemeComparaisonProps = {
	hideAutoEntrepreneur?: boolean
	hideAssimiléSalarié?: boolean
}

export default function SchemeComparaison({
	hideAutoEntrepreneur = false,
	hideAssimiléSalarié = false,
}: SchemeComparaisonProps) {
	const { absoluteSitePaths } = useSitePaths()

	const dispatch = useDispatchAndGoToNextQuestion()
	const { t } = useTranslation()
	const [showMore, setShowMore] = useState(false)

	return (
		<>
			<AnswerGroup role="list">
				{[
					!hideAssimiléSalarié && (
						<Button
							key="assimiléSalarié"
							onPress={() => {
								dispatch(defineDirectorStatus('SALARIED'))
								!hideAutoEntrepreneur && dispatch(isAutoentrepreneur(false))
							}}
							aria-label={t(
								'comparaisonRégimes.choix.AS.aria-label',
								"Assimilé salarié, sélectionner l'option et passer à l'étape suivante"
							)}
						>
							<Trans i18nKey="comparaisonRégimes.choix.AS.button">
								Assimilé salarié
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
						aria-label={
							hideAssimiléSalarié
								? t(
										'comparaisonRégimes.choix.EI.aria-label',
										"Entreprise individuelle, sélectionner l'option et passer à l'étape suivante"
								  )
								: t(
										'comparaisonRégimes.choix.indep.aria-label',
										"Indépendant, sélectionner l'option et passer à l'étape suivante"
								  )
						}
					>
						{hideAssimiléSalarié ? (
							<Trans i18nKey="comparaisonRégimes.choix.EI.button">
								Entreprise individuelle
							</Trans>
						) : (
							<Trans i18nKey="comparaisonRégimes.choix.indep.button">
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
							aria-label={t(
								'comparaisonRégimes.choix.auto.aria-label',
								"Auto-entrepreneur, sélectionner l'option et passer à l'étape suivante"
							)}
						>
							<Trans i18nKey="comparaisonRégimes.choix.auto.button">
								Auto-entrepreneur
							</Trans>
						</Button>
					),
				].filter(Boolean)}
			</AnswerGroup>
			<Spacing md />
			<StyledGrid
				hideAutoEntrepreneur={hideAutoEntrepreneur}
				hideAssimiléSalarié={hideAssimiléSalarié}
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
							SAS, SASU ou SARL avec gérant minoritaire ou égalitaire
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
							<Button
								light
								size="XS"
								onPress={() => setShowMore(true)}
								aria-expanded={false}
							>
								Afficher plus d'informations
							</Button>
						</div>
					</Trans>
				)}
			</StyledGrid>

			<Spacing lg />

			<Message>
				<Grid
					spacing={4}
					container
					css={`
						justify-content: center;
						align-items: center;
					`}
				>
					<Grid item sm={4} lg={3} xl={2} xs={6}>
						<img src={revenusSVG} css="width: 100%; padding: 1rem;" alt="" />
					</Grid>
					<Grid item sm={8} lg={9} xl={10}>
						<H3>Comparateur de statuts</H3>
						<Intro>
							Découvrez les différence en terme de revenus, pensions de retraite
							et indemnités maladie à partir d'une estimation de votre futurs
							chiffre d'affaires et charges de fonctionnement.
						</Intro>
						<Button to={absoluteSitePaths.simulateurs.comparaison}>
							Ouvrir le comparateur
						</Button>
						<Spacing md />
					</Grid>
				</Grid>
			</Message>
		</>
	)
}

type StyledGridProps = {
	hideAssimiléSalarié?: boolean
	hideAutoEntrepreneur?: boolean
}

export const StyledGrid = styled.div`
	display: grid;
	font-family: ${({ theme }) => theme.fonts.main};
	justify-items: stretch;
	justify-content: center;

	${(props: StyledGridProps) =>
		css`
			grid-template-columns:
				[row-legend] minmax(auto, 100%)
				[assimilé-salarié] ${props.hideAssimiléSalarié
					? '0px'
					: 'minmax(20%, 20rem)'}
				[indépendant] minmax(20%, 20rem)
				[auto-entrepreneur] ${props.hideAutoEntrepreneur
					? '0px'
					: 'minmax(20%, 20rem)'}
				[end];
		`}
	& > * {
		width: 100%;
		border-bottom: 1px solid ${({ theme }) => theme.colors.bases.primary[100]};
		padding: 0.6rem 1.2rem;
		border-right: 1px solid ${({ theme }) => theme.colors.bases.primary[100]};
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		text-align: center;
		flex-wrap: wrap;
	}

	& > h2 {
		margin: 0;
		border: none;
		align-self: stretch;
	}

	& > h2 img {
		height: 1.6rem !important;
		width: 1.6rem !important;
	}
	& > .legend {
		align-items: flex-end;
		grid-column: row-legend;
		text-align: right;
	}

	& > .AS-et-indep {
		grid-column: assimilé-salarié / auto-entrepreneur;
	}
	& > .AS {
		${(props) =>
			props.hideAssimiléSalarié &&
			css`
				display: none;
			`}
		grid-column: assimilé-salarié;
		min-width: 11rem;
	}
	& > .indep {
		grid-column: indépendant;
	}
	& > .auto {
		grid-column: auto-entrepreneur;
		${(props) =>
			props.hideAutoEntrepreneur &&
			css`
				display: none;
			`}
		border-right: none;
		min-width: 14rem;
	}
	& > .all {
		border-right: none;
		border-bottom: none;
		grid-column: row-legend / end;
	}
	& > .all.colored {
		background-color: ${({ theme }) => theme.colors.bases.primary[100]};
	}

	& > .indep-et-auto {
		grid-column: indépendant / end;
		border-right: none;
	}
	& > .AS-indep-et-auto {
		grid-column: assimilé-salarié / end;
		border-right: none;
	}

	&.hideAutoEntrepreneur > .auto {
		display: none;
	}
	&.hideAutoEntrepreneur > .indep-et-auto {
		border-right: 1px solid ${({ theme }) => theme.colors.bases.primary[100]};
	}

	&.hideAssimiléSalarié > .AS {
		display: none;
	}

	& > .green {
		font-weight: bold;
		color: green;
		background-color: inherit;
	}

	& > .red {
		font-weight: bold;
		color: red;
		background-color: inherit;
	}

	& > .no-border {
		border: none;
	}
	& .button {
		align-self: stretch;
	}

	@media (max-width: 800px) {
		& > * {
			padding: 0.6rem;
		}
	}
	@media (max-width: 600px) {
		& {
			display: block;
			padding: 0 0.6rem;
		}

		& h2 {
			flex-direction: column;
		}
		& small {
			margin-left: 0.2rem;
		}

		& > *::before {
			flex: 1;
			text-align: left;
			flex-shrink: 0;
			white-space: nowrap;
			user-select: text;
			font-weight: normal;
		}
		& > :not(.button)::before {
			color: ${({ theme }) => theme.colors.bases.primary[700]} !important;
			background-color: inherit;
			opacity: 0.6;
		}
		& > .AS::before {
			content: 'Assimilé-salarié :';
		}
		& > .indep::before,
		&.hideAutoEntrepreneur > .indep-et-auto::before {
			content: 'Indépendant :';
		}

		&.hideAssimiléSalarié > .AS-et-indep::before,
		&.hideAssimiléSalarié > .indep::before {
			content: 'Entreprise individuelle :';
		}

		& > .auto::before {
			content: 'Auto-entrepreneur :';
		}
		& > .indep-et-auto::before {
			content: 'Indépendant / auto-entrepreneur :';
		}
		& > .AS-et-indep::before {
			content: 'Assimilé salarié / indépendant ';
		}
		& > h2::before {
			display: none;
		}
		& > h2.AS::after,
		&:not(.hideAutoEntrepreneur) > h2.indep::after {
			display: block;
			font-size: 1rem;
			margin-top: 1rem;
			content: 'vs';
		}
		& > .legend {
			justify-content: flex-start;
			align-items: baseline;
			text-align: left;
		}
		& > * {
			border: none;
			flex-direction: row;
			text-align: right;
			justify-content: right;
		}
		& > :not(.all):not(.button) {
			padding-left: 0;
		}
		& > .all {
			margin: 0 -0.6rem;
			text-align: center;
			justify-content: center;
			margin-top: 2rem;
		}
		& > .no-border > .button {
			flex: 1;
		}
		& > .no-border::before {
			display: none;
		}
	}
	@media (min-width: 600px) {
		& > h3 {
			margin: 0;
			font-weight: normal;

			font-size: 1rem;
		}
	}
`
