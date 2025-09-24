export class StopWordCheck {
    name = "StopWordCheck";
    severity = "low";

    words = [
        "sex",
        "porn",
        "casino",
        "gambling",
        "adult",
        "xxx",
        "porno",
        "p0rn"
    ]

    async check(req) {
        if (req.content) {
            const content = req.content.toLowerCase();
            let found = []
            for (const word of this.words) {
                if (content.includes(' ' + word)) {
                    found.push(word);
                }
            }
            if (found.length > 0) {
                return {
                    message: `found stop words: ${found.join(", ")}`,
                    severity: this.severity
                };
            }
        }

        return false;
    }
}