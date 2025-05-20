const host = window.location.protocol + "//" + window.location.host
const api_url = 'http://localhost:3000'

let rounds_list = []

window.onload = async function fetchData() {
    try {
        const resp = await fetch(api_url + "/rounds").then(function(response) {
            return response.json()
        })
        rounds_list = resp
    } catch (error) {
        console.log(error)
    } finally {
        set_up()
    }
}

function set_up() {
    find_last_hit()
}


function find_last_hit() {
    let last_round = rounds_list[rounds_list.length - 1]
    let keys = []
    let values = []
    for (const [key, value] of Object.entries(last_round)) {
        keys.push(key)
        values.push(value)
    }

    for (let i=0; i < keys.length; i++) {
        if (values[i] == 'H') {
            update_last_hit(keys[i])
            break   
        }
    }
    update_list()
}

function update_last_hit(val) {
    document.getElementById('last_hit').innerHTML = 'Last Hitler was ' + val.charAt(0).toUpperCase() + val.slice(1)
}



function update_list() {
    
    let names = ['Alex', 'Anna', 'Charlotte', 'Elisabeth', 'Erle', 'Kine', 'Nicholai', 'Nikolai', 'Sander', 'Sofiia', 'Storm', 'Åse']
    for (let i=0; i < names.length; i++) {
        let name = names[i]
        let hit = function () {
            let val = 0
            for (let y=0; y < rounds_list.length; y++) {
                if (rounds_list[y][name.toLowerCase()] == 'H') {
                    val += 1
                }
            }
            return val
        }
        let fas = function () {
            let val = 0
            for (let y=0; y < rounds_list.length; y++) {
                if (rounds_list[y][name.toLowerCase()] == 'f') {
                    val += 1
                }
            }
            return val
        }
        let lib = function () {
            let val = 0
            for (let y=0; y < rounds_list.length; y++) {
                if (rounds_list[y][name.toLowerCase()] == 'l') {
                    val += 1
                }
            }
            return val
        }
        let wins = function () {
            let val = 0
            for (let y=0; y < rounds_list.length; y++) {
            if (rounds_list[y][name.toLowerCase()].toLowerCase() == rounds_list[y]['winner'].toLowerCase()) {
                val += 1
            }
            }
            return val
        }
        let total = hit() + fas() + lib()

        let winrate = function () {
            if (total != 0) {
                return ((wins() / total) * 100).toFixed(0) + '%'
            } else {
                return 0 + '%'
            }
        } 
        create_row(name, hit(), fas(), lib(), wins(), total, winrate())
    }
}

function create_row(name, hit, fas, lib, wins, total, winrate) {
    let row = document.createElement('tr')
    let info = [name, hit, fas, lib, wins, total, winrate]
    row.style.fontFamily = 'fancy_text'
    row.style.textAlign = 'center'
    for (let i=0; i < 7; i++) {
        let cell = document.createElement('td')
        cell.innerHTML = info[i]
        cell.style.paddingTop = '1.2vh'
        cell.style.paddingBottom = '1.2vh'
        cell.style.border = '3px solid black'
        row.appendChild(cell)
    }
    document.getElementById('overview').appendChild(row)
}



function click_home() {
    window.location.href='../home/index.html'
}
function click_insert() {
    window.location.href='../insert/index.html'
}
function click_refresh() {
    window.location.reload()
}

