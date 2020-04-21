import React from 'react'

export const ShowValuesContext = React.createContext(false)

const {
	Consumer: ShowValuesConsumer,
	Provider: ShowValuesProvider
} = ShowValuesContext
export { ShowValuesConsumer, ShowValuesProvider }
