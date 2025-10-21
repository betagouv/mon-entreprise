import { styled } from 'styled-components'

import { FlexCenter, Spinner } from '@/design-system'

export default function Loader() {
	return (
		<Container
			style={{ height: '300px', alignItems: 'center' }}
			className="print-hidden"
		>
			<Spinner />
		</Container>
	)
}

const Container = styled.div`
	${FlexCenter}
	justify-content: center;
	height: 300px;
`
