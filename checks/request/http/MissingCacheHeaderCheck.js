export class MissingCacheHeaderCheck {
    name = "MissingCacheHeaderCheck";
    severity = "medium";

    async check(req) {
        const staticTypes = ["script", "image", "media", "stylesheet", "font"];

        if (!staticTypes.includes(req.type)) {
            return false;
        }

        const headers = req.responseHeaders || {};
        const hasCacheControl = headers["cache-control"] !== undefined;
        const hasExpires = headers["expires"] !== undefined;

        if (!hasCacheControl && !hasExpires && req.pageUrl) {
            return {
                message: `static resource (${req.type}) without cache headers`,
                severity: this.severity
            };
        }

        return false;
    }
}