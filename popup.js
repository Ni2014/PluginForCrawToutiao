chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {

    // Bmob平台注册应用可以得到的appId和restKey, 替换成你自己的哈
    var appid = "fba37a84913a8bc6b0354f49d7e02512";
    var restkey = "68db0adb5fdd8fd14ce345f94cb3d76c";
    Bmob.initialize(appid,restkey)
    // 1 split 
    var htmlStr = request.source
    var data = htmlStr.substring(htmlStr.indexOf("articleInfo: "),htmlStr.indexOf("commentInfo"))
    
    data = data.substring(data.indexOf(":")+1,data.indexOf("tagInfo"));
    console.log("original " + data)
    data = data.substring(0,data.lastIndexOf(",")) + "}"
    console.log("fix " + data)
    data = data.replace(/title/,"\"title\"")
    data = data.replace(/content/,"\"content\"")
    data = data.replace(/groupId/g,"\"groupId\"")
    data = data.replace(/itemId/g,"\"itemId\"")
    data = data.replace(/type/,"\"type\"")
    data = data.replace(/subInfo/,"\"subInfo\"")
    data = data.replace(/isOriginal/,"\"isOriginal\"")
    data = data.replace(/source/,"\"source\"")
    data = data.replace(/time/,"\"time\"")

    data = data.replace(/&lt;/g,"<")
    data = data.replace(/&gt;/g,">")
    data = data.replace(/&#x3D;/g,"=")
    
    data = data.replace(/\'/g,'"');

    console.log("before parse" + data)


    var obj = JSON.parse(data);
    console.log("obj is " + obj)
    var feedTitle = obj.title
    var feedSource = obj.subInfo.source
    console.log("title " + feedTitle)
    console.log("source " + feedSource)
    var contentStr = obj.content;

  
    console.log("body " + contentStr)
    contentStr = contentStr.replace(/&quot;/g,'\"')
    contentStr = contentStr.replace(/&lt;/g,"<")
    contentStr = contentStr.replace(/&gt;/g,">")
    contentStr = contentStr.replace(/&#x3D;/g,"=")
    // find imgs
    document.body.innerHTML = contentStr
    var imgAll = new Array()
    imgAll = document.getElementsByTagName("img");
    var imgs = new Array()

    if(imgAll.length >= 3){
        for(var i = 0;i<3;i++){
            imgs[i] = imgAll[i].src;
        }
    };

    console.log("imgs " + imgs)

  


    var Feed = Bmob.Object.extend("Feed")
    var feed = new Feed()
    
    feed.set("title",feedTitle)
    feed.set("source",feedSource)
    feed.set("body",contentStr)
    feed.set("images",imgs)
    
    
    
    feed.save(null,{
        success:function (object) {
            alert("保存成功，object为:" + object.id)
            imgAll = []
            imgs = []
        },
        error:function (model,error) {
            alert("failed" + model)
        }
    });
      }
    });

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;