import { Builder, By, until } from 'selenium-webdriver';
import { chromeOptions } from "../../constants.js";
import fs from 'fs';

export default async function scrapeHTML(problemSlug) {
    let driver;

    try {
        driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        const requestURL = `https://leetcode.com/problems/${problemSlug}/`;
        
        await driver.get(requestURL);
        
        const urlLoaded = await driver.getCurrentUrl();
        if (urlLoaded !== requestURL)
            return { error: "Page not available - check problem id" };

        // Wait for a specific element to load (optional)
        // await driver.wait(until.elementLocated(By.className('title')), 10000);

        // Capture screenshot
        const screenshot = await driver.takeScreenshot();

        // Save the screenshot as a PNG file
        const filePath = `./src/${problemSlug}.png`;
        fs.writeFileSync(filePath, screenshot, 'base64');

        return {
            message: "OK",
            screenshotPath: filePath,
        };
    } catch (error) {
        console.error("An error occurred:", error);
        return { error: error.message };
    } finally {
        await driver.quit();
    }
}
