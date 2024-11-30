import { Builder, By, until } from 'selenium-webdriver';
import { chromeOptions } from "../../constants.js";

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

export default async function scrapeProblemSet(page) {
    let driver;
    try {
        driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        const requestURL = `https://leetcode.com/problemset/?page=${page}`;      
        await driver.get(requestURL);   

        const urlLoaded = await driver.getCurrentUrl();
        console.log(urlLoaded);
        console.log(requestURL);
        if (urlLoaded !== requestURL)
            return { error: "Page not available - check problem id" };

        const tableElementSelector = 'div[role="rowgroup"]';
        await driver.wait(until.elementLocated(By.css(tableElementSelector)), 10000);
        let problemElements = await driver.findElements(By.css('div[role="row"]'));
        const totalProblems = problemElements.length;
        console.log(totalProblems);

        let problems = [];
        for (let i = 0; i < totalProblems - 1; i++) {
            const rowElement = await driver.findElement(By.css(`div[role="row"]:nth-child(${i + 1})`));

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
            problems.push(currProblem);
        }

        return {
            message: "OK",
            problems,
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: error.message };
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}
