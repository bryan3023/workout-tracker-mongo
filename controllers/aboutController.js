const path = require('path')

const AboutController = {

  getAbout(req, res) {
    res.sendFile(path.join(__dirname, "../public/about.html"))
  }

}

module.exports = AboutController