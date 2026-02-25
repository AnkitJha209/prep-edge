import { client } from "@repo/db/client"

export const createReport =  async (interviewId: string, jobData: any, userData: any) => {
    try {
        const interview = await client.interview.findFirst({
            where: {id : interviewId},
            include: {
                application: true,
                questions: true 
            }
        })
        
    } catch (error) {
        console.log(error)
        throw new Error("Cannot Create the Report for some reason try again")
    }
}