/* eslint-disable no-undef */
const { expect } = require('chai');
const extractIntl = require('../src');

const configFixture = () => ({
  intl: {
    available: ['qw', 'er', 'rt', 'uk']
  }
});
const dataFixture = {
  'name:as': 'nameas',
  'spot:ew': 'spotaw',
  'spot:cd': '',
  'key:qw': 'value_qw',
  'key:we': 'value_we',
  'k1ey:er': 'value_qw',
  'key:rt': 'value_rt',
  name: 'name_uk_value',
  sdc: 'cds',
  1: 123
};
const expectedResultWithKey = [
  { key: 'prop.qw', val: 'value_qw' },
  { key: 'prop.rt', val: 'value_rt' },
  { key: 'prop.er', val: '' },
  { key: 'prop.uk', val: '' }
];
const expectedResultWithoutKey = [
  { key: 'key.qw', val: 'value_qw' },
  { key: 'key.rt', val: 'value_rt' },
  { key: 'key.er', val: '' },
  { key: 'key.uk', val: '' }
];
const expectedResultWithUkDefault = [
  { key: 'name.qw', val: '' },
  { key: 'name.er', val: '' },
  { key: 'name.rt', val: '' },
  { key: 'name.uk', val: 'name_uk_value' }
];

describe('Extract intl data', () => {
  it('should extract only expected data and make proper result', () => {
    const result = extractIntl(dataFixture, 'key', 'prop', configFixture());
    expect(result).to.be.deep.equal(expectedResultWithKey);
  });
  it('should extract and create result array and use needle value as key if key is not defined',
    () => {
      const result = extractIntl(dataFixture, 'key', null, configFixture());
      expect(result).to.be.deep.equal(expectedResultWithoutKey);
    });
  it('in uk keyword wasn\'t found it should try to get it from place with n language', () => {
    expect(extractIntl(dataFixture, 'name', null, configFixture()))
      .to.be.deep.equal(expectedResultWithUkDefault);
  });
});
