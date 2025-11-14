import { SimulateurCard } from '@/components/SimulateurCard'
import { Emoji, Item, Select } from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'

import { getFilter } from '../StatsPage'
import { Filter } from '../types'

export function SelectedSimulator(props: { filter: Filter | '' }) {
	const simulateur = Object.values(useSimulatorsData()).find(
		(s) => JSON.stringify(getFilter(s)) === JSON.stringify(props.filter)
	)
	if (!simulateur) {
		return null
	}

	return <SimulateurCard {...simulateur} />
}
export function SimulateursChoice(props: {
	onChange: (ch: Filter | '') => void
	value: Filter | ''
}) {
	const simulateurs = useSimulatorsData()
	const choices = Object.values(simulateurs)
		.filter((s) => getFilter(s))
		.sort((a, b) => (a.shortName < b.shortName ? -1 : 1))
	const defaultSelectedKey = !props.value
		? ''
		: props.value === 'api-rest'
		? 'api-rest'
		: Object.entries(simulateurs).find(
				([, s]) => JSON.stringify(getFilter(s)) === JSON.stringify(props.value)
		  )?.[0] ?? ''

	return (
		<Select
			onSelectionChange={(val) => {
				if (val === '' || val === 'api-rest') {
					return props.onChange(val)
				}
				if (val === null || !(val in simulateurs)) {
					return
				}
				props.onChange(getFilter(simulateurs[val as keyof typeof simulateurs]))
			}}
			defaultSelectedKey={defaultSelectedKey}
			label={'Voir les statistiques pour :'}
			id="simulator-choice-input"
		>
			{[
				<Item key="" textValue="Tout les simulateurs et assistants">
					<Emoji emoji="🌍" />
					&nbsp;Tout les simulateurs et assistants
				</Item>,
				<Item key="api-rest" textValue="API REST">
					<Emoji emoji="👩‍💻" />
					&nbsp;API REST
				</Item>,
				...choices.map((s) => (
					<Item key={s.id} textValue={s.shortName}>
						{s.icône && (
							<>
								<Emoji emoji={s.icône} />
								&nbsp;
							</>
						)}
						{s.shortName}
					</Item>
				)),
			]}
		</Select>
	)
}
