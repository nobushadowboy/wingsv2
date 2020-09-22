const Utils=require('../utils');

module.exports={
    name:"setrole",
    permissions:["MANAGE_GUILD"],
    args:true,
    usage: "<role>",
    run: async(bot,message,args)=>{
        const role=await Utils.getRoleFromMention(args[0], message.guild);
        if(!role) return message.channel.send("Not a valid role");
        message.guild.members.cache.forEach(element => {
            if(element.user.bot) return;
            element.roles.add(role);
        });
        message.channel.send(`Set role \`${role.name}\` to every human`);
    }
};
