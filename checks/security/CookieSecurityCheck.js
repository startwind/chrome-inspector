export class CookieSecurityCheck {
    name = "Cookie Security"

    async check(record) {
        // Nur auf Responses mit Set-Cookie prüfen
        const headers = record.responseHeaders || {};
        const setCookieHeader = headers["set-cookie"];

        if (!setCookieHeader) {
            return false; // keine Cookies gesetzt → nichts zu prüfen
        }s

        // Manche Antworten enthalten mehrere Set-Cookie-Header
        const cookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

        const problems = [];

        for (const cookie of cookies) {
            const lc = cookie.toLowerCase();

            if (!lc.includes("secure")) {
                problems.push("missing Secure flag");
            }
            if (!lc.includes("httponly")) {
                problems.push("missing HttpOnly flag");
            }
            if (lc.includes("samesite=none") && !lc.includes("secure")) {
                problems.push("SameSite=None without Secure");
            }
            if (!lc.includes("samesite")) {
                problems.push("missing SameSite attribute");
            }
        }

        if (problems.length > 0) {
            return {
                rule: this.name,
                message: `Insecure cookie settings: ${problems.join(", ")}`
            };
        }

        return false; // alle Cookies ok
    }
};