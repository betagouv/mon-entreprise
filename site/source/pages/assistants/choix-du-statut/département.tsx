import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

export default function Département() {
	return (
		<>
			<Layout title="Où souhaitez-vous exercer votre activité ?">
				<Navigation currentStepIsComplete />
			</Layout>
		</>
	)
}
