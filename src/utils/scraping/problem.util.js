import {By, until } from 'selenium-webdriver';
import { driver } from '../../app.js';

function findExamples(exampleText){
    let examples = [];
    let index = 0;
    while(index<exampleText.length){
        const inputStartIndex = exampleText.indexOf("Input:",index);
        const outputStartIndex = exampleText.indexOf("Output:",index);
        let explanationStartIndex = exampleText.indexOf("Explanation:",index);
        const nextExampleIndex = exampleText.indexOf("Example",inputStartIndex);
        index = nextExampleIndex!=-1 ? nextExampleIndex : exampleText.length;
        explanationStartIndex = explanationStartIndex!=-1 ? explanationStartIndex : index;
        
        const inputText = exampleText.substring(inputStartIndex+"Input:".length,outputStartIndex).trim();
        const outputText = exampleText.substring(outputStartIndex+"Output:".length,explanationStartIndex).trim();
        const explanation = exampleText.substring(explanationStartIndex,index).substring("Explanation:".length).trim();
        examples.push({inputText,outputText,explanation});
    }
    return examples;
}

export default async function scrapeProblem(slug) {
    try {
        const requestURL = `https://leetcode.com/problems/${slug}/description/`;      
        await driver.get(requestURL);   

        const urlLoaded = await driver.getCurrentUrl();
        if (urlLoaded !== requestURL)
            return { error: "Page not available - check problem id" };

        try {
            await driver.wait(until.elementLocated(By.css('div[data-track-load="description_content"]')), 10000);
        } catch (error) {
            return {error:"Problem does not exist"};
        }

        const titleElement = await driver.findElement(By.css('div.text-title-large'));
        let title = (await titleElement.getAttribute("innerText")).trim();
        const index = title.substring(0,title.indexOf('.'));
        title = title.substring(title.indexOf('.')+1).trim();

        const difficultyElement = await driver.findElement(By.css("div.text-caption"));
        const difficulty = (await difficultyElement.getAttribute("innerText")).trim();

        const descriptionElement = await driver.findElement(By.css('div[data-track-load="description_content"]'));
        const description = await descriptionElement.getAttribute("innerText");

        const statement = description.substring(0,description.indexOf('Example')).trim();
        const exampleText = description.substring(description.indexOf('Example'),description.indexOf('Constraints'));
        const examples = findExamples(exampleText);

        const tagElements = await driver.findElements(By.css('a[rel="noopener noreferrer"]'));
        let topics = [];
        for(let tagIndex=0; tagIndex<tagElements.length; tagIndex++){
            const currTag = (await tagElements[tagIndex].getAttribute("innerText")).trim().replaceAll(" ","_").toUpperCase();
            if(currTag.length>0)
            topics.push(currTag);
        }

        const constraints = description.substring(description.indexOf('Constraints:')+'Constraints:'.length).trim().split('\n').map(constraint => constraint.trim()).filter(constraint => constraint.length>0);
        return {
            problem:{
            index,
            title,
            difficulty,
            statement,
            examples,
            constraints,
            topics
          }
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: error.message };
    }
}
