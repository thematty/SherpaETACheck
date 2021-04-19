import { raw, Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
const cookieParser = require("cookie-parser");
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);

const fetch = require('node-fetch');
const router = Router();
const reqURL = 'https://www.eta.homeaffairs.gov.au/ETAS3/etas';
const monthsArray = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

router.route('/check').get(async (req: Request, res: Response) => {
  console.log(req.params);
  try {

    let result = await getETAStatus(req, res);

    return res.status(OK).send();
  } catch (err) {
    console.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message,
    });
  }
});

async function getETAStatus(req: Request, res: Response)
{
  let params: any = {
    'nationality': req.query.nationality,
    'passportNumber': req.query.passportNumber,
    'referenceNumber': req.query.referenceNumber,
    'dateOfBirth': req.query.dateOfBirth,
  };

  let tokens = await getRESTTokens();
  let response = await submitForm(tokens, params);

  return response;
}

async function getRESTTokens()
{
  let res = await fetch(reqURL);
  let html = await res.text();
  console.log(res);
  let cookie:String = '';
  $("body").html(html);
  
  let cookieData = res.headers.get('set-cookie').split(',');

  // Parse out the cookie for the stuff we need
  for(var x=0;x<cookieData.length;x++)
  {
    var cd = cookieData[x].split(';')[0];
    cookie += cd + '; ';
  }

  let csrf = $('input[name=csrfFlag]').attr('value');

  return { csrf, cookie };
}

async function submitForm ( tokens: any , params: any )
{
  // Parse the date for the POST
  let dob = new Date(Date.parse(params.dateOfBirth));

  // request body JSON
  let body:any = {
    locale: 'en',
    submitted: '1',
    currentPage: 'etaCheck1.jsp',
    tab: 'check',
    submit: 'next',
    csrfFlag: tokens.csrf,
    nationalityCode: params.nationality,
    passport_number: params.passportNumber,
    confirm_passport_number: params.passportNumber,
    reference_number: params.referenceNumber,
    dob_day: (dob.getDate()+1),
    dob_month: monthsArray[dob.getMonth()],
    dob_year: dob.getFullYear(),
  };

  console.log(body);

  let opts:any = {
    method: 'post',
    body: Object.keys(body).map((key:string) => `${key}=${body[key]}`).join('&'),
    headers: {
      'Cookie': tokens.cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  let res = await fetch ( reqURL , opts );

  let html = await res.text();
  $("body").html(html);

  let status = $('.top-xlarge p:first-child > strong:first-child').text();
  let rawFields = $('dd');
  let fields:String[] = [];

  if(status == '' || status == null)
  {
    status = 'Nothing found for that request, please check your data and try again';
  }

  for(var x=0;x<rawFields.length;x++)
  {
    var fld = rawFields[x];
    fields.push($(fld).text());
  }

  let response = {
    passportNumber: fields[0],
    familyName: fields[1],
    givenNames: fields[2],
    nationality: fields[3],
    status: status
  }
  console.log(response);
  return response;
}
  // Export the base-router
export default router;
