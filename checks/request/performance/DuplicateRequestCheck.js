import {getConfig} from "../../../utils/config.js";

export class DuplicateRequestCheck {
    name = "RepeatedRequestCheck";
    severity = "low";

    constructor() {
        this.requestCounts = new Map();
    }

    async check(req) {

        if (!req.url) {
            return false;
        }

        const currentCount = this.requestCounts.get(req.url) || 0;
        const newCount = currentCount + 1;
        this.requestCounts.set(req.url, newCount);

        if (newCount === 2) {
            return {
                message: 'URL was called multiple times',
                severity: this.severity,
                group: "performance"
            };
        }

        return false;
    }
}