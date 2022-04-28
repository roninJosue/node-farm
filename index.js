const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////
/// SERVER



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  const {pathname, searchParams} = new URL(req.url, `http://${req.headers.host}/`)
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    })

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

    res.end(output)
  } else if (pathname === '/product') {
    res.writeHead(200, {'Content-type': 'text/html'})

    const product = dataObj[searchParams.get('id')]
    const output = replaceTemplate(tempProduct, product)

    res.end(output)
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    })
    res.end(data)
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    res.end('<h1>Page not found!!</h1>')
  }
});

server.listen(3200, '127.0.0.1', () => {
  console.log("Listening on port 3200")
})