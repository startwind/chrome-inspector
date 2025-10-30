import {StatusCodeCheck} from './request/general/StatusCodeCheck.js';
import {SlowRequestCheck} from './request/general/SlowRequestCheck.js';
import {LargeResponseCheck} from './request/general/LargeResponseCheck.js';
import {InsecureRequestCheck} from "./request/http/InsecureRequestCheck.js";
import {MissingCacheHeaderCheck} from "./request/http/MissingCacheHeaderCheck.js";
import {Http11Check} from "./request/http/Http11Check.js";
import {ApacheVersionCheck} from "./request/http/header/ApacheVersionCheck.js";
import {FrameEmbeddingCheck} from "./request/security/FrameEmbeddingCheck.js";
import {CookieSecurityCheck} from "./request/security/CookieSecurityCheck.js";
import {StopWordCheck} from "./frame/security/StopWordCheck.js";
import {RequestCountCheck} from "./frame/network/RequestCountCheck.js";
import {DuplicateRequestCheck} from "./request/performance/DuplicateRequestCheck.js";

export const checks = {
    request: [
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

        // performance
        new DuplicateRequestCheck()
    ],
    frame: [
        // network
        new RequestCountCheck(),

        // security
        new StopWordCheck()
    ]
}
