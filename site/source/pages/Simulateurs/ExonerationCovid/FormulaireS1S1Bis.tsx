import Value from '@/components/EngineValue'
import {
	Situation,
	useSituationState,
} from '@/components/utils/SituationContext'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Grid } from '@mui/material'
import { ExoCovidDottedNames } from 'exoneration-covid'
import Engine, { EvaluatedNode, PublicodesExpression } from 'publicodes'
import { Key, useRef } from 'react'
import { Trans } from 'react-i18next'
import { useExoCovidEngine } from '.'
import { Bold, GridTotal, Italic, Recap, RecapExpert, Total } from './Recap'
import { Row, Table, Tbody, Th, Thead, Tr } from './Table'

const getTotalByMonth = (
	engine: Engine<ExoCovidDottedNames>,
	situation: Situation<ExoCovidDottedNames>
) => {
	const ret = Object.fromEntries(
		Object.entries(situation)
			.filter(([monthDottedName]) => monthDottedName.startsWith('mois . '))
			.map(([monthDottedName]) => {
				const parsedRules = engine.getParsedRules()

				const exoSelected = (
					engine.evaluate(monthDottedName) as EvaluatedNode<string>
				).nodeValue

				const exoApplicable =
					typeof exoSelected === 'string' &&
					monthDottedName + ' . ' + exoSelected in parsedRules &&
					engine.evaluate(monthDottedName + ' . ' + exoSelected).nodeValue

				if (
					!exoApplicable ||
					!(exoSelected + ' . montant mensuel' in parsedRules)
				) {
					return [monthDottedName, undefined]
				}

				const value = engine.evaluate(
					exoSelected + ' . montant mensuel'
				) as EvaluatedNode<number>

				return [monthDottedName, value]
			})
	)

	return ret
}

interface Props {
	onChange?: (
		dottedName: ExoCovidDottedNames,
		value: PublicodesExpression
	) => void
}

export const FormulaireS1S1Bis = ({ onChange }: Props) => {
	const engine = useExoCovidEngine()
	const { situation = {} } = useSituationState<ExoCovidDottedNames>()

	const selectedKey = useRef<{ [key: string]: Key | undefined }>({})

	const totalByMonth = getTotalByMonth(engine, situation) ?? {}

	if (!engine.evaluate('mois').nodeValue) {
		return null
	}

	const months = Object.entries(engine.getParsedRules()).filter(([name]) =>
		name.match(/^mois \. [^.]*$/)
	)

	let isAnyRowShowed = false

	return (
		<>
			<H3>
				<Trans>
					Quelle était votre situation liée à la crise sanitaire durant vos mois
					d’activité ?
				</Trans>
			</H3>
			<Table>
				<Thead>
					<Tr>
						<Trans>
							<Th>Mois</Th>
							<Th>Situation liée à la crise sanitaire</Th>
							<Th>Montant de la réduction</Th>
						</Trans>
					</Tr>
				</Thead>

				<Tbody>
					{months.map(([dotName, node], i) => {
						const showRow = engine.evaluate(dotName).nodeValue !== null

						if (!showRow) {
							if (isAnyRowShowed) {
								return (
									<Row
										{...months[i][1]}
										actualMonth={dotName}
										dottedNames={[]}
										key={months[i][0]}
									/>
								)
							}

							return null
						}
						isAnyRowShowed = true

						return (
							<Row
								actualMonth={dotName}
								dottedNames={['LFSS 600', 'LFSS 300', 'LFR1']}
								title={node.title}
								total={totalByMonth[dotName]}
								defaultSelectedKey={selectedKey.current[dotName]}
								onSelectionChange={(key) => {
									selectedKey.current[dotName] = key
									const val = (key as string).replace(/\.\d+$/, '')
									onChange?.(dotName as ExoCovidDottedNames, `'${val}'`)
								}}
								key={dotName}
							/>
						)
					})}
				</Tbody>
			</Table>

			<Spacing lg />

			<Recap>
				<Grid container>
					<Grid item xs>
						<Trans>
							<Bold>
								Dispositif loi de financement de la sécurité sociale (LFSS) pour
								2021
							</Bold>

							<Italic>
								Mesure d’interdiction d’accueil du public ou baisse d’au moins
								50% (ou 65% à compter de décembre 2021) du chiffre d’affaires
							</Italic>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>
							<Value
								engine={engine}
								expression="LFSS 600"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs>
						<Trans>
							<Italic>Baisse entre 30% et 64% du chiffre d'affaires</Italic>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>
							<Value
								engine={engine}
								expression="LFSS 300"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</Grid>

				<hr />

				<Grid container>
					<Grid item xs>
						<Trans>
							<Bold>
								Dispositif loi de finances rectificative (LFR1) pour 2021
							</Bold>

							<Italic>Éligibilité aux mois de mars, avril ou mai 2021</Italic>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>
							<Value
								engine={engine}
								expression="LFR1"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</Grid>

				<hr />

				<GridTotal container>
					<Grid item xs>
						<Trans>
							Montant de l’exonération sociale liée à la crise sanitaire pour
							les cotisations de l’année 2021
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>
							<Value
								engine={engine}
								expression="montant total"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</GridTotal>
			</Recap>

			<Trans>
				<H3>Résumé</H3>

				<RecapExpert>
					<Li>
						Secteur d'activité dont relève l'activité principale :{' '}
						<Bold as="span">{engine.evaluate('secteur').nodeValue}</Bold>
					</Li>
					<Li>
						Activité exercée en{' '}
						<Bold as="span">
							{engine.evaluate("lieu d'exercice").nodeValue}
						</Bold>
					</Li>
					<Li>
						Début d'activité :{' '}
						<Bold as="span">
							{engine.evaluate("début d'activité").nodeValue}
						</Bold>
					</Li>
					<Li>
						Nombres de mois pour lesquels vous remplissez les conditions
						d'éligibilité
						<Ul>
							<Li>
								LFSS :{' '}
								<Bold as="span">
									<Value
										engine={engine}
										expression="LFSS . mois éligibles"
										linkToRule={false}
										precision={0}
									/>
								</Bold>
							</Li>
							<Li>
								LFR1 :{' '}
								<Bold as="span">
									<Value
										engine={engine}
										expression="LFR1 . mois éligibles"
										linkToRule={false}
										precision={0}
									/>
								</Bold>
							</Li>
						</Ul>
					</Li>
				</RecapExpert>
			</Trans>
		</>
	)
}
