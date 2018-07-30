import React from 'react'

let {
	Consumer: ShowValuesConsumer,
	Provider: ShowValuesProvider
} = React.createContext(false)

export { ShowValuesConsumer, ShowValuesProvider }
