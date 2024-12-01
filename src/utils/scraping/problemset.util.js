import {By, until } from 'selenium-webdriver';
import { driver } from '../../app.js';

const problemFieldIndex = (field) => {
    switch (field) {
        case "title":
            return 2;
        case "acceptance":
            return 4;
        case "difficulty":
            return 5;
        default:
            return -1;
    }
}

function generateSlug(title) {
    return title
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace from both ends
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export default async function scrapeProblemSet(page) {
    try {
        const requestURL = `https://leetcode.com/problemset/?page=${page}`;      
        await driver.get(requestURL);   

        const urlLoaded = await driver.getCurrentUrl();
        console.log(urlLoaded);
        console.log(requestURL);
        if (urlLoaded !== requestURL)
            return { error: "Page not available - check problem id" };

        const tableElementSelector = 'div[role="rowgroup"]';
        try {
            await driver.wait(until.elementLocated(By.css(tableElementSelector)), 10000);
        } catch (error) {
            return {error:"Page does not exist"};
        }

        let problemElements = await driver.findElements(By.css('div[role="row"]'));
        const totalProblems = problemElements.length;
        console.log(totalProblems);

        let problems = [];
        for (let i = 0; i < totalProblems - 1; i++) {
            let currProblem = {};
            const problemFields = ["title", "acceptance", "difficulty"];

            for (let f = 0; f < problemFields.length; f++) {
                const fieldIndex = problemFieldIndex(problemFields[f]);
                if (fieldIndex !== -1) {
                    const fieldElement = await driver.findElement(By.css(`div[role="row"]:nth-child(${i + 1}) > div[role="cell"]:nth-child(${fieldIndex})`));
                    const fieldValue = await fieldElement.getAttribute("innerText");
                    currProblem[problemFields[f]] = fieldValue; // Use field name as key
                }
            }
            currProblem.index = currProblem.title.substring(0,currProblem.title.indexOf("."));
            currProblem.title = currProblem.title.substring(currProblem.title.indexOf(".")+1).trim();
            currProblem.slug = generateSlug(currProblem.title);
            problems.push(currProblem);
        }

        return {
            message: "OK",
            problems,
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: error.message };
    } 
}
