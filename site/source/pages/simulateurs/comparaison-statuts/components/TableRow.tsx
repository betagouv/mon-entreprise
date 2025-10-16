import Engine from 'publicodes'
import { ComponentProps } from 'react'

import Value from '@/components/EngineValue/Value'
import { H3 } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

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

export default TableRow
