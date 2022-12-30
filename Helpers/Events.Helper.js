const amqp = require('amqplib')
const SMSController = require('../Controllers/SMS.Controller')
module.exports = class {
    constructor(){
        this.sms = new SMSController()
        this.channel = null
    }
    Connect = (QueName)=>{
       return new Promise(async (resolve, reject)=>{
            try {
                console.log('Connecting to Cloud RabbitMQ Server...')
                const connection = await amqp.connect(process.env.AMQP_URL)
                const channel = await connection.createChannel()
                await channel.assertQueue(QueName)
                console.log('Queue connection established!\n\nListening to %s channel', QueName)
                resolve(channel)
            } catch (ex) {
                console.error('Connection Failed.\nRetrying...')
                reject(ex)
            }
       })
    }

    Publish =  (json_data, QueName)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                
                this.channel = this.channel == null ? await this.Connect(QueName) : this.channel
                if(this.channel != "error"){
                    console.log('Publishing event to Que...')
                    this.channel.sendToQueue(QueName, Buffer.from(JSON.stringify(json_data)))
                    this.channel.close()
                    resolve('Message published to '+QueName+' Queue!')
                }else{
                    reject('Failed to Publish Event to Queue: '+QueName)
                } 
            }catch(err){
                reject(err.message)
            }
        })
    }
    
    Consume = async (QueName)=>{
        
        try{
            this.channel = this.channel == null ? await this.Connect(QueName) : this.channel
            console.log('Waiting for messages...')
            this.channel.consume(QueName,data=>{
                console.log('Job Received!')         
                this.sms.CaptureMessage(data.content.toString(), QueName)
                .then(()=>{
                    console.log('De-Queueing the Server...')
                    this.channel.ack(data)
                    console.log("Waiting for new messages...")
                }).catch(err=>{
                    console.log(err)
                    console.log('Event maintained for later processing.')
                })
            })
        }catch(e){
            console.log(e)
            console.log('Failed to Connect To RabbitMQ Server.\nRetrying...')
        }
    }
}