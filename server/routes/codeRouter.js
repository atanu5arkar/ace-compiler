import express from "express";

import { reqBodyValidator, validationErrorHandler } from "../middlewares/validationMiddlewares.js";
import resHandlerMiddleware from "../middlewares/resHandler.js";
import { 
    jsMiddlewareOne, 
    pyMiddlewareOne, 
    shMiddlewareOne, 
    rbMiddlewareOne, 
    interpretedLanguageMiddlewareTwo, 
    cMiddlewareOne,
    cppMiddlewareOne,
    javaMiddlewareOne,
    compiledLanguageMiddlewareTwo,
} from "../middlewares/reqHandlerMiddlewares.js";

const router = express.Router();

router.post("/js", reqBodyValidator(), validationErrorHandler, jsMiddlewareOne, interpretedLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/py", reqBodyValidator(), validationErrorHandler, pyMiddlewareOne, interpretedLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/sh", reqBodyValidator(), validationErrorHandler, shMiddlewareOne, interpretedLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/rb", reqBodyValidator(), validationErrorHandler, rbMiddlewareOne, interpretedLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/c", reqBodyValidator(), validationErrorHandler, cMiddlewareOne, compiledLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/cpp", reqBodyValidator(), validationErrorHandler, cppMiddlewareOne, compiledLanguageMiddlewareTwo, resHandlerMiddleware);

router.post("/java", reqBodyValidator(), validationErrorHandler, javaMiddlewareOne, compiledLanguageMiddlewareTwo, resHandlerMiddleware);

export default router;
