import scrapeProblem from "../utils/scraping/problem.util.js";

export default async function getProblemDetails(req,res){
    try {
        const {slug} = req.query;
        if(!slug)
            return res.status(400).json({error:"Problem Slug is missing!!"});
        
        const scrapingOutput = await scrapeProblem(problemSlug);
        const scrapingStatus = scrapingOutput.error ? 500 : 200;
        return res.status(scrapingStatus).json(scrapingOutput);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

