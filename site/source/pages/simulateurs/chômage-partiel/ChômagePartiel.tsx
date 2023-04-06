import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PlaceDesEntreprisesButton } from '@/components/PlaceDesEntreprises'
import RuleLink from '@/components/RuleLink'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import Warning from '@/components/ui/WarningBlock'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { catchDivideByZeroError } from '@/utils'

declare global {
	interface Window {
		STONLY_WID: string
		StonlyWidget?: {
			open: () => void
			close: () => void
			toggle: () => void
			launcherShow: () => void
			launcherHide: () => void
			startURLWatcher: () => void
			stopURLWatcher: () => void
		}
	}
}

export default function ChômagePartiel() {
	const { t } = useTranslation()

	return (
		<>
			<Warning localStorageKey="covid19">
				<Ul>
					<Li>
						Ce simulateur ne prend pas en compte les rémunérations brut définies
						sur 39h hebdomadaires.
					</Li>
				</Ul>
			</Warning>
			<Simulation
				results={<ExplanationSection />}
				customEndMessages={<span>Voir les résultats au-dessus</span>}
			>
				<SimulationGoals legend="Salaire brut avant chômage partiel">
					<SimulationGoal
						label={t('Salaire brut mensuel')}
						dottedName="salarié . contrat . salaire brut"
					/>
				</SimulationGoals>
			</Simulation>
		</>
	)
}

export const SeoExplanations = () => {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.chômage-partiel.seo">
			<H2>Comment calculer l'indemnité d'activité partielle ?</H2>
			<Body>
				L'indemnité d'activité partielle de base est fixée par la loi à{' '}
				<strong>70% du brut</strong>. Elle est proratisée en fonction du nombre
				d'heures chômées. Pour un salarié à 2300 € brut mensuel, qui travaille à
				50% de son temps usuel, cela donne{' '}
				<strong>2300 € × 50% × 70% = 805 €</strong>
			</Body>
			<Body>
				A cette indemnité de base s'ajoute l'indemnité complémentaire pour les
				salaires proches du SMIC. Ce complément intervient lorsque le cumul de
				la rémunération et de l'indemnité de base est en dessous d'un SMIC net.
				Ces indemnités sont prises en charge par l'employeur, qui sera ensuite
				remboursé en parti ou en totalité par l'État.
			</Body>
			<Body>
				👉{' '}
				<RuleLink dottedName="salarié . activité partielle . indemnités">
					Voir le détail du calcul de l'indemnité
				</RuleLink>
			</Body>
			<H2>Comment calculer la part remboursée par l'État ?</H2>
			<Body>
				L'État prend en charge une partie de l'indemnité partielle pour les
				salaires allant jusqu'à <strong>4,5 SMIC</strong>, avec un minimum à
				8,03€ par heures chômée. Concrètement, cela abouti à une prise en charge
				à<strong>100%</strong> pour les salaires proches du SMIC. Celle-ci
				diminue progressivement jusqu'à se stabiliser à <strong>93%</strong>{' '}
				pour les salaires compris <strong>entre 2000 € et 7000 €</strong>{' '}
				(salaire correspondant à la limite de 4,5 SMIC).
			</Body>
			<Body>
				👉{' '}
				<RuleLink dottedName="salarié . activité partielle . indemnisation entreprise">
					Voir le détail du calcul du remboursement de l'indemnité
				</RuleLink>
			</Body>
			<H2>Échanger avec un conseiller sur l'activité partielle</H2>
			<Body as="div">
				Vous souhaitez :
				<Ul>
					<Li>vérifier l'allocation perçue, le reste à charge</Li>
					<Li>
						connaître la procédure de consultation du{' '}
						<abbr title="Comité social et économique">CSE</abbr>, la demande
						d'autorisation préalable
					</Li>
					<Li>vous informer sur l'activité partielle longue durée</Li>
					<Li>
						former vos salariés en activité partielle à de nouvelles compétences
						(coûts pédagogique pris en charge)
					</Li>
				</Ul>
				<Body>
					Service public simple et rapide : vous êtes rappelé(e) par le
					conseiller qui peut vous aider. Partenaires mobilisés : les directions
					départementales de l'emploi, du travail et des solidarités.
				</Body>
				<PlaceDesEntreprisesButton pathname="/aide-entreprise/activite-partielle-mon-entreprise-urssaf-fr/demande/activite-partielle" />
			</Body>
			<H2>Comment déclarer une activité partielle ?</H2>
			<Body>
				Face à la crise du coronavirus, les modalités de passage en activité
				partielle ont été allégées. L'employeur est autorisé a placer ses
				salariés en activité partielle avant que la demande officielle ne soit
				déposée. Celui-ci dispose ensuite d'un délai de{' '}
				<strong>30 jours</strong> pour se mettre en règle. Les indemnités seront
				versées avec un effet rétro-actif débutant à la mise en place du chômage
				partiel.
			</Body>
			<Body>
				👉{' '}
				<Link
					href="https://www.service-public.fr/professionnels-entreprises/vosdroits/R31001"
					aria-label={t(
						'Effectuer la demande de chômage partiel, accéder à la page dédiée, nouvelle fenêtre'
					)}
				>
					Effectuer la demande de chômage partiel
				</Link>
			</Body>
			<H2>
				{' '}
				Quelles sont les cotisations sociales à payer pour l'indemnité
				d'activité partielle ?
			</H2>
			<Body>
				L'indemnité d'activité partielle est soumise à la CSG/CRDS et à une
				contribution maladie dans certains cas. Pour en savoir plus, voir la
				page explicative sur{' '}
				<Link
					aria-label={t(
						"le site de l'Urssaf, accéder au site de l'Urssaf, nouvelle fenêtre"
					)}
					href="https://www.urssaf.fr/portail/home/employeur/reduire-ou-cesser-lactivite/la-reduction-ou-la-cessation-tem/lactivite-partielle-dispositif-d/le-regime-social-de-lindemnite-d.html"
				>
					le site de l'Urssaf
				</Link>
				.
			</Body>
		</Trans>
	)
}

