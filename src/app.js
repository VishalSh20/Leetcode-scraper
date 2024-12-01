import express from "express";
import cors from "cors";
import getPageHTML from "./controllers/pagehtml.controller.js";
import getProblemDetails from "./controllers/problem.controller.js";
import getProblemSet from "./controllers/problemset.controller.js";
import getBatchProblemDetails from "./controllers/problems.controller.js";
import { Builder } from "selenium-webdriver";
import { chromeOptions } from "./constants.js";

const app = express();
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({"extended":true}));
app.get('/html',getPageHTML);
app.get('/problem',getProblemDetails);
app.get('/problemset',getProblemSet);
app.get('/problems',getBatchProblemDetails);


export {app,driver};