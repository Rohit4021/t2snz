const express = require('express')
const app = express()
const path = require('path')
const { Resemble } = require('@resemble/node')
const fs = require('fs')
const request = require('request')
const port = process.env.PORT || 8000

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname + '/views')))

Resemble.setApiKey('yr3aoLwuJUeI5XKG4THikgtt')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.post('/stream', (req, res) => {

    const hi = async () => {
        const get = await Resemble.v2.clips.get('ec2d5337', '3a1f167e')

        const convertString = JSON.stringify(get)
        const parseString = JSON.parse(convertString)

        return parseString.item.audio_src
    }

    const headers = {
        'Authorization': 'Token token=yr3aoLwuJUeI5XKG4THikgtt',
        'Content-Type': 'application/json'
    }

    const dataString = `{"callback_uri": "https://localhost:8000", "title": "${req.body.content}", "body": "${req.body.content}", "voice_uuid": "14ebc696", "is_public": true, "is_archived": false}`;

    const options = {
        url: 'https://app.resemble.ai/api/v2/projects/ec2d5337/clips/3a1f167e',
        method: 'PUT',
        headers: headers,
        body: dataString
    }

    const callback = (error, response, body) => {
        if (!error && response.statusCode === 200) {
            app.locals.parse = JSON.parse(response.body)
            console.log(response.body)
        } else if (response.statusCode !== 200) {
            console.log("Failed")
            console.log(response)
            console.log(response.statusCode)
        }
    }

    request(options, callback)

    setTimeout(async () => {
        const url = await hi()
        await res.write('<html lang="en">\n' +
            '<head>\n' +
            '    <title>Get Clip</title>\n' +
            '    <style>\n' +
            '        body {\n' +
            '            display: flex;\n' +
            '            align-items: center;\n' +
            '            width: 99%;\n' +
            '            justify-content: center;\n' +
            '        }\n' +
            '\n' +
            '        form {\n' +
            '            align-items: center;\n' +
            '        }\n' +
            '\n' +
            '        hr {\n' +
            '            background-color: white;\n' +
            '            border: none;\n' +
            '        }\n' +
            '\n' +
            '        input[type=text] {\n' +
            '            height: 4rem;\n' +
            '            width: 25rem;\n' +
            '            border-radius: 5rem;\n' +
            '            outline: none;\n' +
            '            font-size: 1.5rem;\n' +
            '            border: none;\n' +
            '            background-color: blue;\n' +
            '            color: red;\n' +
            '            text-align: center;\n' +
            '        }\n' +
            '    </style>\n' +
            '</head>\n' +
            '<body>\n' +
            '<center>\n' +
            '    <form action="/stream" method="post">\n' +
            '        <label for="text">Enter Text To Synthesize</label>\n' +
            '        <br>\n' +
            '        <hr>\n' +
            '        <input name="content" type="text" id="text">\n' +
            '        <br>\n' +
            '        <hr>\n' +
            '        <input type="submit" value="SYNTHESIZE">\n' +
            '    </form>\n' +
            '</center>\n' +
            `<audio id="aud"><source src="${url}"></audio>\n` +
            '<script>' +
            'const audio = document.getElementById("aud");' +
            'audio.play();' +
            '</script>' +
            '</body>\n' +
            '</html>')
        await res.end()
    }, 10000)
})

app.listen(port,() => {
    console.log(`Listening at port : ${port}`)
})
