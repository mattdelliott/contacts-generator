const chance = require('chance')();
const _ = require('lodash');
const json2csv = require('json2csv');
const vCard = require('vcards-js');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2))

const fields = [
    {
        label: 'Prefix',
        value: 'name.prefix',
        default: ''
    },
    {
        label: 'First Name',
        value: 'name.givenName',
        default: ''
    },
    {
        label: 'Middle Name',
        value: 'name.middleName',
        default: ''
    },
    {
        label: 'Last Name',
        value: 'name.familyName',
        default: ''
    },
    {
        label: 'Suffix',
        value: 'name.suffix',
        default: ''
    },
    {
        label: 'Birthday',
        value: 'birthday',
        default: ''
    },
    {
        label: 'Gender',
        value: 'gender',
        default: ''
    },
    {
        label: 'Email Address',
        value: 'emailAddress',
        default: ''
    },
    {
        label: 'Email Type',
        value: 'emailType',
        default: ''
    },
    {
        label: 'Phone Number',
        value: 'phoneNumber',
        default: ''
    },
    {
        label: 'Phone Number Type',
        value: 'phoneType',
        default: ''
    },
    {
        label: 'Address Street',
        value: 'street',
        default: ''
    },
    {
        label: 'Address Extended',
        value: 'extended',
        default: ''
    },
    {
        label: 'Address City',
        value: 'city',
        default: ''
    },
    {
        label: 'Address Region',
        value: 'region',
        default: ''
    },
    {
        label: 'Address Postal Code',
        value: 'postalCode',
        default: ''
    },
    {
        label: 'Address Country',
        value: 'country',
        default: ''
    },
    {
        label: 'Address Type',
        value: 'addressType',
        default: ''
    },
    {
        label: 'Organization Name',
        value: 'orgName',
        default: ''
    },
    {
        label: 'Organization Title',
        value: 'orgTitle',
        default: ''
    },
    {
        label: 'Organization Department',
        value: 'orgDept',
        default: ''
    },
    {
        label: 'Notes',
        value: 'notes',
        default: ''
    }
]

const isVcf = argv.f == 'vcf';
const count = _.toNumber(argv.n || 100);
const data = [];

const generate = () => {
    if(isVcf) {
        const card = new vCard();
        card.firstName = chance.first();
        card.lastName = chance.last();
        card.gender = _.sample(['M', 'F']);
        card.cellPhone = chance.phone();
        card.email = chance.email(),
        card.homeAddress.label = 'Home';
        card.homeAddress.street = chance.address();
        card.homeAddress.city = chance.city();
        card.homeAddress.stateProvince = chance.state();
        card.homeAddress.postalCode = chance.postal();
        card.homeAddress.countryRegion = chance.country();
        card.note = 'Auto-generated contact'
        return card.getFormattedString();
    }

    return {
        name: {
            givenName: chance.first(),
            familyName: chance.last()
        },
        emailAddress: chance.email(),
        emailType: 'Home',
        phoneNumber: chance.phone(),
        phoneType: 'Mobile',
        street: chance.address(),
        city: chance.city(),
        state: chance.state(),
        postalCode: chance.postal(),
        country: chance.country(),
        gender: chance.gender(),
        notes: 'Auto-generated contact'
    }
}

_.times(
    count,
    () => data.push(generate())
);

const output = isVcf ? data.join('\n') : json2csv({ data, fields});
const fileName = `gen-contacts-${Date.now()}.${isVcf ? 'vcf' : 'csv'}`;
fs.writeFileSync(fileName, output);
console.log(`Generated ${count} contacts into ${fileName}.`);
