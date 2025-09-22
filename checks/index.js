import {StatusCodeCheck} from './general/StatusCodeCheck.js';
import {SlowRequestCheck} from './general/SlowRequestCheck.js';
import {LargeResponseCheck} from './general/LargeResponseCheck.js';
import {InsecureRequestCheck} from "./http/InsecureRequestCheck.js";
import {MissingCacheHeaderCheck} from "./http/MissingCacheHeaderCheck.js";
import {Http11Check} from "./http/Http11Check.js";
import {ApacheVersionCheck} from "./http/header/ApacheVersionCheck.js";
import {FrameEmbeddingCheck} from "./security/FrameEmbeddingCheck.js";
import {CookieSecurityCheck} from "./security/CookieSecurityCheck.js";

export const checks = [
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
    new CookieSecurityCheck()
];
