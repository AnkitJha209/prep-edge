import jwt from 'jsonwebtoken'
export const checkUser = (token: string) => {
    try {
        const decode = jwt.verify(token, "INTERVIEW_SECRET")
        return decode
    } catch (error) {
        console.log(error)
        return "Cannot Decode the token"
    }
}