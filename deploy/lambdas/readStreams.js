
exports.handler = async event => {
  console.log(JSON.parse(event))
  for (var record in event['Records']) {
    console.log(JSON.parse(record))
  }
}
