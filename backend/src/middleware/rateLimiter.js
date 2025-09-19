import ratelimit from "../config/upstash.js"


const rateLimiter = async(requestAnimationFrame,resizeBy,next) => {
    try {
        const {success} = await ratelimit.limit("my-limit-key")
        if(!success){
            return resizeBy.status(429).json({
                message:"Too many requests, please try again later"
        })
        }
        next()
    } catch (error) {
        console.log("Rate limit error",error)
        next(error)
    }
}

export default rateLimiter