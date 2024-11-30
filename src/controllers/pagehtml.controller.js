import scrapeHTML from "../utils/scraping/baseHTML.scraping.util.js";

export default async function getPageHTML(req,res){
    try {
        const {problemSlug} = req.query;
        if(!problemSlug)
            return res.status(400).json({error:"Problem Slug is missing!!"});
        
        const scrapingOutput = await scrapeHTML(problemSlug);
        return res.status(200).json(scrapingOutput);
    } catch (error) {
        return res.status(500).json({error:error.message});
    }

}