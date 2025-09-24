import {StatusCodeCheck} from './network/general/StatusCodeCheck.js';
import {SlowRequestCheck} from './network/general/SlowRequestCheck.js';
import {LargeResponseCheck} from './network/general/LargeResponseCheck.js';
import {InsecureRequestCheck} from "./network/http/InsecureRequestCheck.js";
import {MissingCacheHeaderCheck} from "./network/http/MissingCacheHeaderCheck.js";
import {Http11Check} from "./network/http/Http11Check.js";
import {ApacheVersionCheck} from "./network/http/header/ApacheVersionCheck.js";
import {FrameEmbeddingCheck} from "./network/security/FrameEmbeddingCheck.js";
import {CookieSecurityCheck} from "./network/security/CookieSecurityCheck.js";
import {StopWordCheck} from "./network/html/StopWordCheck.js";

export const checks = {
    network: [
        new StatusCodeCheck(),
        new SlowRequestCheck(),
        new LargeResponseCheck(),
        new InsecureRequestCheck(),
        new MissingCacheHeaderCheck(),
        new Http11Check(),

        // http -> header
        new ApacheVersionCheck(),

        // security
        new FrameEmbeddingCheck(),
        new CookieSecurityCheck(),

        // html
        new StopWordCheck(),
    ]
}
