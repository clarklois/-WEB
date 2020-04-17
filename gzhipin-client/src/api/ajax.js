/*
* 包装了能发送ajax请求的函数
* 函数的返回值为promise对象
* */
import axios from 'axios'
const baseUrl = 'http://localhost:4000';// 个人采用cors技术, 解决跨域问题, 此时传送的url应该是指明与后台服务器相同的域名(或端口)
export default function ajax(url,data={},type='GET'){
  url = baseUrl+url
  if(type==='GET'){
    // data={username:xxx,password:sss}
    // Object.keys能把类数组对象的key值全部取出,封装成一个数组并返回
    let urlData=''
    Object.keys(data).forEach((key)=>{
      urlData+=key+'='+data[key]+'&'
    })
    if(urlData){
      urlData=urlData.substring(0,urlData.length-1)
    }
    return axios.get(url+'?'+urlData,{withCredentials:'include'})
  }
  else {
    return axios.post(url,data,{withCredentials:'include'})
  }
}