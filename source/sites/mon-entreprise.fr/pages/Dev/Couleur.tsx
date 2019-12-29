import {
	ThemeColorsContext,
	ThemeColorsProvider
} from 'Components/utils/colors'
import React, { Suspense, useContext, useState } from 'react'
import Home from '../Iframes/SimulateurEmbauche'
let LazyColorPicker = React.lazy(() => import('./ColorPicker'))

export default function Couleur() {
	const { color: defaultColor } = useContext(ThemeColorsContext)
	const [color, setColor] = useState(defaultColor)
	return (
		<>
			<h1>Changez la couleur de l'integration </h1>
			<p className="indication">
				Visualisez sur cette page l’apparence du module pour différentes
				couleurs principales.
			</p>
			<Suspense fallback={<div>Chargement...</div>}>
				<LazyColorPicker color={color} onChange={setColor} />
			</Suspense>
			<p className="indication">
				La couleur sélectionnée, à déclarer comme attribut
				&quot;data-couleur&quot; du script sur votre page est : <b>{color}</b>
			</p>
			<div className="ui__ card">
				<ThemeColorsProvider color={color}>
					<Home />
				</ThemeColorsProvider>
			</div>
		</>
	)
}
