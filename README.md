# telegram_bot

# telegram_bot
## 本项目代码实现机器人记录todo

* Making requests
https://api.telegram.org/bot<token>/METHOD_NAME

## 拿到发送给机器人的信息
https://api.telegram.org/<token>/getUpdates?timeout=60

## 使用开发语言创建 机器人
https://core.telegram.org/bots/samples
## tutorial
https://github.com/hosein2398/node-telegram-bot-api-tutorial

#### 第一步 拉取项目 安装依赖
* git clone 
* npm install

#### 第二步
申请api
https://my.telegram.org/apps

创建机器人 搜索 BotFather 

输入机器人名称 要求 _bot 结尾

返回 api token 

bot API
https://core.telegram.org/bots/api


#### 第三步 创建数据库表结构入下 并修改项目 .env.example 文件改成 .env

项目表结构

```
CREATE TABLE `command` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `chat_id` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `date` int DEFAULT NULL,
  `chat` varchar(255) DEFAULT NULL,
  `from` varchar(255) DEFAULT NULL,
  `chat_username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `user_todo` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `number` int DEFAULT NULL,
  `todo` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `index_username` (`username`)
) ENGINE=InnoDB;
```

#### 第四步
* node index.js  运行项目
