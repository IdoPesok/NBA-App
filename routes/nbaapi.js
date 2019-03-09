const express = require("express")
const router = express.Router()
const axios = require("axios")


router.get("/schedule", (req, res) => {
    var scheduleApiUrl = "https://stats.nba.com/stats/scoreboard/?GameDate=" + getFormattedDate() + "&LeagueID=00&DayOffset=0"
    axios.get(scheduleApiUrl)
        .then(response => {
            var data = response.data["resultSets"][0]["rowSet"]

            data.forEach(game => {
                var homeTeam = teamIdDict[game[6]]
                var awayTeam = teamIdDict[game[7]]

                game.push(homeTeam)
                game.push(awayTeam)
            })

            res.render("nbaapi/schedule", { data: data })
        })
        .catch(error => {
            res.send(error)
        })
})

router.get("/standings", (req, res) => {
    var apiUrl = "https://stats.nba.com/stats/scoreboard/?GameDate=" + getFormattedDate() + "&LeagueID=00&DayOffset=0"
    axios.get(apiUrl)
        .then(response => {
            var data = response.data

            var eastData = data["resultSets"][4]
            for (var i = 0; i < eastData["rowSet"].length; i++) {
                eastData["rowSet"][i].push(i + 1)
            }
            var westData = data["resultSets"][5]
            for (var i = 0; i < westData["rowSet"].length; i++) {
                westData["rowSet"][i].push(i + 1)
            }

            res.render("nbaapi/standings", { east: eastData, west: westData })
        })
        .catch(error => {
            res.send(error)
        })
})

function getFormattedDate() {
    var date = new Date()

    var day = date.getDate().toString()
    if (day < 10) {
        day = "0" + day
    }

    var month = (date.getMonth() + 1).toString()
    if (month < 10) {
        month = "0" + month
    }

    var year = date.getFullYear().toString()

    return month + "/" + day + "/" + year
}

async function getTeamData(teamId) {
    return new Promise((resolve, reject) => {
        var apiUrl = "https://stats.nba.com/stats/teaminfocommon/?TeamID=" + teamId + "&Season=2018-19&SeasonType=Regular%20Season&LeagueID=00"
        axios.get(apiUrl)
            .then(response => {
                var data = response.data["resultSets"][0]["rowSet"][0]
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var teamIdDict = {
    1610612737: "Atlanta Hawks",	
    1610612738: "Boston Celtics",
    1610612751: "Brooklyn Nets",
    1610612766: "Charlotte Hornets",
    1610612741: "Chicago Bulls",
    1610612739: "Cleveland Cavaliers",
    1610612742: "Dallas Mavericks",
    1610612743: "Denver Nuggets",
    1610612765: "Detroit Pistons",
    1610612744: "Golden State Warriors",
    1610612745: "Houston Rockets",
    1610612754: "Indiana Pacers",
    1610612746: "Los Angeles Clippers",
    1610612747: "Los Angeles Lakers",
    1610612763: "Memphis Grizzlies",
    1610612748: "Miami Heat",
    1610612749: "Milwaukee Bucks",
    1610612750: "Minnesota Timberwolves",
    1610612740: "New Orleans Pelicans",
    1610612752: "New York Knicks",
    1610612760: "Oklahoma City Thunder",
    1610612753: "Orlando Magic",
    1610612755: "Philadelphia 76ers",
    1610612756: "Phoenix Suns",
    1610612757: "Portland Trail Blazers",
    1610612758: "Sacramento Kings",
    1610612759: "San Antonio Spurs",
    1610612761: "Toronto Raptors",
    1610612762: "Utah Jazz",
    1610612764: "Washington Wizards"
}


module.exports = router
