// all files here are of those models

module.exports.getDate = function (){
    const today = new Date();
    const currentDay = today.getDay();
    const options ={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    var day = today.toLocaleDateString("en-US",options);
    console.log(day);
    return day;

}


