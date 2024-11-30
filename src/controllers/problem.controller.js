import scrapeProblem from "../utils/scraping/problem.util.js";

export default async function getProblemDetails(req,res){
    try {
        const {problemSlug} = req.query;
        if(!problemSlug)
            return res.status(400).json({error:"Problem Slug is missing!!"});
        
        const scrapingOutput = await scrapeProblem(problemSlug);
        return res.status(200).json(scrapingOutput);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }

}