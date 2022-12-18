
exports.handler = async event => {
  console.log(event)
  event.Records.forEach((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2))
  })
}
