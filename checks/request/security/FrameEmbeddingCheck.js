export class FrameEmbeddingCheck {
    name = "Frame Embedding Forbidden";

    async check(record) {

        if (record.type !== "main_frame") {
            return false;
        }

        const headers = record.responseHeaders || {};
        let forbidden = false;

        // 1) X-Frame-Options Header
        const xfo = headers["x-frame-options"];
        if (xfo) {
            const val = xfo.trim().toLowerCase();
            if (val === "deny" || val === "sameorigin") {
                forbidden = true;
            }
        }

        // 2) Content-Security-Policy Header
        const csp = headers["content-security-policy"];
        if (csp) {
            if (csp.includes("frame-ancestors 'none'")) {
                forbidden = true;
            }
            if (csp.includes("frame-ancestors") && !csp.includes("'self'")) {
                forbidden = true;
            }
        }

        if (forbidden) {
            return false;
        }

        return {
            severity: 'low',
            message: "this website allows embedding in an iframe",
            group: 'security'
        };
    }
};