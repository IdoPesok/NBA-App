const express = require("express")
const app = express()
const passport = require("passport")
const mongoose = require("mongoose")


require("./config/passport")(passport)
require("./config/mongoose")(mongoose)
require("./config/app")(app)
