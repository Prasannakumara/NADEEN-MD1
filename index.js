const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const l = console.log
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')

const ownerNumber = ['94711451319']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/session/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/session/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
const connectDB = require('./lib/mongodb')
connectDB();
const {readEnv} = require('./lib/database')
const config = await readEnv()
const prefix = config.PREFIX
console.log("Connecting wa bot 📀...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('🔄 Installing...\nNADEEN-MD CONNECTED TO WHATSAPP✅\n👨🏻‍💻Created By Nadeen Poorna👨🏻‍💻')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed successful ✅')
console.log('Bot connected to whatsapp ✅')

let up = `🚀 *_NADEEN-MD Connected Successfully!_* ✅ 

--- *💀🧨 _Welcome to NADEEN-MD!_* 🧨💀 

*🛠 PREFIX:* ${prefix}
*✨ OWNER:* ${ownerNumber}
*👨🏻‍💻 MADE BY:* Nadeen Poorna
*🌐 MODE:* ${config.MODE}

> Thank you for using *NADEEN-MD💗.*

📚 TYPE *.menu* AND GET NADEEN-MD COMMAND LIST.

> *💠Join WhatsApp Channel - :* https://whatsapp.com/channel/0029VagN2qW3gvWUBhsjcn3I
> *💠Repo - :* https://github.com/Nadeenpoorna-max/NADEEN-MD
> *💠YouTube - :* https://www.youtube.com/@NADEEN-MD

> *℘ơῳɛཞɛɖ ცყ ɖąཞƙ ƈყცɛཞ ɱąɬཞıҳ™*

*👨‍💻ɴᴀᴅᴇᴇɴ-ᴍᴅ ᴍᴀᴅᴇ ʙʏ ɴᴀᴅᴇᴇɴ ᴘᴏᴏʀɴᴀ👨‍💻* `;

conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://files.catbox.moe/7exz93.png` }, caption: up,
 contextInfo: {
      mentionedJid: ['94711451319@s.whatsapp.net'], // specify mentioned JID(s) if any
      groupMentions: [],
      forwardingScore: 10,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
          newsletterJid: '120363304606757133@newsletter',
          newsletterName: "𝐍𝐀𝐃𝐄𝐄𝐍-𝐌𝐃",
          serverMessageId: 999
     }
  }
});

}
})
conn.ev.on('creds.update', saveCreds)  

conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])
}
//=========autobio=======//
if (config.AUTO_BIO === 'true'){
               await
conn.updateProfileStatus(`💀𝗡𝗔𝗗𝗘𝗘𝗡-𝗠𝗗 🌠𝗦𝘂𝗰𝗰𝗲𝘀𝗳𝘂𝗹𝗹𝘆 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱➤ 𝗧𝗵𝗶𝘀 𝗗𝗲𝘃𝗶𝗰𝗲 𝗜𝘁 𝗛𝗮𝘃𝗲 𝗕𝗲𝗲𝗻 𝗥𝘂𝗻𝗻𝗶𝗻𝗴 𝗙𝗼𝗿 ⚡💻`)
}
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}

conn.edit = async (mek, newmg) => {
                await conn.relayMessage(from, {
                    protocolMessage: {
                        key: mek.key,
                        type: 14,
                        editedMessage: {
                            conversation: newmg
                        }
                    }
                }, {})
}
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }

