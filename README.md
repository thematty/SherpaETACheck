# Sherpa Technical Interview Exercise

You'll be writing a simple NodeJS RESTful API endpoint using express and Typescript. The boilerplate for the project is already available in this project so you don't have to start from scratch.

We need the ability to check the status of an existing Electronic Travel Authorization (eTA) by calling the service provided by the Austrialian government.

## Get Set Up

- Familiarize yourself with the project structure
- Run the project
- Run the existing tests of the project

## Checking eTA Status Using Browser 🦘

Doing it manually:

1. Go to https://www.eta.homeaffairs.gov.au/ETAS3/etas
2. Click `Check an eTA`
3. Enter details listed below
4. You should get different responses.

## Implement

1. Design an API response based on manual interactions with Australian eTA System.
2. Use your development skills to implement an automatic check of the eTA status based on incoming request payload.
3. The result should be a RESTful API that checks the validity of an Australian eTA at `/api/check` path.

### Example Payloads

Please note that we currently do not have a payload that returns a "valid" eTA.

Payload for an eTA that is "not found".

```javascript/json
{
  "nationality": "CAN",
  "passportNumber": "HN971476",
  "referenceNumber": "80246096",
  "dateOfBirth": "1990-03-31"
}
```

Payload for an eTA that is "expired".

```javascript/json
{
  "nationality": "US",
  "passportNumber": "494061902",
  "referenceNumber": "79968076",
  "dateOfBirth": "1979-08-23"
}
```

### Expected 200 OK

```javascript/json
{
  "status": "",
  "referenceNumber": "",
  "familyName: "",
  "givenNames": "",
  "expiryDate": "YYYY-MM-DD",
}
```
