
exports.handler = async event => {
  for (var record in event['Records']) {
    console.log(record)
  }
}
