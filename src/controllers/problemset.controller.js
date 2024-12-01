import scrapeProblem from "../utils/scraping/problem.util.js";
import scrapeProblemSet from "../utils/scraping/problemset.util.js";

export default async function getProblemSet(req,res){      
    try {
        const {page=1,detailed=false} = req.query;
        if(page<=0)
            return res.status(400).json({error:"Page should be greater than 0!!"});

        const problemSetInfo = await scrapeProblemSet(page);
        if(problemSetInfo.error)
            return res.status(500).json(problemSetInfo);
        if(!detailed)
            return res.status(200).json(problemSetInfo);

        const totalProblems = problemSetInfo.problems.length;
        let detailedResponse = [];
        for(let problemIndex=0; problemIndex<totalProblems; problemIndex++){
            const problemDetails = await scrapeProblem(problemSetInfo.problems[problemIndex].slug);
            console.log("Done with problem",problemIndex);
            const problemScrapingStatus = problemDetails.error ? 500 : 200;
            detailedResponse.push({status:problemScrapingStatus,output:problemDetails});
        }
        return res.status(200).json(detailedResponse);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
  
}
