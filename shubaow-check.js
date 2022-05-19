/***

Thanks to & modified from https://gist.githubusercontent.com/Hyseen/b06e911a41036ebc36acf04ddebe7b9a/raw/nf_check.js

For Quantumult-X 598+

[task_local]

event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/ytb-ui-check.js, tag=YouTube 查询, img-url=text.magnifyingglass.system, enabled=true

@XIAO_KOP

**/


const BASE_URL = 'https://m.shubaow.net'

const FILM_ID = 81215567
const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 

const arrow = "➟"
var output = ""
var opts = {
  policy: $environment.params
};



!(async () => {
  let result = {
    title: '📺 书包网 检测',
    content: '----------------------\n\n检测失败，请重试',
  }
  await Promise.race([test(FILM_ID),timeOut(5000)])
  .then((code) => {
    console.log(code)
    
    if (code === 'Not Available') {
      result['content'] = '----------------------\n\n🛑 未支持'
      //return
    } else if (code === "timeout") {
      result['content'] = "----------------------\n\n🚦 测试超时"
    } else {
      result['content'] = '----------------------\n\n✅ 支持"
    }
    //$notify(result["title"], output, result["content"], link)
    
    //console.log(result)
    $done({"title":result["title"],"message":result["content"]+'\n\n----------------------\n'+$environment.params})
  })
})()
.finally(() => $done());

function timeOut(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //reject(new Error('timeout'))
      resolve("timeout")
    }, delay)
  })
}


function test() {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL,
      opts: opts,
      headers: {
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
        'Accept-Language': 'en',
      },
    }
    $task.fetch(option).then(response=> {
      let data = response.body
      console.log(response.statusCode)
      if (response.statusCode !== 200) {
        reject('Error')
        return
      }
      
      if (data.indexOf('An error') !== -1) {
        resolve('Not Available')
        return
      }
      console.log(data)
      let region = ''
      let re = new RegExp('"GL":"(.*?)"', 'gm')
      let result = re.exec(data)
      if (result != null && result.length === 2) {
        region = result[1]
      } else if (data.indexOf('www.google.cn') !== -1) {
        region = 'CN'
      } else {
        region = 'US'
      }
      resolve(region)
    })
  })
}