function ExplanationSection() {
	const {
		i18n: { language },
		t,
	} = useTranslation()

	const engine = useEngine()
	const net = 'salarié . rémunération . net . à payer avant impôt'
	const netHabituel = 'salarié . activité partielle . net habituel'
	const totalEntreprise = 'salarié . coût total employeur'
	const totalEntrepriseHabituel =
		'salarié . activité partielle . total employeur habituel'

	return (
		<FromTop>
			<div
				css={`
					overflow: hidden;
					margin: 1rem 0;
				`}
			>
				<ComparaisonTable
					rows={[
						['', t('Habituellement'), t('Avec chômage partiel')],
						[
							{ dottedName: net },
							{ dottedName: netHabituel },
							{
								dottedName: net,
								additionalText: language === 'fr' && (
									<span data-test-id="comparaison-net">
										Soit{' '}
										<strong>
											{formatValue(
												catchDivideByZeroError(() =>
													engine.evaluate({
														valeur: `${net} / ${netHabituel}`,
														unité: '%',
														arrondi: 'oui',
													})
												)
											)}
										</strong>{' '}
										du revenu net
									</span>
								),
							},
						],
						[
							{ dottedName: totalEntreprise },
							{ dottedName: totalEntrepriseHabituel },
							{
								dottedName: totalEntreprise,
								additionalText: language === 'fr' && (
									<span data-test-id="comparaison-total">
										Soit{' '}
										<strong>
											{formatValue(
												catchDivideByZeroError(() =>
													engine.evaluate({
														valeur: `${totalEntreprise} / ${totalEntrepriseHabituel}`,
														unité: '%',
														arrondi: 'oui',
													})
												)
											)}
										</strong>{' '}
										du coût habituel
									</span>
								),
							},
						],
					]}
				/>
			</div>
		</FromTop>
	)
}

type ComparaisonTableProps = {
	rows: [Array<string>, ...Array<Line>]
}

