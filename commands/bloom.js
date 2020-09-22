const fs=require('fs');
const readline=require('readline');

module.exports={
    name: "bloom",
    description:"bloom tingz",
    run: async(bot, message, args)=>{
        const fileStream=fs.createReadStream(`lines/bloom.txt`);

		const rl=readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
		});

		const data=[];

		for await (const line of rl){
			data.push(line);
		}

		message.channel.send(data[Math.floor(Math.random()*data.length)]);
    }
};