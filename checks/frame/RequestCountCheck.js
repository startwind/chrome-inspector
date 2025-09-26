export class RequestCountCheck {
    name = "RequestCountCheck";
    severity = "medium";

    maxRequests = 100;

    async check(record) {
        console.log('record', record)
        if (record.requestCount > this.maxRequests) {
            return {
                message: `website makes ${record.requestCount} requests`,
                severity: this.severity
            };
        }
        return false;
    }
}