const express = require('express')
const app = express()
const { Resemble } = require('@resemble/node')
const port = process.env.PORT || 8000

Resemble.setApiKey('yr3aoLwuJUeI5XKG4THikgtt')

app.post('/', (req, res) => {
    const url = req.body.url
    if (req.body.url != null) {
        res.send(`${url}`)
    }
})

app.get('/', async (req, res) => {
    await Resemble.v2.clips.updateAsync('ec2d5337', '3a1f167e', {
        voice_uuid: '14ebc696',
        body: 'This audio will be synthesized',
        callback_uri: 'https://t2snz-gmul.onrender.com/',
        title: 'Updated',
        output_format: "wav",
        is_public: true
    }).then((res) => {
        console.log(res)
    })
})

app.listen(port, () => {
    console.log(`Listening at port : ${port}`)
})
