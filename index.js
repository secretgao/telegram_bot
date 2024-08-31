const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const env = require('dotenv');
const config = env.config();
const db = require('./service/mysql');
const { error } = require('pdf-lib');

const token = config.parsed.BOT_TOKEN;

if (token == undefined || token == ''){
  console.error( '❌ 请设置机器人token');
  throw new Error('请设置机器人token');
}

const bot = new TelegramBot(token, {polling: true});

//todo 操作的指令
const todocommand = {
  add:'add',
  update:'update',
  del:'del',
  list:'list',
};

bot.onText(/\/start/, (msg, match) => {
  const now = moment();
  const chatId = msg.chat.id;
 
  const nowDate = now.format('YYYY-MM-DD HH:mm:ss');
  const welcome = `now :${nowDate},welecome,use my bot.`; 
  // 创建数据
  const text = msg.text;
  const date = msg.date;
  const chat = msg.chat; 
  const from = msg.from;
  const chatUsername = msg.chat.username;
  console.log(text);
  console.log(date);
  console.log(chat);
  console.log(from);
  const createResult = mysql.insertData([nowDate,chatId,text,date,JSON.stringify(chat),JSON.stringify(from),chatUsername]);
  console.log(createResult);
  console.log(welcome);
  bot.sendMessage(chatId, welcome);
});


bot.onText(/\/todo/, (msg, match) => {
  const now = moment();
  
  let todo = msg.text.split(' '); //[ '/todo', 'add', '11' ]
  const chatId = msg.chat.id;
  const chatUsername = msg.chat.username;

  const date =  now.format('YYYY-MM-DD HH:mm:ss');;
  if (!todo[1]){
    return  bot.sendMessage(chatId, "请输入todo 命令  /todo空格命令  ;");
  }
  const command = todo[1];
  const number  = todo[2];
  const opTodo  = todo[3];
 
  console.log(msg.text);
  console.log(command);
  console.log(number);
  console.log(opTodo);
  if (command in todocommand){
     
    switch (command) {
      case todocommand.add:
        const insertSql = "INSERT INTO user_todo (`username`,`number`,`todo`,`created_at`) VALUES (?,?,?,?)"; 
        const insertData = [chatUsername,number,opTodo,date];
        performAdd(insertSql,insertData).then(result => {
          if (result.success) {
              console.log(`添加数据成功ID: ${result.insertId}`);
              bot.sendMessage(chatId, `添加 序号:${number}---任务:${opTodo} 成功`);
          } else {
              console.error('添加数据失败:', result.error);
              bot.sendMessage(chatId, `添加 序号:${number}---任务:${opTodo} 失败`);
          }
        })
        .catch(error => {
          console.error('添加数据失败:', error);
          bot.sendMessage(chatId, `添加 序号:${number}---任务:${opTodo} 失败异常:${error}`);
        });
        break;
      case todocommand.update:
        console.log(todocommand.update);
        const updateSql = "UPDATE `user_todo` SET `todo` = ? WHERE `username` = ? and `number` = ?"; 
        const updateDate = [opTodo,chatUsername,number];
        performUpdate(updateSql,updateDate).then(result => {
          if (result.success) {
              console.log(`更新数据成功: ${result.affectedRows}`);
              bot.sendMessage(chatId, `更新 序号:${number}---任务:${opTodo} 成功`);
          } else {
              console.error('更新数据失败:', result.error);
              bot.sendMessage(chatId, `更新 序号:${number}---任务:${opTodo} 失败`);
          }
        })
        .catch(error => {
          console.error('更新数据失败:', error);
          bot.sendMessage(chatId, `更新 序号:${number}---任务:${opTodo} 失败异常:${error}`);
        });
       
        break;
      case todocommand.del:
        console.log(todocommand.del);
        const delSql = "DELETE FROM user_todo WHERE `username` = ? and `number` = ?"; 
        const delData = [chatUsername,number];
        performRemove(delSql,delData).then(result => {
          if (result.success) {
              console.log(`删除数据成功: ${result.affectedRows}`);
              bot.sendMessage(chatId, `删除 序号:${number}---任务:${opTodo} 成功`);
          } else {
              console.error('删除数据失败:', result.error);
              bot.sendMessage(chatId, `删除 序号:${number}---任务:${opTodo} 失败`);
          }
        })
        .catch(error => {
          console.error('删除数据失败:', error);
          bot.sendMessage(chatId, `删除 序号:${number}---任务:${opTodo} 失败异常:${error}`);
        });
      
        break;
      case todocommand.list:
          console.log(todocommand.list); 
          const selectSql = `select number,todo FROM user_todo WHERE username = '${chatUsername}'`; 
          performQuery(selectSql).then(result => {
            if (result.success) {
                console.log(`查询数据成功: ${chatUsername}`);
                console.log(result.data);
                if (result.data){
                  bot.sendMessage(chatId, formatResults(result.data));
                } else {
                  bot.sendMessage(chatId, "您还未添加todo");
                }
                
            } else {
                console.error('查询数据失败:', result.error);
                bot.sendMessage(chatId, `查询数据失败:${result.error}`);
            }
          })
          .catch(error => {
            console.error('查询数据失败:', error);
            bot.sendMessage(chatId, `查询数据失败:${error}`);
          }); 
          break; 
      default:
        console.log('Unknown command');
    }

  }  else {
    return  bot.sendMessage(chatId, "输入的指令有误只能是: add/update/del/list 详情请查看帮助/help");
  }
  
 
 
 // const welcome = `now :${now.format('YYYY-MM-DD HH:mm:ss')},welecome,use my bot.`; 
  
  //bot.sendMessage(chatId, todo+welcome);
});


bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  const helpMessage = generateHelpMessage();
  bot.sendMessage(chatId, helpMessage);
});


/**
 * 返回帮助信息
 * @returns 
 */
function generateHelpMessage() {

  const helpMessage = `
  尊敬的大佬，欢迎使用todolist 机器人 为您安排好您的一天
Options:
  /help         查看帮助
  /start        开始使用机器人
  /todo [add/update/del/list]  [number]  [work]           
Examples:
  /todo list    查看所有已添加的todo
  /todo add 1  要做提肛           #正常添加一个todo work
  /todo add 2  要按时吃饭          #正常添加两个todo work
  /todo del 1                    #删除序号为1的任务
  /todo update  2  吃完饭要洗碗    #更新序号为2的任务
  `;

  return helpMessage;
}



// 示例查询操作
async function performQuery(sql) {
  try {
    const data = await db.query(sql);
    console.log('Query results:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error performing query:', error);
    return { success: false, error };
  }
}

// 示例添加操作
async function performAdd(sql,data) {

  try {
    const insertId = await db.add(sql, data);
    console.log('Inserted row ID:', insertId);
    return { success: true, insertId };
  } catch (error) {
    console.error('Error performing add:', error);
    return { success: false, error };
  }

}
// 示例更新操作
async function performUpdate(sql,data) {
  try {
    const affectedRows = await db.update(sql, data);
    console.log('Updated rows:', affectedRows);
    return { success: true, affectedRows };
  } catch (error) {
    console.error('Error performing update:', error);
    return { success: false, error };
  }
}
async function performRemove(sql,where) {
  try {
    const affectedRows = await db.remove(sql,where);  
    console.log('Deleted rows:', affectedRows);
    return { success: true, affectedRows };
  } catch (error) {
    console.error('Error performing remove:', error);
    return { success: false, error };
  }
}

// 格式化查询结果
function formatResults(results) {
   results.map(result => {
      return {
          "number":result.number,
          "todo":result.todo
      };
  });

  let formattedString = '';
  for (let i = 0; i < results.length; i++) {
    const item = results[i];
    formattedString += `任务序号: ${item.number}, todo: ${item.todo}`;
    if (i < results.length - 1) {
        formattedString += '; ';
    }
  }

  return formattedString;
}