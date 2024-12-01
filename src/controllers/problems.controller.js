import scrapeProblem from "../utils/scraping/problem.util.js";
import { Builder} from 'selenium-webdriver';
import { chromeOptions } from "../constants.js";

export default async function getBatchProblemDetails(req,res){
    let driver;
    try{
       driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
       const slugs = req.query.slugs.split(',');
       const totalProblems = slugs.length;
       const scrapingResults = [];
       for(let i=0; i<totalProblems; i++){
           const problemScrapingOutput = await scrapeProblem(slugs[i]);
           const problemScrapingStatus = problemScrapingOutput.error ? 500 : 200;
           scrapingResults.push({status:problemScrapingStatus,output:problemScrapingOutput});
           console.log(i,problemScrapingStatus);
       }
        
       return res.status(200).json(scrapingResults);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
    finally{
        if(driver){
            driver.quit();
        }
    }
}