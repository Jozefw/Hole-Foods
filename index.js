const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/ReplaceTemplate');



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);
const templateOv = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProd = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const slugs = dataObj.map(name => slugify(name.productName, {
    lower: true
}));
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query,pathname} = url.parse(req.url, true)

    // Overview page  
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(item => replaceTemplate(tempCard, item)).join('');
        const output = templateOv.replace('{%PRODUCT_CARD%}', cardsHtml)
        res.end(output)

        // Product page 
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        output = replaceTemplate(templateProd, product)
        res.end(output)

        // API 
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data)

    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'My-type': 'Janky Plan',
        })
        res.end("<h1>No pages!!!</h1>")
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Server Started listening on port 8000')
})