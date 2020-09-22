require('dotenv').config();

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { 
	execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
    token: process.env.TOKEN 
});

manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});