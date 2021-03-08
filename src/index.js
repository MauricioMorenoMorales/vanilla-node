const http = require('http')
const { bodyParser } = require('./lib/bodyParser')

let database = []

function getTaskHandler(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' })
	res.write(JSON.stringify(database))
	res.end()
}

async function createTaskHandler(req, res) {
	try {
		await bodyParser(req)
		database.push(req.body)
		console.log(req.body)
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.write(JSON.stringify(database))
		res.end()
	} catch (err) {
		res.writeHead(400, { 'Content-Type': 'application/json' })
		res.write('Invalid Data')
		res.end()
	}
}

async function updateTaskHandler(req, res) {
	try {
		let { url } = req
		let idQuery = url.split('?')[1] || 'id=1' //id=2
		let idKey = idQuery.split('=')[0] || 'id'
		let idValue = idQuery.split('=')[1] || '1'

		if (idKey === 'id') {
			await bodyParser(req)
			database[idValue - 1] = req.body
			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.write(database)
			res.end()
		} else {
			res.writeHead(200, { 'Content-Type': 'text/plain' })
			res.write('Invalid request query')
			res.end()
		}
		console.log(url)
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.write({ message: 'Received' })
		res.end()
	} catch (err) {
		console.log(err)
		res.writeHead(500, { 'Content-Type': 'application/json' })
		res.write({ message: 'Invalid Body Data was Provided' })
		res.end()
	}
}

const server = http.createServer((req, res) => {
	const { url, method } = req
	//Logger
	console.log(`Url: ${url} - Method: ${method}`)

	switch (method) {
		case 'GET':
			if (url === '/') {
				res.writeHead(200, { 'Content-Type': 'application/json' })
				res.write(JSON.stringify(database))
				res.end()
			}
			if (url === '/tasks') {
				getTaskHandler(req, res)
			}
			break
		case 'POST':
			if (url === '/tasks') {
				createTaskHandler(req, res)
			}
		case 'PUT':
			updateTaskHandler(req, res)

		// case "DELETE":
		// default:
	}
})

server.listen(4444)
console.log('Server on port', 4444)
