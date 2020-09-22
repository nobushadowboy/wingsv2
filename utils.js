const Discord=require('discord.js');

module.exports={
    getXPLevel: function(level){
        return level*2*100+50;
    },
    getUserFromMention: async(mention, client)=> {
        if(!client||!mention) return;
        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<@!?(\d+)>$/);
    
        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) {
            const member=await client.shard.broadcastEval(`
            const member=this.users.cache.get('${mention}');
            if(member){
                member;
            }else{
                undefined;
            };
            `);
            if(!member[0]) return undefined;
			
            return new Discord.User(client, member[0]);
        }
    
        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        const member=await client.shard.broadcastEval(`
        const member=this.users.cache.get('${id}');
        if(member){
            member;
        }else{
            undefined;
        }
        `);
        if(!member[0]) return undefined;
        
        return new Discord.User(client, member[0]);
    },
    getChannelFromMention: function(mention, guild) {
        if(!guild||!mention) return;
        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<#!?(\d+)>$/);
    
        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches){
            return guild.channels.cache.find(t=>t.id===mention);
        }
    
        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];
    
        return guild.channels.cache.find(t=>t.id===id);
    },
    getRoleFromMention: function(mention, guild) {
        if(!guild||!mention) return;
        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<@&?(\d+)>$/);
    
        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches){
            return guild.roles.cache.find(t=>t.id===mention);
        }
    
        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];
    
        return guild.roles.cache.find(t=>t.id===id);
    },
};