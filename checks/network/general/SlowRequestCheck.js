import {getConfig} from "../../../utils/config.js";

export class SlowRequestCheck {
    name = "SlowRequestCheck";
    severity = "medium"

    async check(req) {
        const {slowThresholdMs} = await getConfig();
        if (typeof req.duration === "number" && req.duration > slowThresholdMs) {

            let message = `request took ${req.duration} ms`;
            let severity = "medium";

            if (req.type === "script") {
                message = `request for a static resource took ${req.duration} ms`;
                severity = 'high'
            }

            return {
                message,
                severity
            }
        }
        return false;
    }
}
