const http = require('http');
const fs = require('fs');
const requests = require('requests');

var homePage = fs.readFileSync("index.html", 'utf-8');

// Random Number Function
var randNum = (min, max) => {
    let rnum = Math.floor(Math.random() * (max - min) + min);
    return rnum;
}

// Replacing Values in HomePage
const replaceVal = (oldVal, orgVal, author) => {
    let quote = oldVal.replace("{%quotes%}", orgVal);
    quote = quote.replace("{%author%}", author);

    return quote;  // Updated HomePage
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("https://type.fit/api/quotes").on("data", (chunk) => {

            // JSON --> JS Obj
            const jsonData = JSON.parse(chunk);  // data in Array Format

            // Generating Random Number
            var randNumber = randNum(0, 1600);

            var newQuote = jsonData[randNumber].text;
            var author = jsonData[randNumber].author;
            if (author == null) {
                author = "unknown";
            }

            const realTimeQuote = replaceVal(homePage, newQuote, author);
            res.write(realTimeQuote);
        }).on("end", (err) => {
            if (err) return console.log('connection closed due to errors', err);

            res.end();
        });
    } else {
        // If someOne hit wrong URL
        res.writeHead(404, { "Content-type": "text/html" });
        res.end("<h1 style='color:red;'>404 Page Not Found</h1>");
    }

})

server.listen("80", "127.0.0.1", () => {
    console.log("Server started at port 80");
})