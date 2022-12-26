const http = require('http');
const url = require('url');
const fs = require('fs');

const slugify = require('slugify');
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate.js`); //commonjs module

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data); //json data into js object or array

const slugs = dataObj.map((el) => {
  slugify(el.productName, { lower: true });
});
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); //destructuring object
  //url.parse:function to parse the url.used to find variables from url.try consoling the function url.parse(req.url,true).

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    ///cardshtml will cbe a string of all html (basically all elements of array dataobj have gone through the funciton using map so it created an array of string html templates for each element and then we join to form one large string)

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }

  //product page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //Api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'applications/json' });
    res.end(data);
  }
  //Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page Not Found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to the req on port 8000');
});
