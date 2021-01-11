var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

const puppeteer = require('puppeteer');

const dotenv = require('dotenv');
dotenv.config();

function crawler(){
    (async () => {
        console.log("init");
        const client = await mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(err => {
            console.log(err);
        });
    
        const db = client.db('crawler');
        const log = db.collection('log');
        const dte = db.collection('dataToExtractv2');
        headMode = true;
        if (headlessMode == "false"){
            headMode = false;
        }
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
            headless: headMode,
            slowMo: 10 // slow down by x mseconds
        });
        //await page.waitForSelector('#SomeSelector');
        const delay = (timeout) => {
            timeout = timeout * timeoutD;
            return new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });
        };
    
        try {
            const page = await browser.newPage();
            //await page.setViewport({ width: 1600, height: 1024, deviceScaleFactor: 2 });
            //var string = new TextDecoder("utf-8").decode();
            //console.log(Utf8ArrayToStr(docs[0]['value']["_id"]["id"]));
            console.log(docs)
            fs.mkdir('utils/captchaLeg/' +docs[0]["number"], {
                recursive: true
            }, (err) => {
                if (err) console.log(`Error creating directory: ${err}`)
                // Directory now exists.
            });
            await page.goto("https://eproc.jfrj.jus.br/eproc/externo_controlador.php?acao=processo_consulta_publica");
            await delay(10000);
            const page2 = await browser.newPage();
            await page2.goto('https://eproc.jfrj.jus.br/eproc/lib/captcha/Captcha.php', timeout = 0);
            
    
            await browser.close();
        } catch (error) {
    
            
            if (!powerKey){    
                powerKey = true;
                for (doc in docs) {
                    id = docs[doc]['number'];
                    console.log("RPV!");
                    
                    await dte.updateOne({
                        number: id
                    }, {
                        $set: {
                            "status": "IN",
                            "lastModification": year + "-" + month + "-" + date
                        }
                    }, function (err, r) {
                        if (err) throw err;
    
                    });
                }
            }
            await browser.close();
            console.log(error);
    
        } finally {
            await client.close();
            await browser.close();
        }
        //TODO verify if can send a message of error or not, and send
    })();
}

router.get("/", function(request, response) {
    //const operadora = request.body.operadora.trim();
    crawler();
    console.log(request.body); //This prints the JSON document received (if it is a JSON document)
    response.send('1'); // echo the result back
});

module.exports = router;