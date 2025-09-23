import {getConfig} from "../../../utils/config.js";

export class StatusCodeCheck {
    name = "StatusCodeCheck";
    severity = "high"

    async check(req) {
        const {statusCodeWarnFrom} = await getConfig();

        const codes = {
            404: "file not found",
            401: "unauthorized",
        }

        if (typeof req.statusCode === "number" && req.statusCode >= statusCodeWarnFrom) {
            let message = `status ${req.statusCode} ≥ ${statusCodeWarnFrom}`

            if (req.statusCode in codes) {
                message = codes[req.statusCode] + ' (' + req.statusCode + ')';
            }

            return {
                message,
                severity: "high"
            }
        }
        return false;
    }
}
