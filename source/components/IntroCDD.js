import React from 'react'
import colours from './themeColours'

export default () =>
	<div>
		<h1 style={{color: colours().colour}}>Simulateur CDD</h1>
		<section id="introduction">
			<p>
				Le CDD en France est un contrat d'exception au CDI, apportant à l'employeur plus de souplesse dans un cadre précis prévu par la loi. Dans un certain nombre de cas, une contrepartie financière lui est demandée. Ce simulateur vous aidera à la calculer.
			</p>
			<p>
				Ici, vous avez le droit de ne pas savoir : certaines questions sont complexes, elles seront toujours accompagnées d'une aide contextuelle. Si ce n'est pas le cas, écrivez-nous &nbsp;<i style={{cursor: 'pointer'}} className="fa fa-envelope-o"></i>  !
			</p>
			{/*
				<p>
				*: écrivez à contact@contact.contact (on fera mieux après). La loi française est complexe, souvent à raison. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
			</p>
			*/}
		</section>
	</div>
