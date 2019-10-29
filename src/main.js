"use strict"

const aws = require('aws-sdk')

// Create a new SES object.
const ses = new aws.SES({
  region: process.env.AWS_REGION
})

const createEmail = require('@realmjs/create-email')

function sendEmail({sender, recipient, template, data}) {
  const email = createEmail({sender, recipient, template, data})
   // Specify the parameters to pass to the API.
  const params = {
    Source: `${email.sender.name} <${email.sender.address}>`,
    Destination: {
      ToAddresses: [ email.recipient.address ],
    },
    Message: {
      Subject: {
        Data: email.subject, Charset: email.charset
      },
      Body: {
        Text: {
          Data:email.body.text, Charset: email.charset
        },
        Html: {
          Data: email.body.html, Charset: email.charset
        }
      }
    },
    // ConfigurationSetName: configuration_set
  }
  //Try to send the email.
  console.log(`Sending email from ${email.sender.name} <${email.sender.address}> to ${email.recipient.address}`)
  return new Promise((resolve, reject) => {
    ses.sendEmail(params, function(err, data) {
      // If something goes wrong, print an error message.
      if(err) {
        console.log(err.message)
        reject(err)
      } else {
        console.log("Email sent! Message ID: ", data.MessageId)
        resolve(data)
      }
    })
  })
}

exports.handler = async (event) => {
  await sendEmail(event)
  return 'done'
}
