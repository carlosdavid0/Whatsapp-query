import axios from "axios";
import { Buttons, List } from "whatsapp-web.js";

const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
var qrcode = require('qrcode-terminal');
const { RandomPicture } = require('random-picture')
const { translate } = require('free-translate');

const WwebjsSender = require("@deathabyss/wwebjs-sender");

var random = require('random-name')

const client = new Client({
    authStrategy: new LocalAuth(),
});




interface ImageObject {
    url: string
    author?: string
    width?: number
    height?: number
}


interface piadas {
    "_id": string,
    "question": string
    "answer": string
    "lang": string
    "__v": number
}

interface conselho {
    "slip": {
        "id": number,
        "advice": string
    }
}

client.on("qr", (qr: any) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', (msg: any) => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }

    if (msg.body == 'pong') {
        msg.reply('!ping');
    }


});

client.on('message', async (msg: any) => {
    if ((msg.body === 'Todos') || (msg.body === 'todos')) {
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});



client.on('message', async (msg: any) => {
    if (msg.body === 'img') {
        const image: ImageObject = await RandomPicture()
        console.log(image);
        const media = await MessageMedia.fromUrl(image.url);
        await msg.reply(media);
    }

    if ((msg.body === 'HELTON') || (msg.body === 'helton') || (msg.body.includes((e: any) => e.toupperCase() === 'HELTON'))) {
        const chat = await msg.getChat();
        await chat.sendMessage(msg.from + ' é o Helton');
    }

    if ((msg.body === 'piada') || (msg.body === 'Piada') || (msg.body === 'Piadas') || (msg.body === 'piadas')) {

        axios.get("https://api-charadas.herokuapp.com/puzzle?lang=ptbr").then(res => {
            const piada: piadas = res.data;
            console.log(piada);
            msg.reply(`${piada.question}: ${piada.answer}`);
        })

    }
    if ((msg.body === 'conselho') || (msg.body === 'Conselho') || (msg.body === 'Conselhos') || (msg.body === 'conselhos')) {
        axios.get('https://api.adviceslip.com/advice').then(async res => {
            const conselhos: conselho = res.data;
            const conselho = await translate(conselhos.slip.advice, { from: 'en', to: 'pt' })

            msg.reply(`${conselho}`);

        })
    }

    if (msg.body === 'help') {
        msg.reply('!ping - pong\nimg - imagem aleatória\npiada - piada\nconselho - conselho\n!todos - todos os participantes do chat(valido somento em grupo)\n!helton - Helton\nhelp - Comandos básicos');
    }

    if (msg.body === 'botões de opção') {

        const buttons = [
            {
                label: 'Botão 1',
                onClick: () => {
                    console.log('Botão 1 clicado');
                }
            },
            {
                label: 'Botão 2',
                onClick: () => {
                    console.log('Botão 2 clicado');
                }
            }
        ];
        await msg.reply(buttons);

    }
});








client.initialize();