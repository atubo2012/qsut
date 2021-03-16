let qsut = require('./index.js');


let log = qsut.logger(__filename);
log.info('哈哈哈');
let url1 = '/_open/auth';
let url2 = '/_db';

let body = JSON.stringify({"username":"root","password":"cibouaser"});
qsut.httpRequest('http',{
    host:'127.0.0.1' ,
    port:'8529',
    path:url2,
    //method:'POST',
    // auth:{
    //     username:'root',
    //     password:'ciboauser'
    // },
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Content-Length': Buffer.byteLength(body)
    // }
},body,(result)=>{
    log.info('httpRequesttest',result);
});
function isStrContainedInAarray(arr,str) {

    let ret  = false;
    for(i = 0; i< arr.length;i++){
        if(arr[i] === str){
            ret = true
            break;
        }
    }
    return ret
}

/**
 * From scratch to product
 * 1、Playground: try the api/lib
 * 2、qsut: integrate the api's ability to qsut
 * 3、App: embed the exsiting application
 * 4、Champain: share new feature and get feedback from them
 *
 */
console.log(isStrContainedInAarray(["你好啊","你好你好"],"你好啊"));

console.log(process.memoryUsage())


//https://rapidapi.com/apidojo/api/yahoo-finance1/endpoints
//apiFinanceYahoo(console.log);
async function apiFinanceYahoo(roomOrContact){
    qsut.httpRequest('https',
        {
            host:"apidojo-yahoo-finance-v1.p.rapidapi.com",
            path:"/auto-complete?q=tesla&region=US",
            headers:{
                "x-rapidapi-key": "82fad9b82dmsh97ea72988053168p15a031jsnc3cbd231cf1d",
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "useQueryString": true
            }
        },
        ''
        ,async (result) => {
            let resultObj = JSON.parse(result);
            roomOrContact(resultObj)
        },);
}


//https://api-docs.iqair.com/?version=latest#important-notes
//apiWeatherAirQ(console.log);
async function apiWeatherAirQ(roomOrContact){
    qsut.httpRequest('http',
        {
            host:"api.airvisual.com",
            //path:"/v2/states?country=China&key=29517ad0-8a6a-45f9-be9c-e12850551517",
            //path:"/v2/cities?country=China&state=Shanxi&key=29517ad0-8a6a-45f9-be9c-e12850551517",
            path:"/v2/city?country=China&state=Gansu&city=wuwei&key=29517ad0-8a6a-45f9-be9c-e12850551517",
            //path:"/v2/stations?country=China&state=Shanghai&city=Songjiang&key=29517ad0-8a6a-45f9-be9c-e12850551517",

        },
        ''
        ,async (result) => {
            let resultObj = JSON.parse(result);
            roomOrContact(resultObj.data.current.pollution)
        },);
}


//https://rapidapi.com/spoonacular/api/recipe-food-nutrition?endpoint=57d3f037e4b0bf08d74df7f5
apiRandomRecipe(console.log);

/**
 * Get a Radom recipe
 * 1. get recipe content
 * 2. download images
 * 3. emit event: image-download-ok
 * 4.
 * @param roomOrContact
 * @returns {Promise.<void>}
 */
async function apiRandomRecipe(roomOrContact){
    qsut.httpRequest('https',
        {
            host:"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            path:"/recipes/random?number=1",
            headers:{
                "x-rapidapi-key": "82fad9b82dmsh97ea72988053168p15a031jsnc3cbd231cf1d",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "useQueryString": true
            }
        },
        ''
        ,async (result) => {
            let ro = (JSON.parse(result)).recipes[0];
            roomOrContact(
                ro.title+'\n',
                ro.summary+'\n',
                ro.diets+'\n',
                ro.dishTypes+'\n',
                ro.instructions+'\n',
                // ro.extendedIngredients.forEach((item,index,)=>{
                //         console.log(index+1,item)
                //     }),+'\n',
                // ro.analyzedInstructions[0].steps.forEach((item,index,)=>{
                //     console.log(index+1,item.step)
                // }),
                ro.image);

            qsut.downloadImage(ro.image)

        },);
}










