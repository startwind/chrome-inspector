export class StopWordCheck {
    name = "StopWordCheck";
    severity = "high";

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

            const regex = new RegExp(`\\b(${this.words.join("|")})\\b`, "gi");
            const found = new Set();

            let match;
            while ((match = regex.exec(content)) !== null) {
                found.add(match[1]);
            }

            const uniqueWords = [...found];

            if (uniqueWords.length > 0) {
                return {
                    message: `website could be hacked: found stop words (${uniqueWords.join(", ")})`,
                    severity: this.severity
                };
            }
        }

        return false;
    }
}