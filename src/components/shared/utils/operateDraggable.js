import request from './request';


export const updateList = async ( formDashId, sequenceIndex, appId )=>{
    return await request("/formAndDashboard/seq",{
        method:"PUT",
        headers:{
            appid:appId
        },
        data:{
            sequence:{
                relatedId:formDashId,
                seq:sequenceIndex
            }
        }
    })
}