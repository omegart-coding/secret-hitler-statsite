require('dotenv').config()
const express = require('express')
const app = express()
const pool = require('./dbconnector.js');
const cors = require('cors')
const routes = require('./routes.js')
const port = 3000
const serverIp = process.env.SERVER_IP
app.use(routes)
app.use(cors())
app.use(express.json()) 


app.get('/rounds', async (req, res) => {
    let query = 'SELECT * FROM rounds;'
      try {
        let data = await pool.query(query)

        for (let i=0; i < await data.length; i++) {
            let round_date = data[i].date.toISOString()
            data[i].date = round_date.split('T')[0]
        }
        res.send(data)
      } catch (error) {
        console.log(error);
      } 
})

app.post('/secure', async (req, res) => {
    const auth = req.body
    let obj
    try {
        obj = JSON.parse(process.env.SH_USERS)

    } catch(error) {
        console.log(error)
    }
    if (obj != null) {
        try {
            if (Object.keys(obj).includes(auth.username)) {
                let objnr
                for (let i=0; i < Object.keys(obj).length; i++) {
                    if (auth.username == Object.keys(obj)[i]) {
                        objnr = i
                        break
                    }
                }
                if (auth.passcode == obj[Object.keys(obj)[objnr]]) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            } else {
                res.send(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
})



app.post('/new_round', async (req, res) => {
    let new_round = req.body
    let names = ['Alex', 'Anna', 'Charlotte', 'Elisabeth', 'Erle', 'Kine', 'Nicholai', 'Nikolai', 'Sander', 'Sofiia', 'Storm', 'Åse']
    for (let i=0; i < names.length; i++) {
        if (new_round[names[i].toLowerCase()] == 'h') {
            new_round[names[i].toLowerCase()] = 'H'
        }
    }
    let query = `INSERT INTO rounds VALUES ("${new_round.date}", ${new_round.round}, "${new_round.winner}", "${new_round.alex}", "${new_round.anna}", "${new_round.charlotte}", "${new_round.elisabeth}", "${new_round.erle}", "${new_round.kine}", "${new_round.nicholai}", "${new_round.nikolai}", "${new_round.sander}", "${new_round.sofiia}", "${new_round.storm}", "${new_round.åse}", "${new_round.editor}");`
    try {
        let new_round = await pool.query(query)
        res.send(new_round)
    } catch (error) {
        console.log(error)
    }
})


app.listen(port, serverIp, () => {
    console.log(`Server running at http://${serverIp}:${port}`)
  })
