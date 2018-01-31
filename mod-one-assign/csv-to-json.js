const fs = require('fs')
const path = require('path')
const uuidv1 = require('uuid/v1')
const csv = require('csvtojson')
const request = require('request')

const downloadPage = (url) => {

    const csvToJson = (callback) => {
        let jsonObj = [];

        csv().fromStream(request.get(url)).on('json', (csvData) => {
            jsonObj.push(csvData)
        }).on('end', () => {
            callback(null, jsonObj)
        }).on('error', (err) =>  {
            console.error(`Got error : ${err.message}`)
            callback(err)
        })
    }
  
    const folderName = uuidv1()
    fs.mkdirSync(folderName)
    csvToJson((err, jsonObj) => {
        if (err)  return console.log(err)
        fs.writeFileSync(path.join(__dirname, folderName, 'data.json'), JSON.stringify(jsonObj, null, 2))
        console.log('Convertion is done in folder ', folderName)
    })
}

downloadPage(process.argv[2])