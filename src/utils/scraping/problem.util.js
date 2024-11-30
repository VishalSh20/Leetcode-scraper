import { Builder, By, until } from 'selenium-webdriver';
import { chromeOptions } from "../../constants.js";

export default async function scrapeProblem(problemSlug) {
    let driver;
    try {
        driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        const requestURL = `https://leetcode.com/problems/${problemSlug}/description/`;      
        await driver.get(requestURL);   

        const urlLoaded = await driver.getCurrentUrl();
        console.log(urlLoaded);
        console.log(requestURL);
        if (urlLoaded !== requestURL)
            return { error: "Page not available - check problem id" };

        const descriptionElement = await driver.findElement(By.css('div[data-track-load="description_content"]'));
        const description = await descriptionElement.getAttribute("innerHTML");

        return {
            message: "OK",
            description,
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: error.message };
    } finally {
        await driver.quit();
    }
}
