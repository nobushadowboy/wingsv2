const Discord=require('discord.js');

module.exports={
    name:"help",
    description: "List all of my commands\n or info about a specific command",
    aliases: ["commands"],
    category: "Helpful",
    usage: "[command]",
    cooldown:2,
    run: async(bot, message, args)=>{
        const data=[];
        const {commands}=bot;

        if(!args.length){
            //const list={};
            /*let i=0;
            commands.forEach(command => {
                if(!command.hidden){
                    let category=command.category;
                    if(!command.category) category="Other";
                    category=`${category}`.toUpperCase();
                    if(!(category in list)){
                        list[category]=[i];
                        list[category].push(`**${command.name}:** ${command.description||""}`);
                        i++;
                    }else{
                        list[category].push(`**${command.name}:** ${command.description||""}`);
                    }
                }
                //data.push(`**${command.name}:** ${command.description}`);
            });*/
            /*for(var key in list){
                data.push(key);
                data.push(list[key].join("\n"));
            }*/
            //data.push(commands.map(command=>command.name).join("\n"));
            //data.push(`\nYou can use \`${process.env.PREFIX}help [command]\` to get info on a specific command!`);

            /*const embed=new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription("**Here's a list of all my commands:**");*/

            /*const increments=5;

            const generateEmbed = start =>{
                const currentList=commands.array().slice(start, start+increments);
                /*for(var key in list){
                    if(list[key][0]>=start+increments) break;
                    if(list[key][0]>=start){
                        const tempList=list[key];
                        currentList[key]=tempList.slice(1,tempList.length);
                    }
                }

                const embed = new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`Showing commands ${start+1}-${start + currentList.length} out of ${commands.array().length}`);
                for(var command in currentList){
                    //embed.addField(command.name, command.description||"", true);
                    //console.log(command);
                }
                currentList.forEach(element => {
                    embed.addField(element.name, element.description||"No description", true);
                });
                embed.addField("\u200B",data);
                return embed;
            };

            return message.channel.send(generateEmbed(0)).then(msg => {
                // exit if there is only one page of guilds (no need for all of this)
                if (commands.length <= increments) return;
                // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                msg.react('➡️');

                const authorId=message.author.id;
                const collector = msg.createReactionCollector(
                // only collect left and right arrow reactions from the message author
                (reaction, user) => (['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === authorId),
                // time out after 2 minutes
                {time: 120000}
                );

                collector.on('end', ()=>{
                    msg.reactions.removeAll();
                });

                let currentIndex = 0;
                collector.on('collect', reaction => {
                    // remove the existing reactions
                    msg.reactions.removeAll().then(async () => {
                        // increase/decrease index
                        reaction.emoji.name === '⬅️' ? currentIndex -= increments : currentIndex += increments;
                        // edit message with new embed
                        msg.edit(generateEmbed(currentIndex));
                        // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                        if (currentIndex !== 0) await msg.react('⬅️');
                        // react with right arrow if it isn't the end
                        if (currentIndex + increments < commands.array().length) msg.react('➡️');
                    });
                });
            });*/

            const embed = new Discord.MessageEmbed()
			.setColor('#FFC0CB')
			.setTitle('Help')
			.setDescription('the commands that are available on this bot')
			.setThumbnail(bot.user.displayAvatarURL())
			.addFields(
				{ name: '\u200B', value: '\u200B' },
				{ name: 'characters', value: 'commands that use w!(character name)' },
				{ name: 'musa', value: 'musa tingz', inline: true },
				{ name: 'aisha', value: 'aisha tingz', inline: true },
				{ name: 'flora', value: 'flora tingz', inline: true },
				{ name: 'tecna', value: 'tecna tingz', inline: true },
				{ name: 'stella', value: 'stella tingz', inline: true },
				{ name: 'bloom', value: 'bloom tingz', inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'levels', value: 'commands that are for leveling' },
        { name: 'rank', value: 'shows you compared to other people on the server', inline: true },
        { name: 'ranks', value: 'shows what ranks are available currently', inline: true },
				{ name: 'magiclevels', value: 'shows how far you are to the next transformation', inline: true },
				{ name: '\u200B', value: '\u200B' },
			)
			.setFooter('wings - made by @nobu#9809 and @app24#8627');

            return message.channel.send(embed);
        }

        const name=args.join(" ").toLowerCase();
        const command=commands.get(name)||commands.find(c=>c.aliases&&c.aliases.includes(name));

        if(!command){
            return message.reply("That is not a valid command!");
        }

        addToData(data, command);

        const embed=new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setDescription(data, {split: true});

        message.channel.send(embed);
    }
};

function addToData(data, command){
    data.push(`**Name:** ${command.name}`);

    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** ${process.env.PREFIX}${command.name} ${command.usage}`);
    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);

    if(command.cooldown) data.push(`**Cooldown:** ${command.cooldown} second(s)`);
    if(command.permissions) data.push(`**Permissions:** ${command.permissions}`);

    if(command.ownerOnly) data.push(`**Owner Only**`);

    data.push("\u200B");
}
