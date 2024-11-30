import { Options } from "selenium-webdriver/chrome.js";
let chromeOptions = new Options();
chromeOptions.addArguments('--headless=new'); // Run in headless mode
chromeOptions.addArguments('--no-sandbox'); // Disable sandboxing (helps in Docker)
chromeOptions.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
chromeOptions.addArguments('--disable-gpu'); // Disable GPU (not needed in headless)
chromeOptions.addArguments('--window-size=1920,1080');
chromeOptions.addArguments('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

export {chromeOptions};