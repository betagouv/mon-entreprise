import { CMGProvider } from '@/contextes/cmg'

const CMG = () => {
	return <></>
}

const CMGWithProvider = () => (
	<CMGProvider>
		<CMG />
	</CMGProvider>
)

export default CMGWithProvider
