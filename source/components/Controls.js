import React from 'react'
import './Controls.css'

export default ({ blockingInputControls }) => (
	<p className="controls">{blockingInputControls[0].message}</p>
)
