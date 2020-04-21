import RulePage from 'Components/RulePage'
import { EngineProvider } from 'Components/utils/EngineContext'
import Engine from 'Engine'
import React from 'react'
import { Route, Switch } from 'react-router'
import { DottedName } from 'Rules'
import RulesList from './RulesList'
import { UseDefaultValuesContext } from './UseDefaultValuesContext'

type DocumentationProps<Names extends string> = {
	basePath: string
	engine: Engine<Names>
	useDefaultValues?: boolean
}

export default function Documentation({
	basePath,
	engine,
	useDefaultValues = false
}: DocumentationProps<DottedName>) {
	return (
		<EngineProvider value={engine}>
			<UseDefaultValuesContext.Provider value={useDefaultValues}>
				<Switch>
					<Route exact path={basePath} component={RulesList} />
					<Route path={basePath + '/:name+'} component={RulePage} />
				</Switch>
			</UseDefaultValuesContext.Provider>
		</EngineProvider>
	)
}
