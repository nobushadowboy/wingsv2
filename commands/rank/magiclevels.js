const Utils=require('../../utils');

module.exports={
    name:"magiclevels",
    description:'shows how far you are to the next transformation',
    usage:"[user]",
    tables:["levels"],
    run: async(bot, message, args, tables)=>{
        let user=await Utils.getUserFromMention(args[0], bot);
        if(!user) user=message.author;
        if(user) if(user.bot) return message.channel.send(`${user.username} is a bot, no levels`);
        const Levels=tables["levels"];
        let serverInfo=await Levels.get(message.guild.id);
        if(!serverInfo){
            await Levels.set(message.guild.id, []);
            serverInfo=await Levels.get(message.guild.id);
        }
        let userInfo=await serverInfo.find(u=>u["id"]===user.id);
        if(!userInfo){
            await serverInfo.push({"id":user.id, "xp":0, "level":0});
            userInfo=await serverInfo.find(u=>u["id"]===user.id);
        }
        const member=await message.guild.members.cache.find(m=>m.user.id===user.id);
        let text="";
        text+=`${user.username}`;
        if(member.nickname)
            text+=` (${member.nickname})`;
        text+=`: Level: ${userInfo["level"]} XP: ${userInfo["xp"]}/${Utils.getXPLevel(userInfo["level"])}`;
        message.channel.send(text);
    }
};