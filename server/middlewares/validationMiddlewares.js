import { body, validationResult } from "express-validator";

function reqBodyValidator() {
    return [
        body("language")
            .custom((value) => {
                return [
                    "javascript",
                    "c",
                    "cpp",
                    "java",
                    "python3",
                    "ruby",
                    "bash"
                ].includes(value);
            })
            .withMessage("Invalid Language."),

        body("source_code")
            .isString()
            .notEmpty()
            .withMessage("Enter some code please."),

        body("cmd_args")
            .isString()
            .withMessage("Command-line arguments must be a string.")
    ];
}

function validationErrorHandler(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const { errors } = result;
    return res.status(400).json({ errors });
}

export { reqBodyValidator, validationErrorHandler };
