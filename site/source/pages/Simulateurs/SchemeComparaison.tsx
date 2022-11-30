import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { ComponentProps, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import Value from '@/components/EngineValue'
import PeriodSwitch from '@/components/PeriodSwitch'
import { StyledGrid } from '@/components/SchemeComparaison'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import Emoji from '@/components/utils/Emoji'
import { useEngine, useRawSituation } from '@/components/utils/EngineContext'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Spacing } from '@/design-system/layout'
import { H2, H3 } from '@/design-system/typography/heading'
import { Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

import Documentation from '../Documentation'
import { configComparateurStatuts } from './configs/comparateurStatuts'

export default function SchemeComparaisonPage() {
	const engine = useEngine()
	const situation = useRawSituation()

	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		path: absoluteSitePaths.simulateurs.comparaison,
		config: configComparateurStatuts,
	})

	const assimiléEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . catégorie juridique': "'SAS'",
				'entreprise . catégorie juridique . SAS . unipersonnelle': 'oui',
			}),
		[situation]
	)
	const autoEntrepreneurEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . catégorie juridique': "'EI'",
				'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
			}),
		[situation]
	)
	const indépendantEngine = useMemo(
		() =>
			engine.shallowCopy().setSituation({
				...situation,
				'entreprise . catégorie juridique': "'EI'",
				'entreprise . catégorie juridique . EI . auto-entrepreneur': 'non',
			}),
		[situation]
	)

	const engines = [
		assimiléEngine,
		autoEntrepreneurEngine,
		indépendantEngine,
	] as [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]

	return (
		<Routes>
			<Route
				path="SASU/*"
				element={
					<>
						<Documentation
							engine={assimiléEngine}
							documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
						/>
					</>
				}
			/>
			<Route
				path="EI/*"
				element={
					<Documentation
						engine={indépendantEngine}
						documentationPath="/simulateurs/comparaison-régimes-sociaux/EI"
					/>
				}
			/>
			<Route
				path="auto-entrepreneur/*"
				element={
					<Documentation
						engine={autoEntrepreneurEngine}
						documentationPath="/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur"
					/>
				}
			/>
			<Route
				path=""
				element={
					<>
						<Intro>
							<Trans i18nKey="comparaisonRégimes.description">
								Lorsque vous créez votre société, le choix du statut juridique
								va déterminer à quel régime social le dirigeant est affilié. Il
								en existe trois différents, avec chacun ses avantages et
								inconvénients. Avec ce comparatif, trouvez celui qui vous
								correspond le mieux.
							</Trans>
						</Intro>
						<Comparateur engines={engines} />
					</>
				}
			/>
		</Routes>
	)
}

type ComparateurProps = {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}

function Comparateur({ engines }: ComparateurProps) {
	return (
		<>
			<Simulation engines={engines} hideDetails showQuestionsFromBeginning>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend={'Estimations sur votre rémunération brute et vos charges'}
				>
					<SimulationGoal dottedName="entreprise . chiffre d'affaires" />
					<SimulationGoal dottedName="entreprise . charges" />
				</SimulationGoals>
			</Simulation>
			<Spacing md />
			<StyledGrid>
				<H3 className="AS">
					<Emoji emoji="☂" /> <Trans>SASU</Trans>
				</H3>
				<H3 className="indep">
					<Emoji emoji="👩‍🔧" /> <Trans>EI / EURL</Trans>
				</H3>
				<H3 className="auto">
					<Emoji emoji="🚶‍♂️" /> <Trans>Auto-entrepreneur</Trans>
				</H3>

				<TableRow
					dottedName="dirigeant . rémunération . net . après impôt"
					unit="€/mois"
					precision={0}
					engines={engines}
				/>

				<H2 className="all">
					<Spacing lg /> Retraite
				</H2>

				<TableRow
					dottedName="protection sociale . retraite . trimestres"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . retraite . base . cotisée"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . retraite . complémentaire"
					engines={engines}
				/>

				<H2 className="all">
					<Spacing lg /> Santé
				</H2>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie"
					precision={0}
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie . délai d'attente"
					engines={engines}
				/>
				<TableRow
					dottedName="protection sociale . maladie . arrêt maladie . délai de carence"
					engines={engines}
				/>
			</StyledGrid>
		</>
	)
}

function TableRow({
	dottedName,
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
	precision,
	unit,
}: {
	dottedName: DottedName
	engines: readonly [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
} & Pick<ComponentProps<typeof Value>, 'precision' | 'unit'>) {
	return (
		<>
			<H3 className="legend">{assimiléEngine.getRule(dottedName).title}</H3>
			<div className="AS">
				<Value
					engine={assimiléEngine}
					expression={dottedName}
					documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
					precision={precision}
					unit={unit}
				/>
			</div>
			<div className="indep">
				<Value
					engine={indépendantEngine}
					expression={dottedName}
					documentationPath="/simulateurs/comparaison-régimes-sociaux/EI"
					precision={precision}
					unit={unit}
				/>
			</div>
			<div className="auto">
				<Value
					engine={autoEntrepreneurEngine}
					expression={dottedName}
					documentationPath="/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur"
					precision={precision}
					unit={unit}
				/>
			</div>
		</>
	)
}
