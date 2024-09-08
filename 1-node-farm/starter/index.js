const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemp = require('./modules/replaceTemp');

////////////////////////////////////////////////////////////////
// Files
// Blocking Sync Way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the file: ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File is written');

// Non-blocking  Async Way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error message');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `Derek wrote:\n"${data2}"\n"${data3}"\n${Date.toString()}`, 'utf-8', err => {
//                 console.log('File written');
//             });
//         });
//     });
// });
// console.log('I love Node and JS');

////////////////////////////////////////////////////////
// Server

const data = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCards = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //ROOT & OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemp(tempCards, el))
      .join('');
    const output = tempOverview.replace(
      '{%PRODUCT_CARDS%}',
      cardsHtml
    );
    res.end(output);

    // PRODUCTS PAGE
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const output = replaceTemp(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    console.log(data);
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // PAGE NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request');
});
