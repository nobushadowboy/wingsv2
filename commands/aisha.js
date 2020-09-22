const fs=require('fs');
const readline=require('readline');

module.exports={
    name: "aisha",
    description:"aisha tingz",
    run: async(bot, message, args)=>{
      const fileStream=fs.createReadStream(`lines/aisha.txt`);

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
