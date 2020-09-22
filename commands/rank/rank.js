const Discord=require('discord.js');
const Utils=require('../../utils');

module.exports={
    name:"rank",
    description:'shows you compared to other people on the server',
    tables:["levels"],
    run: async(bot, message, args,tables)=>{
        const Levels=tables["levels"];
        const levels=await Levels.get(message.guild.id);
        let _user=message.author;
        if(args.length>0){
            const temp=await Utils.getUserFromMention(args[0], bot);
            if(temp) _user=temp;
        }
        if(!levels) return message.channel.send("There are no levels in this server");
        const actualLevels=[];
        await asyncForEach(levels, async(element)=>{
            const user=await Utils.getUserFromMention(element["id"], bot);
            if(user) actualLevels.push(element);
        });
        await actualLevels.sort((a,b)=>{
            if(a["level"]===b["level"]){
                return (a["xp"]>b["xp"])?-1:1;
            }
            return (a["level"]>b["level"])?-1:1;
        });
        const embed=new Discord.MessageEmbed();
        const shortLevels=actualLevels.slice(0,15);
        const data=[];
        let i=1;
        await asyncForEach(shortLevels, async(element)=>{
            const user=await Utils.getUserFromMention(element["id"], bot);
            if(!user) return;
            const member=await message.guild.members.cache.find(m=>m.user.id===user.id);
            if(user.id===_user.id){
                let text="";
                text+=`${i}. __**${user.username}`;
                if(member.nickname)
                    text+=` (${member.nickname})`;
                text+=`**__`;
                data.push(text);
            }
            else{
                let text="";
                text+=`${i}. **${user.username}`;
                if(member.nickname)
                    text+=` (${member.nickname})`;
                text+=`**`;
                data.push(text);
            }
            data.push(`Level: ${element["level"]} XP: ${element["xp"]}/${Utils.getXPLevel(element["level"])}`);
            i++;
        });
        const index=shortLevels.findIndex((user)=>user["id"]===_user.id);
        if(index<0){
            const userInfo=levels.find((user)=>user["id"]===_user.id);
            if(userInfo){
                data.push("...");
                const userIndex=levels.findIndex((user)=>user["id"]===_user.id);
                const member=await message.guild.members.cache.find(m=>m.user.id===_user.id);
                data.push(`${userIndex+1}. __**${member.nickname||_user.username}**__`);
                data.push(`Level: ${userInfo["level"]} XP: ${userInfo["xp"]}/${Utils.getXPLevel(userInfo["level"])}`);

            }else{
                await message.channel.send(`${_user.username} does not have any levels!`);
            }
        }
        embed.setDescription(data);
        message.channel.send(embed);
    }
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }