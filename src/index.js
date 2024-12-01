import { app } from "./app.js";
import {configDotenv} from "dotenv";
configDotenv();

const port = process.env.PORT || 8000;
app.listen(port,(req,res)=>{
    console.log("App is listening at port",port);
});
