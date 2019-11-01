const monNameByAliasUrl = 'https://elkhartraids.website/api/mon-name/';
const gymIdByAliasUrl = 'https://elkhartraids.website/api/gym-alias-id/';
const gymNameByAliasUrl = 'https://elkhartraids.website/api/gym-alias-name/';
const raidCreateUrl = 'https://elkhartraids.website/api/raid/create';
const raidDeetsUrl = 'https://elkhartraids.website/raids/';
const getBossTier = 'https://elkhartraids.website/api/bossTier/'

const raid_announcement_regex1 = /((is anyone doing)\s+(.*?)(\?)\s+(it has a)\s+(\w+)\s+(and)\s+(\d+)\s+(mins left))/g;
const raid_announcement_regex2 =/((?!\d+)(\w+)\s+(raid at)\s+(.*?)\s+(with)\s+(\d+)\s+(mins))/g;
const raid_announcement_regex3 = /((?!\d+)(\w+)\s+(raid at)\s+(.*?)\s+(\d+)\s+(mins))/g;
const egg_announcement_regex1 = /((level)\s+(\d+)\s+(raid at)\s+(.*?)\s+(\d+)\s+(mins))/g;






module.exports = {
    monNameByAliasUrl,
    gymIdByAliasUrl,
    gymNameByAliasUrl,
    raidCreateUrl,
    raidDeetsUrl,
    raid_announcement_regex1,
    raid_announcement_regex2,
    raid_announcement_regex3,
    egg_announcement_regex1,
    getBossTier

};