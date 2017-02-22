import React from 'react'

export default ({type}) => <span id="page-type">
	<i className={"fa fa-" + (type == 'simulation' ? 'calculator' : 'cogs')} aria-hidden="true"></i>
	<span>{type}</span>
</span>
