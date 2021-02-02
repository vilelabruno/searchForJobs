var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
const notifier = require('node-notifier');

const mongo = require('mongodb').MongoClient;
const puppeteer = require('puppeteer');

const dotenv = require('dotenv');
dotenv.config();

function crawler(){
    (async () => {
        console.log("init");
        headMode = true;
        const client = await mongo.connect("mongodb://localhost:27017/jobs");

        const db = client.db('jobs');
        const fb = db.collection('fb');
    
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            userDataDir: "./session",
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
            while(true){
                await page.goto("https://facebook.com/");
                await page.waitForTimeout(5000);
                console.log("Pagging Down");
                for (var i = 0; i < 100; i++){
                    await page.keyboard.press("PageDown");
                    await page.waitForTimeout(1000);
                }
                await page.waitForTimeout(5000);
                var cards = await page.evaluate(()=>{
                    all = document.querySelector('[role="feed"]').querySelectorAll('[data-pagelet="FeedUnit_{n}"');
                    contains = ["inbox", "oportunidade", "whatsapp", "desenvolvedor", "freela", "freelancer", "job", "sistema", "desenvolvimento", "programa", "preciso", "necessito", "desenvolver", "programador", "aplicativo", "aplicação", "contato", "contate", "skype", "telegram", "email"];
                    notContains = ["resolvido"];
                    cards = []
                    for (var i=0, max=all.length; i < max; i++) {
                        cardStrings = all[i].innerText.split(" ");
                        for (var j = 0; j < contains.length; j++){
                            for (var z = 0; z < cardStrings.length; z++){
                                if (cardStrings[z].toLowerCase == contains[j].toLowerCase){
                                    checkContains = true;
                                    for (var b = 0; b < notContains.length; b++){
                                        if (cardStrings[z].toLowerCase == notContains[j].toLowerCase){
                                            checkContains = false;
                                        }
                                    }
                                    if(checkContains){
                                        links = all[i].getElementsByClassName("oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p");
                                        for (var a = 0; a < links.length; a++){
                                            cards.push([links[a].href, all[i].innerText]);
                                        }
                                    }
                                }
                            }
                        }                    
                        buttons = all[4].querySelectorAll('[role="button"]');
                    
                        //console.log(all[i].innerText);
                    }
                    return cards;
                });
                await page.waitForTimeout(8000);
                console.log(cards);
                for (var i = 0; i < cards.length; i++){
                    //notifier.notify(
                    //    {
                    //      title: 'I think that this is interesting!',
                    //      message: cards[i],
                    //      icon: '../bot.jpg', // Absolute path (doesn't work on balloons)
                    //      sound: true, // Only Notification Center or Windows Toasters
                    //      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                    //    },
                    //    function (err, response, metadata) {
                    //      // Response is response from notification
                    //      // Metadata contains activationType, activationAt, deliveredAt
                    //    }
                    //);
                    try{
                        await fb.insertOne({
                            "links": cards[i][0],
                            //"createtime": new Timestamp(),
                            "text": cards[i][1],
                        });
                    }catch(e){
                        console.log("duplicado");
                    }
                    await page.waitForTimeout(1000);
                }
                
                // f5
                await page.waitForTimeout(10000);
            }
    
            await browser.close();
        } catch (error) {
    
    
        } 
        //TODO verify if can send a message of error or not, and send
    })();
}
crawler();
router.get("/", function(request, response) {
    //const operadora = request.body.operadora.trim();
    crawler();
    console.log(request.body); //This prints the JSON document received (if it is a JSON document)
    response.send('1'); // echo the result back
});

module.exports = router;