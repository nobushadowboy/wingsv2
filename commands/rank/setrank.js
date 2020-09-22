const Utils=require('../../utils');

module.exports={
    name:"setrank",
    description:"Set a rank",
    usage:"<level above 0> <role or clear>",
    args:true,
    permissions:["MANAGE_GUILD"],
    tables:["ranks"],
    run: async(bot, message, args, tables)=>{
        if(args.length<2){
            return message.channel.send("You must provide 2 arguments");
        } 
        const level=parseInt(args[0]);
        if(isNaN(level)||level<0) return message.reply(`that doesnt seem to be a valid number!`);
        const Ranks=tables["ranks"];
        let ranks=await Ranks.get(message.guild.id);
        if(args[1].toLowerCase()==="clear"){
            if(!ranks){
                return message.channel.send("This guild does not contain any ranks");
            }
            let rankLevel=await ranks.find(u=>u["level"]===level);
            if(!rankLevel){
                return message.channel.send(`There is no rank assigned to level ${level}`);
            }
            const index=ranks.indexOf(rankLevel);
            if(index>-1) ranks.splice(index,1);
            await Ranks.set(message.guild.id, ranks);
            return message.channel.send(`Cleared rank for level ${level}`);
        }
        const role=await Utils.getRoleFromMention(args[1], message.guild);
        if(!role) return message.reply('you must provide a valid role');
        if(!ranks){
            await Ranks.set(message.guild.id, []);
            ranks=await Ranks.get(message.guild.id);
        }
        let rankLevel=await ranks.find(u=>u["level"]===level);
        if(!rankLevel){
            ranks.push({"level": level, "role": role.id});
            await Ranks.set(message.guild.id, ranks);
            return message.channel.send(`${role.name} was set as rank for level ${level}`);
        }
        const index=ranks.indexOf(rankLevel);
        rankLevel["role"]=role.id;
        ranks[index]=rankLevel;
        await Ranks.set(message.guild.id, ranks);
        return message.channel.send(`${role.name} was set as rank for level ${level}`);
    }
};