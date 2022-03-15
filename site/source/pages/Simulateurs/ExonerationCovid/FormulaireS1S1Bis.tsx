import { EngineContext } from '@/components/utils/EngineContext'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { baseParagraphStyle } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { DottedNames } from 'exoneration-covid'
import Engine, {
	ASTNode,
	Evaluation,
	formatValue,
	PublicodesExpression,
} from 'publicodes'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Row, Table, Tbody, Th, Thead, Tr } from './Table'

const Json = (props: any) => (
	<pre css={{ overflow: 'auto' }}>{JSON.stringify(props, null, 2)}</pre>
)

const Recap = styled.div`
	background: ${({ theme }) => theme.colors.bases.primary[600]};
	border-radius: 0.25rem;
	padding: 1.5rem;
	${baseParagraphStyle}
	line-height: 1.5rem;
	color: white;

	hr {
		border-color: ${({ theme }) => theme.colors.bases.primary[500]};
		margin-bottom: 1rem;
		width: 100%;
	}
`

const Bold = styled.div`
	font-weight: 700;
	margin-bottom: 0.5rem;
`

const Italic = styled.div`
	font-style: italic;
	margin-bottom: 0.5rem;
`

const GrandTotal = styled.div`
	font-size: 1.25rem;
	line-height: 1.5rem;
	font-weight: 700;
`

const Total = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 0.5rem;
`

const getTotalByMonth = (engine: Engine<DottedNames>) => {
	type ParsedSituation = typeof engine.parsedSituation

	const { notMonthSituation, onlyMonthSituation } = Object.entries(
		engine.parsedSituation
	).reduce(
		(acc, [dotName, node]) => {
			if (!dotName.startsWith('mois . ')) {
				acc.notMonthSituation[dotName] = node
			} else {
				acc.onlyMonthSituation[dotName] = node
			}

			return acc
		},
		{
			notMonthSituation: {} as ParsedSituation,
			onlyMonthSituation: {} as ParsedSituation,
		}
	)

	const notMonthEngine = engine.shallowCopy().setSituation(notMonthSituation)

	const missingVarOfLFR1Applicable = Object.fromEntries(
		Object.keys(notMonthEngine.evaluate('LFR1 applicable').missingVariables)
			.map((missingDottedName): [string, ASTNode] | null =>
				engine.parsedSituation[missingDottedName]
					? [missingDottedName, engine.parsedSituation[missingDottedName]]
					: null
			)
			.filter(<T,>(x: T | null): x is T => Boolean(x))
	)

	const ret = Object.fromEntries(
		Object.entries(onlyMonthSituation).map(([monthDottedName, node]) => {
			const targetDottedName =
				'nodeValue' in node && (node.nodeValue as Evaluation<string>)

			const monthEngine = notMonthEngine.shallowCopy().setSituation({
				...notMonthSituation,
				...(targetDottedName === 'LFR1' ? missingVarOfLFR1Applicable : {}),
				[monthDottedName]: node,
			})

			const value = monthEngine.evaluate({ valeur: targetDottedName })

			return [monthDottedName, value]
		})
	)

	return ret
}

export const FormulaireS1S1Bis = ({
	onChange,
}: {
	onChange?: (dottedName: DottedNames, value: PublicodesExpression) => void
}) => {
	const engine = useContext(EngineContext) as Engine<DottedNames>

	const step1Situation = Object.fromEntries(
		Object.entries(engine.parsedSituation).filter(
			([dotName]) => !dotName.startsWith('mois . ')
		)
	)
	const step1Engine = engine.shallowCopy().setSituation(step1Situation)

	const step1LFSS600 = step1Engine.evaluate('LFSS 600')
	const step1LFSS300 = step1Engine.evaluate('LFSS 300')
	const step1LFR1 = step1Engine.evaluate('LFR1')

	const LFSS600 = engine.evaluate('LFSS 600')
	const LFSS300 = engine.evaluate('LFSS 300')
	const LFR1 = engine.evaluate('LFR1')
	const exoS2 = engine.evaluate('exonération S2')
	const total = engine.evaluate('montant total')

	const totalByMonth = getTotalByMonth(engine)

	const { t } = useTranslation()

	const choices = {
		non: [t('Aucun')],
		'LFSS 600': [
			t('Interdiction d’accueil du public (600 €)'),
			t('Baisse d’au moins 50% du chiffre d’affaires (600 €)'),
		],
		'LFSS 600 65%': [
			t('Interdiction d’accueil du public (600 €)'),
			t('Baisse d’au moins 65% du chiffre d’affaires (600 €)'),
		],
		'LFSS 300': [t("Baisse entre 30% à 64% du chiffre d'affaires (300 €)")],
		LFR1: [t('Eligibilité aux mois de mars, avril ou mai 2021 (250 €)')],
	}

	if (!engine.evaluate('mois').nodeValue) {
		return null
	}

	const months = Object.entries(engine.parsedRules).filter(
		([, { explanation: e }]) =>
			e.parents.length === 1 &&
			e.parents[0].nodeKind === 'reference' &&
			e.parents[0].name === 'mois'
	)

	let emptyMonthIndex: number[] = []
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
							<Th alignSelf="center">Situation liée à la crise sanitaire</Th>
							<Th alignSelf="end">Montant de la réduction</Th>
						</Trans>
					</Tr>
				</Thead>

				<Tbody>
					{months.flatMap(([dotName, node], i) => {
						const showRow = engine.evaluate(dotName).nodeValue !== null

						if (isAnyRowShowed && !showRow) {
							emptyMonthIndex.push(i)
						}
						if (!showRow) {
							return []
						}

						isAnyRowShowed = true
						const previousEmptyMonth = emptyMonthIndex.map(
							(i) =>
								months[i] && (
									<Row {...months[i][1]} items={[]} key={months[i][0]} />
								)
						)
						emptyMonthIndex = []

						const items = [step1LFSS600, step1LFSS300, step1LFR1]
							.filter(
								(node) =>
									node.nodeKind === 'reference' &&
									node.dottedName &&
									dotName + ' . ' + node.dottedName in engine.parsedRules &&
									engine.evaluate(dotName + ' . ' + node.dottedName)
										.nodeValue !== null
							)
							.flatMap((node) => {
								if (
									node.nodeKind !== 'reference' ||
									typeof node.dottedName !== 'string'
								) {
									return null
								}

								const name = (dotName + ' . ' + node.dottedName) as DottedNames
								const rawNode = engine.getRule(name).rawNode
								const { percent } = rawNode as { percent?: string }
								const choice = (node.name +
									(percent ? ' ' + percent : '')) as keyof typeof choices

								return choices[choice].map((text, i) => ({
									key: (node.dottedName as string) + `.${i}`,
									text,
								}))
							})
							.filter(<T,>(x: T | null): x is T => Boolean(x))

						items.unshift({ key: 'non', text: choices['non'][0] })

						const astNode = engine.parsedSituation[dotName]
						const total = formatValue(totalByMonth[dotName]) as
							| string
							| null
							| undefined

						return [
							...previousEmptyMonth,
							<Row
								title={node.title}
								label={t('Situation liée à la crise sanitaire')}
								total={
									total && total !== 'non' && total !== 'Pas encore défini'
										? total
										: '-'
								}
								items={items}
								defaultSelectedKey={
									(astNode &&
										'nodeValue' in astNode &&
										(astNode.nodeValue as Evaluation<string>)) ||
									undefined
								}
								onSelectionChange={(key) => {
									const val = (key as string).replace(/\.\d+$/, '')
									onChange?.(dotName as DottedNames, `'${val}'`)
								}}
								key={dotName}
							/>,
						]
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
						<Total>{formatValue(LFSS600)}</Total>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs>
						<Trans>
							<Italic>Baisse entre 30% à 64% du chiffre d'affaires</Italic>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>{formatValue(LFSS300)}</Total>
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
						<Total>{formatValue(LFR1)}</Total>
					</Grid>
				</Grid>

				<hr />

				<Grid container>
					<Grid item xs>
						<Trans>
							<GrandTotal>
								Montant de l’exonération sociale liée à la crise sanitaire sur
								l’année 2021
							</GrandTotal>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>{formatValue(total)}</Total>
					</Grid>
				</Grid>
			</Recap>

			<Json
				LFSS600={formatValue(LFSS600)}
				LFSS300={formatValue(LFSS300)}
				LFR1={formatValue(LFR1)}
				exoS2={formatValue(exoS2)}
				total={formatValue(total)}
			/>
		</>
	)
}
