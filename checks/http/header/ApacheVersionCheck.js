export class ApacheVersionCheck {
    name = "ApacheVersionCheck";
    severity = "medium";

    async check(req) {
        try {
            const headers = req.responseHeaders || {};
            const serverHeader = headers["server"] || headers["Server"];
            if (serverHeader && /apache\/\d+/i.test(serverHeader)) {
                return {
                    message: `server header exposes Apache version`,
                    severity: this.severity
                };
            }
        } catch (e) {
            // Fehler beim Header-Parsing ignorieren
        }
        return false;
    }
}