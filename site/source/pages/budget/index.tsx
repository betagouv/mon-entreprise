import * as R from 'effect/Record'
import { useState } from 'react'

import { TrackPage } from '@/components/PianoAnalytics'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import {
	Body,
	Emoji,
	Grid,
	H1,
	H2,
	H3,
	H4,
	Item,
	Li,
	Link,
	Markdown,
	Message,
	Select,
	Spacing,
	Strong,
	Ul,
} from '@/design-system'

import Meta from '../../components/utils/Meta'
import rawBudget from './budget.yaml'
import ResourcesAllocation, {
	Quarter,
	QuarterBudget,
} from './ResourcesAllocation'

export default function Budget() {
	const budget = rawBudget as Record<
		string,
		{ description: string } & Record<Quarter, QuarterBudget>
	>
	const years = Object.keys(budget)

	type yearType = (typeof years)[number]

	const budgetDescriptions = R.map(budget, (year) => year.description)

	const budgetValues = years.reduce((budgetValues, year) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { description: _, ...budgetQuarters } = budget[year]
		if (!Object.keys(budgetQuarters).length) {
			return budgetValues
		}

		return {
			...budgetValues,
			[year]: budgetQuarters,
		}
	}, {}) as Record<yearType, Record<string, Record<string, number>>>

	const [selectedYear, setSelectedYear] = useState<yearType>(
		years[years.length - 1]
	)

	return (
		<>
			<TrackPage chapter1="informations" name="budget" />
			<Meta title="Budget" description="Le budget de mon-entreprise" />
			<ScrollToTop />

			<H1>
				Budget <Emoji emoji="💶" />
			</H1>

			<Body>
				<Strong>Mon-Entreprise</Strong> est un service public numérique, c’est
				pourquoi nous sommes transparents sur les ressources allouées et la
				manière dont elles sont employées.
			</Body>

			<H2>Principes</H2>

			<Body>
				Nous suivons le{' '}
				<Link
					target="_blank"
					rel="noreferrer"
					aria-label="Consulter le manifeste de beta gouv, nouvelle fenêtre"
					href="https://beta.gouv.fr/manifeste"
				>
					manifeste beta.gouv
				</Link>
				dont nous rappelons les principes ici :
			</Body>

			<Message type="info" border={false} icon>
				<Ul>
					<Li>
						Les besoins des utilisateurs sont prioritaires sur les besoins de
						l’administration
					</Li>
					<Li>Le mode de gestion de l’équipe repose sur la confiance</Li>
					<Li>
						L’équipe adopte une approche itérative et d’amélioration en continu
					</Li>
				</Ul>
			</Message>

			<H2>Budget consommé</H2>

			<Grid container>
				<Grid item xs={8} sm={3} lg={2}>
					<Select
						label="Année"
						defaultSelectedKey={selectedYear}
						onSelectionChange={(year) => {
							setSelectedYear(year as (typeof years)[number])
						}}
						data-cy="year-selector"
					>
						{years
							.filter((year) => !!year)
							.map((year) => (
								<Item key={year} textValue={year}>
									{year}
								</Item>
							))}
					</Select>
				</Grid>
			</Grid>

			{budgetDescriptions[selectedYear] && (
				<Body as="div">
					<Markdown>{budgetDescriptions[selectedYear]}</Markdown>
				</Body>
			)}

			{budgetValues[selectedYear] && (
				<>
					<ResourcesAllocation
						selectedYear={selectedYear}
						budget={budgetValues[selectedYear]}
					/>

					<H3>Description des catégories</H3>

					<Ul>
						<Li>
							<Strong>
								Développement <Emoji emoji="👨‍💻" />
							</Strong>
							<Body>
								Les coûts de développement représentent la grande majorité de
								notre budget. Nous sommes une petite équipe de développeurs et
								développeuses freelances, pluridisciplinaires aussi bien sur les
								aspects techniques, stratégiques et métiers. Les rémunérations
								suivent{' '}
								<Link
									target="_blank"
									rel="noreferrer"
									aria-label="Consulter la grille de rémunération de beta gouv, nouvelle fenêtre"
									href="https://doc.incubateur.net/communaute/travailler-a-beta-gouv/recrutement/remuneration"
								>
									la grille de beta.gouv
								</Link>
								.
							</Body>
						</Li>
						<Li>
							<Strong>
								Logiciels et hébergement <Emoji emoji="💻" />
							</Strong>
							<Body>
								Notre modèle open-source nous permet d’accéder gratuitement à la
								majorité des outils que nous utilisons (hébergement de code,
								serveurs de tests, etc.). Le site est hébergé sur{' '}
								<Link
									target="_blank"
									rel="noreferrer"
									aria-label="Site de Netlify, nouvelle fenêtre"
									href="https://www.netlify.com"
								>
									Netlify
								</Link>
								.
								<Spacing md />
								Nous achetons de la documentation spécialisée à destination des
								professionnels du droit pour faciliter le suivi des évolutions
								législatives.
							</Body>
						</Li>
						<Li>
							<Strong>
								Déplacements <Emoji emoji="🚅" />
							</Strong>
							<Body>
								Le réseau des Urssaf est présent dans toute la France. Nous
								organisons plusieurs fois par an des ateliers avec des experts
								en région sur des thématiques particulières. Sont aussi inclus
								dans cette catégorie la prise en charge des frais de déplacement
								des membres de l'équipe qui n'habitent pas en région parisienne.
							</Body>
						</Li>
						<Li>
							<Strong>
								Portage <Emoji emoji="🤝" />
							</Strong>
							<Body>
								La marge du porteur attributaire du marché public de l’Urssaf
								Caisse Nationale, ainsi que les coûts liés à la société
								spécialement créée pour effectuer le portage des indépendants
								qui travaillent sur le site (administration, comptabilité,
								facturation, impôts, etc.).
							</Body>
						</Li>
					</Ul>

					<Message type="info" border={false} icon>
						<H4>À propos de la TVA</H4>
						<Body>
							Contrairement aux entreprises du secteur privé, les
							administrations ne peuvent pas récupérer la TVA supportée sur
							leurs achats dans le cadre de leur activité.
							<Spacing md />
							Le montant TTC inclut la TVA au taux de 20%.
							<Spacing md />
							La TVA est collectée et reversée à l’État et diminue donc le
							montant du budget utilisable sur le projet.
						</Body>
					</Message>
				</>
			)}

			<MoreInfosOnUs />
		</>
	)
}
