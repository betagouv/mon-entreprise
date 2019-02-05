import React, { Suspense } from 'react';
import Home from './Home';

let LazyColorPicker = React.lazy(() => import('./ColorPicker'))

const Couleur = () => {
	const colour = 1;
	return (<div className="ui__ container">
		<p className="indication">
			Visualisez sur cette page l’apparence du module pour différentes
			couleurs principales.
		</p>
		<Suspense fallback={<div>Chargement...</div>}>
			<LazyColorPicker
				color={this.props.couleur}
				onChangeComplete={this.changeColour}
				/>
		</Suspense>
		<p className="indication">
			La couleur sélectionnée, à déclarer comme attribut
			&quot;data-couleur&quot; du script sur votre page est :{' '}
			<b>{this.props.couleur}</b>
		</p>
		<Home />
	</div>)
			}

export default Couleur