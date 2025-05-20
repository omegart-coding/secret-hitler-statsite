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
    winner_setup()
    insert_setup()
}


function winner_setup() {
    let roles = ['l','f']
    let form = document.createElement('form')
    form.value = ''
    form.classList.add('round_winner')
    form.id ='winner_selection'

    for (let i=0; i < roles.length; i++) {
        let cell = document.createElement('div')
        cell.classList.add('switch')
        cell.id = roles[i] + '_winner'
        let cell_input = document.createElement('input')
        cell_input.type = 'radio'
        cell_input.name = 'roles_selection'
        cell_input.id = roles[i] + '_input'
        cell_input.value = roles[i]
        let cell_label = document.createElement('label')
        cell_label.htmlFor = cell_input.id
        cell_label.innerHTML = roles[i]
        cell.onclick = function(){set_winner(cell_input)}

        cell.appendChild(cell_input); cell.appendChild(cell_label)
        form.appendChild(cell)
    }
    document.getElementById('winner_select').appendChild(form)
}


function insert_setup() {
    let names = ['Alex', 'Anna', 'Charlotte', 'Elisabeth', 'Erle', 'Kine', 'Nicholai', 'Nikolai', 'Sander', 'Sofiia', 'Storm', 'Åse']
    let roles = ['h', 'f', 'l', 'n']
    for (let i=0; i < names.length; i++) {
        let form = document.createElement('form')
        form.value = 'n'
        form.classList.add('person')
        form.id = names[i].toLowerCase()
        let name_title_outer = document.createElement('div')
        let name_title = document.createElement('p')
        name_title.innerHTML = names[i]
        name_title_outer.appendChild(name_title)
        form.appendChild(name_title_outer)
        for (let g=0; g < roles.length; g++) {
            let cell = document.createElement('div')
            cell.classList.add('switch')
            cell.id = names[i].toLowerCase() + '_' + roles[g]
            let cell_input = document.createElement('input')
            cell_input.type = 'radio'
            cell_input.name = names[i].toLowerCase()
            cell_input.id = names[i].toLowerCase() + '_' + roles[g] + 'input'
            cell_input.value = roles[g]
            let cell_label = document.createElement('label')
            cell_label.htmlFor = cell_input.id
            cell_label.innerHTML = roles[g]
            cell.onclick = function(){set_round(cell_input.name, cell_input, cell.id)}

            if (roles[g] == 'n') {
                cell_input.checked = true
            }

            cell.appendChild(cell_input); cell.appendChild(cell_label)
            form.appendChild(cell)
        }
        if (Number.isInteger(i / 2)) {
            document.getElementById('table_left_half').appendChild(form)
        } else {
            document.getElementById('table_right_half').appendChild(form)
        }

    }
    
}

addEventListener("keydown", (e) => {
    if (!e.repeat && e.key === 'Enter') {
        check_data()
    }
});

async function check_data() {
    const username = document.getElementById('username_input').value
    const passcode = document.getElementById('password_input').value
    if (username != null && username != '' && passcode != null && passcode != '') {
        try {
            const authentication = {username: username, passcode: passcode}
            const result = await fetch(api_url + '/secure', {
                method: 'POST',
                body: JSON.stringify(authentication),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }).then((response) => {
                if (response.ok) {
                    return response.json()
                }
            }).catch((error) => {
                console.log(error)
            })

            if (result == true) {
                if (document.getElementById('winner_selection').value == 'l' || document.getElementById('winner_selection').value == 'f') {
                    append_data(username)
                } else {
                    window.alert('Missing winner')
                }
            } else {
                window.alert('Username or password did not match')
            }
            
        } catch (error) {
            console.log(error)
        }
        } else {
            window.alert('username or passcode not defined')
        }
}


function append_data(editor) {
    let names = ['Alex', 'Anna', 'Charlotte', 'Elisabeth', 'Erle', 'Kine', 'Nicholai', 'Nikolai', 'Sander', 'Sofiia', 'Storm', 'Åse']
    let val = {}
    for (let i=0; i < names.length; i++) {
        val[names[i].toLowerCase()] = document.getElementById(names[i].toLowerCase()).value
    }

    let current_day = function () {
        let today = new Date;
        let dd = String(today.getDate()).padStart(2, '0')
        let mm = String(today.getMonth() + 1).padStart(2, '0')
        let yyyy = today.getFullYear()
        return (yyyy + '-' + mm + '-' + dd)
    }

    

    let last_win = function () {
        let res = document.getElementById('winner_selection').value
        if (res == 'l' || res == 'f') {
            return res
        } else {
            return null
        }
    }

    if (current_day != null && last_win != null) {
        let new_round = {date: current_day(), round: rounds_list.length+1, winner: last_win(),alex: val.alex,anna: val.anna,charlotte: val.charlotte,elisabeth: val.elisabeth,erle: val.erle,kine: val.kine,nicholai: val.nicholai,nikolai: val.nikolai,sander: val.sander,sofiia: val.sofiia,storm: val.storm,åse: val.åse,editor: editor}
        fetch(api_url + '/new_round', {
            method: 'POST',
            body: JSON.stringify(new_round),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(function (data) {
          console.log(data);
        })
        .catch((error => {
            console.log(error)
        }))
        window.alert('Data inserted')
    } else {
        window.alert('Error in input')
    }
    window.location.reload()
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

function set_winner(role) {
    document.getElementById('winner_selection').value = role.value

    document.getElementById(role.id).checked = true
}


function set_round(pers, role) {
    document.getElementById(pers).value = role.value

    document.getElementById(role.id).checked = true
}

