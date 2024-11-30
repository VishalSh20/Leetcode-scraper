import express from "express";
import cors from "cors";
import getPageHTML from "./controllers/pagehtml.controller.js";
import getProblemDetails from "./controllers/problem.controller.js";
import getProblemSet from "./controllers/problemset.controller.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({"extended":true}));
app.get('/html',getPageHTML);
app.get('/problem',getProblemDetails);
app.get('/problemset',getProblemSet);

export {app};