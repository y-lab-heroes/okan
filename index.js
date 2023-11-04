'use strict';
//モジュール呼び出し
const line = require('@line/bot-sdk');
const crypto = require('crypto');
const Obniz = require('obniz');

var falseCount = 0;
var trueCount = 0;
var angry = 0;
var interval_id;

//インスタンス生成
const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

exports.handler = (event, context) => {
    
    var obniz = new Obniz(process.env.OBNIZ);
    var sensor;
    var light;
    var speaker;
    let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
    let checkHeader = (event.headers || {})['X-Line-Signature'];
    if(!checkHeader){
        checkHeader = (event.headers || {})['x-line-signature'];
    }    
    let body = JSON.parse(event.body);
    const events = body.events;
    console.log(events);

    if (signature === checkHeader) {
        obniz.onconnect = async function () {
            let mes = ''; 
            if(body.events[0].message.text === 'おはよう'){
                mes = 'おはよう。ちゃんと勉強頑張りや。'; //メッセージだけ先に処理
                await client.replyMessage(body.events[0].replyToken, {
                    type: "text",
                    text: mes
                })
                .catch((err) => console.log(err));   

                obniz.display.clear();
                obniz.display.print("obniz LINE bots");
                sensor = obniz.wired("HC-SR505", { vcc: 1, signal: 0, gnd: 2 });
                speaker = obniz.wired("Keyestudio_Buzzer", { signal: 3, vcc: 4, gnd: 5 });
                light = obniz.wired("Keyestudio_TrafficLight", {
                    gnd: 8,
                    green: 9,
                    yellow: 10,
                    red: 11,
                });
                //赤のLEDをつける
                light.red.on();
                // ディスプレイ処理
                obniz.display.clear(); 
                obniz.display.print("okan-bot!!!!!"); // obnizに文字を出す
                            
                // setIntervalで間隔を作る
                interval_id = setInterval(monitor, 1000);

                async function monitor(){
                    // 非同期で取得
                    var detected = await sensor.getWait();
                    // displayに反映
                    obniz.display.clear();  
                    // 近づいてきたら判定する
                    if(detected == true ){ // 何かを感知したら
                        trueCount = trueCount + 1;
                        console.log("true=" + trueCount);
                        falseCount = 0;
                    }else if(detected == false){
                        falseCount = falseCount + 1;
                        console.log("false=" + falseCount);
                        light.red.on();
                    } 
                    if (falseCount >= 1800){
                        light.red.blink();
                        obniz.display.clear(); 
                        obniz.display.print("okan is coming!!!!!");
                        waitAskObniz(body.events[0].source.userId);
                        angry = angry + 1;
                        console.log("angry="+angry);
                        falseCount = 0; 
                        if(angry >= 3){
                            speaker.play(3000); // 1000 Hz
                            await obniz.wait(10000);
                            speaker.stop();
                            angry = 0;
                        }                  
                    }
                    if (trueCount >= 1800) {
                        obniz.display.clear(); 
                        obniz.display.print("okan is coming!!!!!");
                        getAskObniz(body.events[0].source.userId);
                        trueCount = 0;
                    }
                }; 
            }else if(body.events[0].message.text === "寝ます"){
                mes = "お疲れ様。";
                    client.replyMessage(body.events[0].replyToken, {
                        type: "text",
                        text: mes
                    })
                    .catch((err) => console.log(err));                 
                    trueCount = 0;
                    falseCount = 0;
                    obniz.close();
                    clearInterval(interval_id); 
                    console.log(interval_id);
            }else{ 
                mes = body.events[0].message.text;
                client.replyMessage(body.events[0].replyToken, {
                    type: "text",
                    text: mes
                })
                .then((response) => {
                    let lambdaResponse = {
                        statusCode: 200,
                        headers: { "X-Line-Status": "OK" },
                        body: '{"result":"completed"}'
                    };
                    context.succeed(lambdaResponse);
                }).catch((err) => console.log(err));     
            } 
        }  
    } else {
        console.log('署名認証エラー');
    }
};

const getAskObniz = async (userId) => {
    await client.pushMessage(userId, {
        type: "text",
        text: "ちゃんとやってるな、えらい！",
  });
};

//お叱りのメッセージを送るための関数
const waitAskObniz = async (userId) => {
  await client.pushMessage(userId, {
    type: "text",
    text: "あんた、何サボっとるん！？",
  });
}; 


