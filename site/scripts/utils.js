const path = require('path')
const fs = require('fs')
const dataDir = path.resolve(__dirname, '../source/data/')

exports.createDataDir = () => {
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir)
	}
}

exports.writeInDataDir = (filename, data) => {
	fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2))
}
