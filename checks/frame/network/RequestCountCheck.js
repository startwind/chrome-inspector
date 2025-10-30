export class RequestCountCheck {
    name = "RequestCountCheck";
    severity = "medium";

    maxRequests = 150;

    async check(record) {
        if (record.requestCount > this.maxRequests) {
            return {
                message: `website makes ${record.requestCount} requests`,
                severity: this.severity
            };
        }
        return false;
    }
}