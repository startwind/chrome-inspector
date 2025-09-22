export class CookieSecurityCheck {
    name = "Cookie Security"

    async check(record) {
        const headers = record.responseHeaders || {};
        const setCookieHeader = headers["set-cookie"];

        if (!setCookieHeader) {
            return false;
        }

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