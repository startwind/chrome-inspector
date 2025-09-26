export class Http11Check {
    name = "Http11Check";
    severity = "low";

    async check(req) {
        try {
            const headers = req.responseHeaders || {};
            const version = headers[":version"] || headers["version"];
            if (version && version.toUpperCase().includes("HTTP/1.1")) {
                return {
                    message: `connection is using HTTP/1.1`,
                    severity: this.severity
                };
            }
        } catch (e) {
            // Fehler beim Header-Parsing ignorieren
        }
        return false;
    }
}