// ___________________ANTI_DELETE________________________
        
    if (!m.id.startsWith("BAE5")) {
    
    // Ensure the base directory exists
    const baseDir = 'message_data';
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    
    function loadChatData(remoteJid, messageId) {
      const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
      try {
        const data = fs.readFileSync(chatFilePath, 'utf8');
        return JSON.parse(data) || [];
      } catch (error) {
        return [];
      }
    }
    
    function saveChatData(remoteJid, messageId, chatData) {
      const chatDir = path.join(baseDir, remoteJid);
    
      if (!fs.existsSync(chatDir)) {
        fs.mkdirSync(chatDir, { recursive: true });
      }
    
      const chatFilePath = path.join(chatDir, `${messageId}.json`);
    
      try {
        fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
       // console.log('Chat data saved successfully.');
      } catch (error) {
        console.error('Error saving chat data:', error);
      }
    }
        
    function handleIncomingMessage(message) {
      const remoteJid = from //message.key.remoteJid;
      const messageId = message.key.id;
    
      const chatData = loadChatData(remoteJid, messageId);
    
      chatData.push(message);
    
      saveChatData(remoteJid, messageId, chatData);
    
    //  console.log('Message received and saved:', messageId);
    }
    
    const delfrom = config.DELETEMSGSENDTO !=='94728840491' ? config.DELETEMSGSENDTO + '@s.whatsapp.net': from
    function handleMessageRevocation(revocationMessage) {
    //const remoteJid = revocationMessage.message.protocolMessage.key.remoteJid;
     //const messageId = revocationMessage.message.protocolMessage.key.id;
    const remoteJid = from // revocationMessage.msg.key.remoteJid;
    const messageId = revocationMessage.msg.key.id;
    
        
     // console.log('Received revocation message with ID:', messageId);
    
      const chatData = loadChatData(remoteJid, messageId);
    
       const originalMessage = chatData[0]   
    
      if (originalMessage) {
        const deletedBy = revocationMessage.sender.split('@')[0];
        const sentBynn = originalMessage.key.participant ?? revocationMessage.sender;
    const sentBy = sentBynn.split('@')[0];
          if ( deletedBy.includes(botNumber) || sentBy.includes(botNumber) ) return;
     if(originalMessage.message && originalMessage.message.conversation && originalMessage.message.conversation !== ''){
         const messageText = originalMessage.message.conversation;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
         var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });
    //........................................//........................................
    }else if(originalMessage.msg.type ==='MESSAGE_EDIT'){
     conn.sendMessage(delfrom, { text: `❌ *edited message detected* ${originalMessage.message.editedMessage.message.protocolMessage.editedMessage.conversation}` },{quoted: mek});
     
    //........................................//........................................
    } else if(originalMessage.message && originalMessage.message.exetendedTextMessage && originalMessage.msg.text ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){
        const messageText = originalMessage.msg.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
     var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${messageText}${xx}` });
    } else if(originalMessage.message && originalMessage.message.exetendedTextMessage ){ //&& originalMessage.message.exetendedTextMessage.text && originalMessage.message.exetendedTextMessage.text !== ''){
        const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
     var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.body}${xx}` });
    }else if(originalMessage.type === 'extendedTextMessage') {
    async function quotedMessageRetrive(){     
    var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                
    if(originalMessage.message.extendedTextMessage){
    const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
        var xx = '```'
     conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });
    }else{
    const messagetext = originalMessage.message.extendedTextMessage.text;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
        conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${xx}${originalMessage.message.extendedTextMessage.text}${xx}` });
    }
    }
    
    quotedMessageRetrive()
           
    }else if(originalMessage.type === 'imageMessage') {
          async function imageMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.imageMessage.caption){
    const messageText = originalMessage.message.imageMessage.caption;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.imageMessage.caption}` })
    }else{
        await conn.sendMessage(delfrom, { image: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })
    }       
        }
    imageMessageRetrive()
     
    }else if(originalMessage.type === 'videoMessage') {
          async function videoMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
    
    const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = config.ANTI_DELETE_MAX_SIZE
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if(originalMessage.message.videoMessage.caption){
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    const messageText = originalMessage.message.videoMessage.caption;
    if (isGroup && messageText.includes('chat.whatsapp.com')) return;
    
        await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n\n> 🔓 Message Text: ${originalMessage.message.videoMessage.caption}` })
           }
    }else{
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
        const vData = originalMessage.message.videoMessage.fileLength
    const vTime = originalMessage.message.videoMessage.seconds;
    const fileDataMB = '500'
    const fileLengthBytes = vData
    const fileLengthMB = fileLengthBytes / (1024 * 1024);
    const fileseconds = vTime
    if (fileLengthMB < fileDataMB && fileseconds < 30*60 ) {
        await conn.sendMessage(delfrom, { video: fs.readFileSync("./" + type.ext), caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_` })
    }
    }       
    }
    videoMessageRetrive()
    }else if(originalMessage.type === 'documentMessage') {
          async function documentMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    
        
    
    if(originalMessage.message.documentWithCaptionMessage){
    
    await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});
     
    }else{
    
    await conn.sendMessage(delfrom, { document: fs.readFileSync("./" + type.ext), mimetype: originalMessage.message.documentMessage.mimetype, fileName: originalMessage.message.documentMessage.fileName, caption: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n`});
    
    }
     }
    
    documentMessageRetrive()
    }else if(originalMessage.type === 'audioMessage') {
          async function audioMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.audioMessage){
    const audioq = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: audioq});
    
    }else{
    if(originalMessage.message.audioMessage.ptt === "true"){
    
    const pttt = await conn.sendMessage(delfrom, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, ptt: 'true',fileName: `${m.id}.mp3` })	
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: pttt});
    
     }
      }
     }
    
    audioMessageRetrive()
    }else if(originalMessage.type === 'stickerMessage') {
          async function stickerMessageRetrive(){      var nameJpg = getRandom('');
    const ml = sms(conn, originalMessage)
                let buff =  await ml.download(nameJpg)
                let fileType = require('file-type');
                let type = fileType.fromBuffer(buff);
                await fs.promises.writeFile("./" + type.ext, buff);
    if(originalMessage.message.stickerMessage){
     
    //await conn.sendMessage(from, { audio: fs.readFileSync("./" + type.ext), mimetype:  originalMessage.message.audioMessage.mimetype, fileName:  `${m.id}.mp3` })	
     const sdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'NADEEN-MD'})
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: sdata});
    
    }else{
    
    const stdata = await conn.sendMessage(delfrom,{sticker: fs.readFileSync("./" + type.ext) ,package: 'NADEEN-MD'})
    return await conn.sendMessage(delfrom, { text: `🚫 *This message was deleted !!*\n\n  🚮 *Deleted by:* _${deletedBy}_\n  📩 *Sent by:* _${sentBy}_\n` },{quoted: stdata});
    
      }
     }
    
    stickerMessageRetrive()
             }
         
      } else {
        console.log('Original message not found for revocation.');
      }
    }
    
    if (mek.msg && mek.msg.type === 0) {
      handleMessageRevocation(mek);
    } else {//if(mek.message && mek.message.conversation && mek.message.conversation !== ''){
      handleIncomingMessage(mek);
    
        }
    
    }
//========OwnerReact========            
         
if(senderNumber.includes("94711451319")){
if(isReact) return
m.react("👨‍💻")
}
if(senderNumber.includes("94779483535")){
if(isReact) return
m.react("👨‍🔧")
}
if(senderNumber.includes("94775383340")){
if(isReact) return
m.react("🦹🏻‍♂️")
}
if(senderNumber.includes("947435489886")){
if(isReact) return
m.react("💃🏻")
}
if(senderNumber.includes("94716769285")){
if(isReact) return
m.react("👨🏻‍💻")
}
if(senderNumber.includes("94756857260")){
if(isReact) return
m.react("🐱‍👤")
}

//=====Auto-Read-Cmd==========
if (isCmd && config.AUTO_READ_CMD === "true") {
              await conn.readMessages([mek.key])  // Mark command as read
}
//Auto Typing
if(config.AUTO_TYPING === 'true'){await conn.sendPresenceUpdate('composing', from);}
        
//Auto-StatusDL============== 
if(body === "send" || body === "Send" || body === "Seve" || body === "Ewpm" || body === "ewpn" || body === "Dapan" || body === "dapan" || body === "oni" || body === "Oni" || body === "save" || body === "Save" || body === "ewanna" || body === "Ewanna" || body === "ewam" || body === "Ewam" || body === "sv" || body === "Sv"|| body === "දාන්න"|| body === "එවම්න"){
    // if(!m.quoted) return reply("*Please Mention status*")
    const data = JSON.stringify(mek.message, null, 2);
    const jsonData = JSON.parse(data);
    const isStatus = jsonData.extendedTextMessage.contextInfo.remoteJid;
    if(!isStatus) return

    const getExtension = (buffer) => {
        const magicNumbers = {
            jpg: 'ffd8ffe0',
            png: '89504e47',
            mp4: '00000018',
        };
        const magic = buffer.toString('hex', 0, 4);
        return Object.keys(magicNumbers).find(key => magicNumbers[key] === magic);
    };

    if(m.quoted.type === 'imageMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.imageMessage.caption;
        await conn.sendMessage(from, { image: fs.readFileSync("./" + ext), caption: caption });
    } else if(m.quoted.type === 'videoMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.videoMessage.caption;
        let buttonMessage = {
            video: fs.readFileSync("./" + ext),
            mimetype: "video/mp4",
            fileName: `${m.id}.mp4`,
            caption: caption ,
            headerType: 4
        };
        await conn.sendMessage(from, buttonMessage,{quoted: mek});
    }
}
if (config.INBOX_BLOCK === "true" && mek.key.remoteJid.endsWith('@s.whatsapp.net')) {
    if (!mek.key.fromMe) { // Ensure the bot doesn't block itself
        console.log(`Auto-block initiated for ${mek.key.remoteJid}...`);

        try {
            // Send warnings
            await conn.sendMessage(mek.key.remoteJid, { text: "*Warning 1 ❗*" });
            await conn.sendMessage(mek.key.remoteJid, { text: "*Warning 2 ❗*" });
            await conn.sendMessage(mek.key.remoteJid, { text: "*Warning 3 ❗*" });

            // Notify and block
            await conn.sendMessage(mek.key.remoteJid, { text: "*Blocked 🚫*" });
            await conn.updateBlockStatus(mek.key.remoteJid, 'block');

            console.log(`User ${mek.key.remoteJid} blocked after warnings.`);
        } catch (error) {
            console.error(`Error during auto-block for ${mek.key.remoteJid}:`, error);
        }

        return; // Stop further processing for this user
    }
}
         //=======public react======
if (!isReact && senderNumber !== botNumber) {
    if (config.AUTO_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '🙂', '😑', '🤣', '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭', '😓', '😳', '😴', '😌', '😆', '😂', '🤔', '😒', '😓', '😶', '🙄', '🐶', '🐱', '🐔', '🐷', '🐴', '🐲', '🐸', '🐳', '🐋', '🐒', '🐑', '🐕', '🐩', '🍔', '🍕', '🥤', '🍣', '🍲', '🍴', '🍽', '🍹', '🍸', '🎂', '📱', '📺', '📻', '🎤', '📚', '💻', '📸', '📷', '❤️', '💔', '❣️', '☀️', '🌙', '🌃', '🏠', '🚪', "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇫🇷", "🇪🇸", '👍', '👎', '👏', '👫', '👭', '👬', '👮', '🤝', '🙏', '👑', '🌻', '🌺', '🌸', '🌹', '🌴', "🏞️", '🌊', '🚗', '🚌', "🛣️", "🛫️", "🛬️", '🚣', '🛥', '🚂', '🚁', '🚀', "🏃‍♂️", "🏋️‍♀️", "🏊‍♂️", "🏄‍♂️", '🎾', '🏀', '🏈', '🎯', '🏆', '??', '⬆️', '⬇️', '⇒', '⇐', '↩️', '↪️', 'ℹ️', '‼️', '⁉️', '‽️', '©️', '®️', '™️', '🔴', '🔵', '🟢', '🔹', '🔺', '💯', '👑', '🤣', "🤷‍♂️", "🤷‍♀️", "🙅‍♂️", "🙅‍♀️", "🙆‍♂️", "🙆‍♀️", "🤦‍♂️", "🤦‍♀️", '🏻', '💆‍♂️', "💆‍♀️", "🕴‍♂️", "🕴‍♀️", "💇‍♂️", "💇‍♀️", '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '�', '🏯', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🌳', '🌲', '🌾', '🌿', '🍃', '🍂', '🍃', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌱', '🌿', '🍃', '🍂', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', "🐕‍🦺", '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', "🐈‍⬛", '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', "🐿️", '🦫', '🦔', '🦇', '🐻', "🐻‍❄️", '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', "🕊️", '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', "😶‍🌫️", '😏', '😒', '🙄', '😬', "😮‍💨", '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', "😵‍💫", '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', "❤️‍🔥", "❤️‍🩹", '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', "🕳️", '💣', '💬', "👁️‍🗨️", "🗨️", "🗯️", '💭', '💤', '👋', '🤚', "🖐️", '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', "👁️", '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", '👩', "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", '🧓', '👴', '👵', '🙍', "🙍‍♂️", "🙍‍♀️", '🙎', "🙎‍♂️", "🙎‍♀️", '🙅', "🙅‍♂️", "🙅‍♀️", '🙆', "🙆‍♂️", "🙆‍♀️", '💁', "💁‍♂️", "💁‍♀️", '🙋', "🙋‍♂️", "🙋‍♀️", '🧏', "🧏‍♂️", "🧏‍♀️", '🙇', "🙇‍♂️", "🙇‍♀️", '🤦', "🤦‍♂️", "🤦‍♀️", '🤷', "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", '👨‍🏫', "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", '👮', "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", '💂', "💂‍♂️", "💂‍♀️", '🥷', '👷', "👷‍♂️", "👷‍♀️", '🤴', '👸', '👳', "👳‍♂️", "👳‍♀️", '👲', '🧕', '🤵', "🤵‍♂️", "🤵‍♀️", '👰', "👰‍♂️", "👰‍♀️", '🤰', '🤱', "👩‍🍼", "👨‍🍼", "🧑‍🍼", '👼', '🎅', '🤶', "🧑‍🎄", '🦸', "🦸‍♂️", "🦸‍♀️", '🦹', "🦹‍♂️", "🦹‍♀️", '🧙', "🧙‍♂️", "🧙‍♀️", '🧚', "🧚‍♂️", "🧚‍♀️", '🧛', "🧛‍♂️", "🧛‍♀️", '🧜', "🧜‍♂️", "🧜‍♀️", '🧝', "🧝‍♂️", "🧝‍♀️", '🧞', "🧞‍♂️", "🧞‍♀️", '🧟', "🧟‍♂️", "🧟‍♀️", '💆', "💆‍♂️", "💆‍♀️", '💇', "💇‍♂️", "💇‍♀️", '🚶', "🚶‍♂️", "🚶‍♀️", '🧍', "🧍‍♂️", "🧍‍♀️", '🧎', "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", '🏃', "🏃‍♂️", "🏃‍♀️", '💃', '🕺', "🕴️", '👯', "👯‍♂️", "👯‍♀️", '🧖', "🧖‍♂️", "🧖‍♀️", '🧗', "🧗‍♂️", "🧗‍♀️", '🤺', '🏇', '⛷️', '🏂', "🏌️", "🏌️‍♂️", "🏌️‍♀️", '🏄', "🏄‍♂️", "🏄‍♀️", '🚣', "🚣‍♂️", "🚣‍♀️", '🏊', "🏊‍♂️", "🏊‍♀️", '⛹️', "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", '🚴', "🚴‍♂️", '🚴‍♀️', '🚵', "🚵‍♂️", "🚵‍♀️", '🤸', "🤸‍♂️", "🤸‍♀️", '🤼', "🤼‍♂️", "🤼‍♀️", '🤽', "🤽‍♂️", "🤽‍♀️", '🤾', "🤾‍♂️", "🤾‍♀️", '🤹', "🤹‍♂️", "🤹‍♀️", '🧘', "🧘‍♂️", "🧘‍♀️", '🛀', '🛌', "🧑‍🤝‍🧑", '👭', '👫', '👬', '💏', "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", '💑', "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", '👪', "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", '👨‍👨‍👧', "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲', '🐵'];

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}          
//=====================✓
if (config.AUTO_VOICE === 'true') {
const url = 'https://raw.githubusercontent.com/Nadeenpoorna-lk/MAIN-DATA/main/AUTO-VOICE/NADEEN-DATA'
let { data } = await axios.get(url)
for (vr in data){
if((new RegExp(`\\b${vr}\\b`,'gi')).test(body)) conn.sendMessage(from,{audio: { url : data[vr]},mimetype: 'audio/mpeg',ptt:true},{quoted:mek})   
 }}
        
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
app.get("/", (req, res) => {
res.send("hey,NADEEN-MD bot started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);  
