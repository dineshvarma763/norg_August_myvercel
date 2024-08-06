import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const applyMiddleware = middleware => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, result =>
      result instanceof Error ? reject(result) : resolve(result)
    )
  })

const getIP = request =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress

export const getRateLimitMiddlewares = ({
  limit      = 1000,                // number of requests in a window
  windowMs   = 15 * 60 * 1000,      // in 15 minutes
  delayAfter = Math.round(10 / 2),  // allow this many per window period
  delayMs    = 500, // begin adding 500ms of delay per request above
                    // delayAfter period
                    // request # 51 is delayed by 500ms
                    // request # 52 is delayed by 1000ms
                    // request # 53 is delayed by 1500ms
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
]

const middlewares = getRateLimitMiddlewares()

async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map(middleware => middleware(request, response))
  )
}

export default applyRateLimit
