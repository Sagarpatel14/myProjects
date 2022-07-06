const isValid= function(value){
    if (typeof value=== "undefined" || typeof value === "null") return false
    if (typeof value==="string" && value.trim().length===0) return false
    if(value==null)return false 
    return true
}
const isValidName=(name)=>{
    if( /^[-a-zA-Z_:,.' ']{1,100}$/.test(name))
    return true
}
const isValidEmail=(mail)=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    return true
}
const isValidMobile=(mobile)=>{
    if(/^[0]?[6789]\d{9}$/.test(mobile))
    return true
}
const isValidPassword=(pw)=>{
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/.test(pw))
    return true
}
const isValidIsbn=(no)=>{
    if(/^(ISBN[-]*(1[03])*[ ]*(: ){0,1})*(([0-9Xx][- ]*){13}|([0-9Xx][- ]*)){10}/.test(no))
    return true
}
module.exports={isValid,isValidName,isValidEmail,isValidMobile,isValidFName,isValidUrl,isValidPassword,isValidIsbn}