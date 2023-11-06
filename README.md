# オカンボット　Okan Bot

## システムの概要

勉強中にさぼっていないかをオカンが監視するシステム。  
obnizの人感センサーを用いて、勉強机にいるかを検知する。  
さぼっていたらLINE BOTからメッセージが送られ、obnizのライトが光り、ブザーが鳴る。  
また、それに反応してアレクサが起動し、オカンが説教するメッセージが流れ、同時にSwitch Botにより照明が消える。  

## 使用した技術、デバイス
#### 技術
- node.js -v20.8.1
- line-bot-sdk-nodejs
- obniz.js
- AWS lambda
- Amazon API Gateway
- LINE Messaging API

#### デバイス
- obniz Starter Kit
- Alexa
- SwitchBot

## 準備

### obnizの準備

- obnizスターターキットのobnizボード、人感センサー、LEDライト、ブザーを用意する。  
- obnizボードの0,1,2ポートに人感センサー、3,4,5ポートにブザー、8,9,10,11ポートにLEDライトを接続する。

### AWSの準備

- AWSアカウントを作成する。
- lambda関数を作成し、トリガーにAPI Gatewayを選択する。
- このときのAPI GatewayのURLをコピーしておく。

### LINE Botの準備

- LINE Developersでアカウントを作成する。その際にアカウントのアクセストークンと、チャネルシークレットを控えておく。
- Webhook URLにAPI GatewayのURLを貼り付ける。

### AlexaとSwitchBotの準備

- AlexaをWifiに接続し、AlexaアプリでSwitchBotと接続する。
- Alexaスキルで、自分で録音したmp3ファイルを再生するスキルを作成する。
- 定型アクションで家電の音が鳴ったら、mp3ファイルが流れるように設定する。

## 使用方法

1．obniz,alexa,switch botを電源に接続する。  
2. このリポジトリのzipファイルをダウンロード  
3. AWS lambdaにzipファイルをアップロード  
4. オカンボットに「おはよう」と送信する。  
5．終了するときは「寝ます」と送信する。  
