export const setCookie = (name: string, value: string | null, day: number) => {
    let today = new Date();
    today.setDate(today.getDate() + day)
    document.cookie = name + "=" + value + "; path=/; expires=" + today.toUTCString() + ";"
}

export const getCookie = (key:string) => {
    // name 변수 = loginId 
    let cookie = document.cookie + ";"  
    console.log("cookie:" + cookie);  // loginId=admin1; (0~14)
    let index = cookie.indexOf(key, 0);  //키가 시작되는 index = 0
    let val = "";
    if(index > -1){
        cookie =  cookie.substring(index, cookie.length);  // 0, 15 -> loginId=admin1;
        let begin = cookie.indexOf("=", 0) + 1; // 8 -> a
        let end = cookie.indexOf(";", begin); // 14 -> n
        val = cookie.substring(begin, end);
        return val;
    }
    
}