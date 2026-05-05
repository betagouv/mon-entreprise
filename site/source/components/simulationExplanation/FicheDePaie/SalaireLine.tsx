import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import Value from '@/components/EngineValue/Value'

import { Titre } from './styledComponents'

type Props = {
	rule: RègleModèleSocial | RègleModèleAssimiléSalarié
	title?: string
}

export const SalaireLine = ({ rule, title }: Props) => (
	<Container>
		<Titre>
			{title}
			<ExplicableRule light dottedName={rule} />
		</Titre>
		<Value linkToRule={false} expression={rule} unit="€" displayedUnit="€" />
	</Container>
)

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: end;
`
