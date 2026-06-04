// security.js - Anti-phishing, DDoS and spam middleware
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
export const speedLimiter = slowDown({ windowMs: 15*60*1000, delayAfter: 50, delayMs: h => h*200, maxDelayMs: 5000 });
export const writeLimiter = rateLimit({ windowMs: 10*60*1000, max: 30, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many write requests' } });
export const sanitizeInput = (req, _res, next) => {
if (req.body && typeof req.body === 'object') req.body = sanitize(req.body);
next();
};
function sanitize(obj, d=0) {
if (d>5) return {};
const c={};
for (const [k,v] of Object.entries(obj)) {
if (typeof v==='string') c[k]=v.replace(/<[^>]*>/g,'').substring(0,4000);
else if (Array.isArray(v)) c[k]=v.slice(0,100).map(i=>typeof i==='string'?i.replace(/<[^>]*>/g,'').substring(0,4000):i);
else if (v&&typeof v==='object') c[k]=sanitize(v,d+1);
else c[k]=v;
}
return c;
}
export const antiPhishingHeaders = (req, res, next) => {
if (process.env.NODE_ENV==='production' && req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto']!=='https') return res.redirect(301,'https://'+req.headers.host+req.url);
if ((req.headers['referer']||'').length>2048) return res.status(400).json({message:'Invalid request'});
next();
};
export const honeypotCheck = (f='_trap') => (req,res,next) => {
if (req.body&&req.body[f]!==undefined&&req.body[f]!=='') return res.status(200).json({message:'Submission received'});
next();
};
const hashes=new Map();
export const duplicateSubmissionBlock = (req,res,next) => {
if (!req.body||!Object.keys(req.body).length) return next();
const h=simpleHash(JSON.stringify(req.body)+(req.ip||'')),now=Date.now(),last=hashes.get(h);
if (last&&now-last<5000) return res.status(429).json({message:'Duplicate submission detected'});
hashes.set(h,now);
if (hashes.size>500) for(const [k,v] of hashes.entries()) if(now-v>60000) hashes.delete(k);
next();
};
function simpleHash(s){let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(31,h)+s.charCodeAt(i))|0;return h.toString(16);}
