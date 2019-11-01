const raid_regexps = {
    'general_statements':
            {
                ['raids']:
                    {
                    ['general_statement_raids2']:
                        {
                            'name': 'general_statement_raids2',
                            'expression': /(\d+\:\d+)\s(.*\w)\s(\d+)\s(\w+)\s(CP)\s(\d+\:\d+\:\d+)/g,
                            'gym': 2,
                            'cp': 3,
                            'boss': 4,
                            'time': 6,
                            'type':'raid',
                            'hatched':1
                        },
                    ['general_statement_raids3']:
                        {
                            'name': 'general_statement_raids3',
                            'expression': /(\d+\:\d+)\s(.*\w)\s(\d+)\s(CP.*)\s(\w+)\s(\d+\:\d+\:\d+)/g,
                            'gym': 2,
                            'cp': 3,
                            'boss': 5,
                            'time': 6,
                            'type':'raid'
                        },
                    ['general_statement_raids4']:
                        {
                            'name':'general_statement_raids4',
                            'expression': /(.*?\d+\:.*?\s)(.*(LTE\s))(.*)\s(\w+\d+)\s(\w+)\s(\d+\:\d+\:\d+)/g,
                            'gym': 4,
                            'cp': 5,
                            'boss': 6,
                            'time': 7,
                            'type':'raid',
                            'hatched':1
                        },
                    ['general_statement_raids5']:
                        {
                            'name':'general_statement_raids5',
                            'expression': /(\d+\:\d+\s)+(.*)\s(CP)\s+(\d+)\s(\w+)\s(\d+\:\d+\:\d+)/g,
                            'gym': 2,
                            'cp': 4,
                            'boss': 5,
                            'time': 6,
                            'type':'raid',
                            'hatched':1
                        },
                    ['raid_announcement_regex1']:
                        {
                            'name':'raid_announcement_regex1',
                            'expression':/((is anyone doing)\s+(.*?)(\?)\s+(it has a)\s+(\w+)\s+(and)\s+(\d+)\s+(mins left))/g,
                            'type':'raid',
                            'hatched':1

                        },
                    ['raid_announcement_regex2']:
                        {
                            'name':'raid_announcement_regex2',
                            'expression':/((\w+)\s+(raid at)\s+(.*?)\s+(with)\s+(\d+)\s+(mins))/g,
                            'type':'raid',
                            'boss':2,
                            'gym':4,
                            'time':6,
                            'hatched':1
                        },
                    ['raid_announcement_regex3'] :
                        {
                            'name':'raid_announcement_regex3',
                            'expression': /((?!\d+)(\w+)\s+(raid at)\s+(.*?)\s+(\d+)\s+(mins))/g,
                            'type':'raid',
                            'hatched':1
                        },
                    ['general_statement_raids']:
                        {
                            'name':'general_statement_raids',
                            'expression': /(.*?\d+\:.*?\s)(.*)\s(\w+\d+)\s(\w+)\s(\d+\:\d+\:\d+)/g,
                            'gym': 2,
                            'cp': 3,
                            'boss': 4,
                            'time': 5,
                            'type':'raid',
                            'hatched':1
                        },
                },
                ['eggs']:
                    {
                    ['general_statement_egg']:
                        {
                            'statement_name': 'general_statement_egg',
                            'expression': /(\d+\:\d+\s)(?!LTE)(?!(.*\s\w+\d+\s\w+\s))(.*)(\d+\:\d+\:\d+)/g,
                            'gym': 3,
                            'time': 4,
                            'type':'egg',
                            'hatched':0
                        },
                    ['general_statement_egg2']:
                        {
                            'statement_name': 'general_statement_egg2',
                            'expression': /(\d+\:\d+.*TE)(?!(.*\s\w+\d+\s\w+\s))(.*)(\d+\:\d+\:\d+)/g,
                            'gym': 3,
                            'time': 4,
                            'type':'egg',
                            'hatched':0
                        },
                    ['general_statement_egg3']:
                        {
                            'statement_name': 'general_statement_egg3',
                            'expression': /(\d+\:\d+\s)(.*TE)(?!(.*\s\w+\d+\s\w+\s))(.*)(\d+\:\d+\:\d+)/g,
                            'gym': 4,
                            'time': 5,
                            'type':'egg',
                            'hatched':0
                        },
                    ['egg_announcement_regex1']:
                        {
                            'expression':/(level)\s(\d+)\s(raid)\s(at)\s(.*)\s(in)\s(\d+)\s(min)/g,
                            'type':'egg',
                            'boss':'tbd',
                            'gym':5,
                            'time':7,
                            'tier':2,
                            'hatched':0
                        }
                }

            },
    'raid_regexps':
            {
                'standard_raid_exp':/(.*?)\s(\d+\:\d+\:\d+)/g,
                'to_parse_raid_exp':/((.*?))(\s(\w+))\s(\d+\:\d+\:\d+)/g,
            },
    'egg_regexps':
            {
                'egg_regx1':  /(.*)\s(\d+\:\d+\:\d+)/g,
                'egg_regx2': /(.*?)\s+(\d+\:\d+\:\d+)/g,
            }
};
const cleanup_exps =
        {
            ['rm_cp_string_raid1']:
                {
                    'name':'rm_cp_string_raid1',
                    'expression': /(.*?)\s+(\d+)\s+(\w+)\s+(cp)\s(\d+\:\d+\:\d+)/g,
                    'gym':1,
                    'boss':3,
                    'time':5
                },
            ['rm_cp_string_raid2']:
                {
                    'name':'rm_cp_string_raid2',
                    'expression':  /(.*?)\s+(\d+)\s+(cp)\s(\w+)\s(\d+\:\d+\:\d+)/g,
                    'gym':1,
                    'boss':4,
                    'time':5
                },
            ['rm_cp_string_raid3']:
                {
                    'name':'rm_cp_string_raid3',
                    'expression': /(.*?)\s+([Aa-za]\d+)\s+(\w+)\s+(\d+\:\d+\:\d+)/g,
                    'gym':1,
                    'boss':3,
                    'time':4
                },
            ['rm_cp_string_raid4']:
                {
                    'name':'rm_cp_string_raid1',
                    'expression': /(.*?)\s+((\w+\d+))\s+(.*?)\s+(\d+\:\d+\:\d+)/g,
                    'gym':1,
                    'boss':4,
                    'time':5
                },

};


module.exports = {
    cleanup_exps,
    raid_regexps
};