type Line = Array<{
	dottedName: DottedName
	additionalText?: React.ReactNode
}>

function ComparaisonTable({ rows: [head, ...body] }: ComparaisonTableProps) {
	const columns = head.filter((x) => x !== '')
	const [currentColumnIndex, setCurrentColumnIndex] = useState(
		columns.length - 1
	)

	const { t } = useTranslation()

	const captionText = (
		<Trans i18nKey="chomagePartiel.tableCaption">
			Tableau indiquant le salaire net et le coût pour l'employeur avec ou sans
			chômage partiel.
		</Trans>
	)

	return (
		<>
			<ResultTable className="mobile-version">
				<caption className="sr-only">{captionText}</caption>
				<thead>
					<tr>
						<th id="emptyTh1"></th>
						<th scope="col">
							<select
								onChange={(evt) =>
									setCurrentColumnIndex(Number(evt.target.value))
								}
								value={currentColumnIndex}
							>
								{columns.map((name, i) => (
									<option value={i} key={i}>
										{name}
									</option>
								))}
							</select>
						</th>
					</tr>
				</thead>
				<tbody>
					{body.map(([label, ...line], i) => (
						<tr key={i}>
							<th scope="row">
								<RowLabel {...label} />
							</th>
							<td>
								<ValueWithLink {...line[currentColumnIndex]} />
							</td>
						</tr>
					))}
				</tbody>
			</ResultTable>
			<ResultTable>
				<caption className="sr-only">{captionText}</caption>
				<thead>
					<tr>
						{head.map((label, i) => (
							<th key={i} scope="col">
								{label || t('Type')}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{body.map(([label, ...line], i) => (
						<tr key={i}>
							<th scope="row">
								<RowLabel {...label} />
							</th>
							{line.map((cell, j) => (
								<td key={j}>
									<ValueWithLink {...cell} />
									{cell.additionalText && (
										<p
											css={`
												text-align: right;
											`}
										>
											{cell.additionalText}
										</p>
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</ResultTable>
		</>
	)
}

function ValueWithLink({ dottedName }: { dottedName: DottedName }) {
	const { language } = useTranslation().i18n
	const engine = useEngine()

	return (
		<RuleLink dottedName={dottedName}>
			{formatValue(engine.evaluate(dottedName), {
				language,
				displayedUnit: '€',
				precision: 0,
			})}
		</RuleLink>
	)
}

function RowLabel({ dottedName }: { dottedName: DottedName }) {
	const target = useEngine().getRule(dottedName)

	return (
		<>
			{' '}
			<div
				css={`
					font-weight: bold;
				`}
			>
				{target.title}
			</div>
			<p>{target.rawNode.résumé}</p>
		</>
	)
}

const ResultTable = styled.table`
	font-family: ${({ theme }) => theme.fonts.main};
	width: 100%;
	border-collapse: collapse;

	th {
		font-weight: initial;
	}

	&.mobile-version {
		display: none;
		@media (max-width: 660px) {
			display: table;
		}
		td,
		th {
			text-align: center;
		}
	}

	&:not(.mobile-version) {
		display: none;
		@media (min-width: 660px) {
			display: table;
		}

		td:nth-child(2),
		th:nth-child(2) {
			font-size: 1em;
			opacity: 0.8;
		}
		td,
		th {
			vertical-align: top;
			text-align: right;
		}
	}

	tbody tr {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	td,
	th {
		padding: 0.8rem 1rem 0;
	}

	td:first-child,
	th:first-child {
		text-align: left;
		p {
			margin-top: 0.2rem;
		}
	}

	th:nth-child(n + 2) {
		white-space: nowrap;
		text-align: right;
		padding: 8px 16px;
	}

	th:first-child {
		width: 100%;
		padding-left: 10px;
		text-align: left;
	}

	td:nth-child(3),
	th:nth-child(2),
	th:nth-child(3) {
		font-weight: bold;
		p {
			font-weight: initial;
		}
	}

	td:last-child,
	th:last-child {
		background: var(--lighterColor);
		color: inherit;
	}
`
