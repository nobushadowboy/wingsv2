const Discord=require('discord.js');

module.exports={
    name:"ranks",
    description:"Get a rank",
    usage:"[level above 0]",
    tables:["ranks"],
    run: async(bot, message, args, tables)=>{
        const Ranks=tables["ranks"];
        let ranks=await Ranks.get(message.guild.id);
        if(!ranks){
            return message.channel.send("This guild does not contain any ranks");
        }
        const embed=new Discord.MessageEmbed();
        const data=[];
        const tempData=[];
        ranks.forEach(element => {
            tempData.push({"level":element["level"],"text":`**Level ${element["level"]}:** ${message.guild.roles.cache.find(role=>role.id===element["role"])||"Deleted Role"}`});
        });
        await tempData.sort((a, b)=>a["level"]-b["level"]);
        tempData.forEach(element=>{
            data.push(element["text"]);
        });
        embed.setDescription(data);
        return message.channel.send(embed);
    }
};