import {getConfig} from "../../../utils/config.js";

export class LargeResponseCheck {
    name = "LargeResponseCheck";
    severity = "medium";

    async check(req) {
        const lenHeader = req.responseHeaders?.["content-length"];
        if (!lenHeader) return false;

        const size = parseInt(lenHeader, 10);
        if (Number.isNaN(size)) return false;

        const oneMB = 1024 * 1024;

        if (size > oneMB) {
            let message = `response size exceeds 1 MB (${(size / 1024 / 1024).toFixed(2)} MB)`;
            let severity = "medium";

            return {message, severity};
        }

        return false;
    }
}