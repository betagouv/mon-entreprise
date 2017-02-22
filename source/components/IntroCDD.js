import React from 'react'
import colours from './themeColours'
import PageTypeIcon from './PageTypeIcon'

export default () =>
	<div>
		<PageTypeIcon type="simulation"/>
		<h1>Simulateur CDD</h1>
		<section id="introduction">
			<p>
				Le CDD en France est un contrat d'exception au CDI, apportant à l'employeur plus de souplesse dans un cadre précis prévu par la loi. Souvent, des contreparties financières lui sont demandées. Ce simulateur vous aidera à les calculer.
			</p>
			<p>
				Ici, vous avez le droit de ne pas savoir : certains termes utilisés dans la simulation ne sont pas évidents, cliquez simplement sur le symbôle • pour ouvrir une aide contextuelle. Et n'hésitez pas à nous écrire &nbsp;<i style={{cursor: 'pointer'}} className="fa fa-envelope-o"></i>
			</p>
			{/*
				<p>
				*: écrivez à contact@contact.contact (on fera mieux après). La loi française est complexe, souvent à raison. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
			</p>
			*/}
		</section>
	</div>
