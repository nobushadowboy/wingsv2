const Discord=require('discord.js');
const parser=require('discord-command-parser');
const fs=require('fs');
const Keyv=require('keyv');
const Utils=require('./utils');

const client=new Discord.Client();
const commandFiles=fs.readdirSync("./commands");
const cooldowns = new Discord.Collection();

client.commands=new Discord.Collection();

const Levels = new Keyv('sqlite://databases/levels.sqlite');
const Ranks = new Keyv('sqlite://databases/ranks.sqlite');

const tables={};
tables["levels"]=Levels;
tables["ranks"]=Ranks;

client.once("shardReady", (shardId)=>{
    console.log(`Shard ${shardId} is ready!`);
});

for (const file of commandFiles) {
    if(file.endsWith(".js")){
    const command = require(`./commands/${file}`);

	// set a new item in the Collection
    // with the key as the command name and the value as the exported module
    if(!command.deprecated) client.commands.set(command.name, command);
    }else{
        for(const f of fs.readdirSync(`./commands/${file}`)){
            const command = require(`./commands/${file}/${f}`);

            // set a new item in the Collection
            // with the key as the command name and the value as the exported module
            if(!command.deprecated) client.commands.set(command.name, command);
        }
    }
}

const capXp=new Discord.Collection();

const xpPerMessage=5;
const messagesPerMinute=50;

client.on("message", async(message)=>{
    if(!message.content.startsWith(process.env.PREFIX)||message.author.bot||message.channel.type==='dm'){
        if(message.author.bot||message.channel.type==='dm') return;
        if(!capXp.has(message.author.id)){
            capXp.set(message.author.id, []);
        }
        const xpData=capXp.get(message.author.id);
        if(xpData.length>=messagesPerMinute) return;
        const newData=Date.now();
        xpData.push(newData);
        setTimeout(()=>{
            const index=xpData.indexOf(newData);
            xpData.splice(index, 1);
        }, 60*1000);


        let serverInfo=await Levels.get(message.guild.id);
        if(!serverInfo){
            await Levels.set(message.guild.id, []);
            serverInfo=await Levels.get(message.guild.id);
        }
        let userInfo=await serverInfo.find(user=>user["id"]===message.author.id);
        if(!userInfo){
            await serverInfo.push({"id":message.author.id, "xp":0, "level":0});
            userInfo=await serverInfo.find(user=>user["id"]===message.author.id);
        }
        const index=serverInfo.indexOf(userInfo);
        userInfo["xp"]+=xpPerMessage;
        if(userInfo["xp"]>=Utils.getXPLevel(userInfo["level"])){
            userInfo["xp"]-=Utils.getXPLevel(userInfo["level"]);
            userInfo["level"]++;
            let ranks=await Ranks.get(message.guild.id);
            if(!ranks){
                return;
            }
            let rankLevel=await ranks.find(u=>u["level"]===userInfo["level"]);
            if(rankLevel){
                const user=message.guild.member(message.author);
                if(!user){
                    return message.channel.send("error somewhere idk 🤷‍♀️🤷‍♀️");
                }
                const rank=message.guild.roles.cache.get(rankLevel["role"]);
                user.roles.add(rank);
                message.channel.send(`${message.author} has earned a new transformation called ${rank.name}. amazing work!`);
            }
            message.channel.send(`${message.author} has leveled up to level ${userInfo["level"]}`);
        }
        serverInfo[index]=userInfo;
        Levels.set(message.guild.id, serverInfo);
        return;
    }

    const parsed=parser.parse(message, process.env.PREFIX);
    if(!parsed.success) return;
    const commandName=parsed.command.toLowerCase();
    const args=parsed.arguments;

    const command=client.commands.get(commandName)||client.commands.find(cmd=>cmd.aliases&&cmd.aliases.includes(commandName));

    if(!command) return;

    if(command.permissions){
        if(!message.member.hasPermission(command.permissions)) return message.reply(`You do not have permissions to use this command!`);
    }

    if(command.guildOnly&&message.channel.type!=='text'){
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now=Date.now();
    const timestamps=cooldowns.get(command.name);
    const cooldownAmount=(command.cooldown||3)*1000;

    if(timestamps.has(message.author.id)){
        const expirationTime=timestamps.get(message.author.id)+cooldownAmount;

        if(now < expirationTime){
            const timeLeft=(expirationTime-now)/1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(()=>timestamps.delete(message.author.id), cooldownAmount);

    if(command.args&&!args.length){
        let reply=`You didn't provide any arguments, ${message.author}`;

        if(command.usage){
            reply+=`\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    let table={};
    if(command.tables){
        command.tables.forEach(element=>{
            if(tables[element]){
                table[element]=tables[element];
            }
        });
    }

    try{
        await command.run(client, message, args, table);
    }catch(error){
        console.error(error);
        message.reply("There was a problem executing that command!");
    }
});

client.login(process.env.TOKEN);

module.exports={
    getXPLevel(level){
        return level*2*100+50;
    }
};
