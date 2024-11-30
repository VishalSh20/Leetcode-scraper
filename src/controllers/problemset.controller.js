import scrapeProblemSet from "../utils/scraping/problemset.util.js";

export default async function getProblemSet(req,res){
    try {
        const {page=1} = req.query;
        if(page<=0)
            return res.status(400).json({error:"Page should be greater than zero!!"});
        
        const scrapingOutput = await scrapeProblemSet(page);
        return res.status(200).json(scrapingOutput);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }

}