module.exports={
    name:"checkrank",
    permissions:["MANAGE_GUILD"],
    tables:["levels","ranks"],
    run: async(bot, message,args,tables)=>{
        const Levels=tables["levels"];
        const Ranks=tables["ranks"];
        const levels=await Levels.get(message.guild.id);
        const ranks=await Ranks.get(message.guild.id);
        if(!levels||!ranks) return message.channel.send("There are no levels or ranks D:");
        message.guild.members.cache.forEach(member => {
            const user=levels.find(u=>u["id"]===member.user.id);
            if(user){
                ranks.forEach(rank => {
                    if(user["level"]>=rank["level"]){
                        const role=message.guild.roles.cache.get(rank["role"]);
                        member.roles.add(role);
                    }
                });
            }
        });
        message.channel.send("done");
    }
};