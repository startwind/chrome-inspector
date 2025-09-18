export class InsecureRequestCheck {
    name = "InsecureRequestCheck";
    severity = "high";

    async check(req) {
        try {
            const url = new URL(req.url);
            if (url.protocol === "http:") {
                return {
                    message: `insecure request over HTTP: ${req.url}`,
                    severity: this.severity
                };
            }
        } catch (e) {
           return false
        }
        return false;
    }
}