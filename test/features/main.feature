#
#     This file is part of select-object-path.
#
#     select-object-path is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     select-object-path is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with select-object-path.  If not, see <http://www.gnu.org/licenses/>
#

Feature: select-object-path

    # -------------------------------------------------------------------------------------------------------------------------
    # test ``select``
    # -------------------------------------------------------------------------------------------------------------------------
    Scenario: without options

        When i call sop.select without options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
            ]
        }
        EOT;
        and result is validate select.out.schema.json

    Scenario: options not valid

        Given new options {}
        Then select.in.schema.json not validate options
        Given new options {"a": 10}
        Then select.in.schema.json not validate options

    Scenario: schema select.in.schema.json valid

        Given new options <<<EOT
        {
            "add" : ["+"],
            "not": ["-", "!"],
            "object": {"a": {"b": { "c": { "d": null }}}},
            "alias" : { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}},
            "select" : "*"
        }
        EOT;
        Then select.in.schema.json validate options


    Scenario: analyse

        Given new options <<<EOT
        {
            "add" : ["+"],
            "not": ["-", "!"],
            "object": {"a": {"b": { "c": { "d": null }}}},
            "alias" : { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}},
            "select" : ""
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a",
                "/a/b",
                "/a/b/c",
                "/a/b/c/d"
            ]
        }
        EOT;
        and result is validate select.out.schema.json

    Scenario: error schema

        # error 1
        Given new options <<<EOT
        {
            "object" : 10
        }
        EOT;
        When i call sop.select with options
        Then throw an error
        # error 2
        Given new options <<<EOT
        {
            "add" : 10
        }
        EOT;
        When i call sop.select with options
        Then throw an error

    Scenario: analyse filter

        Given new options <<<EOT
        {
            "object": {"a": {"b": { "c": { "d": null }}}},
            "select" : "b"
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a/b",
                "/a/b/c",
                "/a/b/c/d"
            ]
        }
        EOT;
        and result is validate select.out.schema.json

    Scenario: analyse filter

        Given new options <<<EOT
        {
            "object": {"a": {"b": { "c": { "d": null }}}},
            "select" : "d"
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a/b/c/d"
            ]
        }
        EOT;
        and result is validate select.out.schema.json

    Scenario: analyse filter (et increase code coverage)

        Given new options <<<EOT
        {
            "object": {"a": {"b": { "c": { "d": null }}}, "d" : null },
            "select" : "*,-d,-d"
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a",
                "/a/b",
                "/a/b/c"
            ]
        }
        EOT;
        and result is validate select.out.schema.json

        Given new options <<<EOT
        {
            "object": {"a": {"b": ["a"], "c": 10, "d": true }, "d": 10  },
            "select" : "*,-d"
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a",
                "/a/b",
                "/a/c"
            ]
        }
        EOT;
        and result is validate select.out.schema.json

        Given new options <<<EOT
        {
            "object": {"a": {"b": { "c": { "d": "ho" }}}, "d" : null },
            "select" : "*,-d"
        }
        EOT;
        When i call sop.select with options
        Then sop.select return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "path" : [
                "/a",
                "/a/b",
                "/a/b/c"
            ]
        }
        EOT;
        and result is validate select.out.schema.json



    # -------------------------------------------------------------------------------------------------------------------------
    # test ``selectToPattern``
    # -------------------------------------------------------------------------------------------------------------------------
    Scenario: select std

        Given argument sop.selectToPattern {"select": "*,path,-none", "add": ["+"], "not": ["-", "!"], "alias": { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}}}
        and sop.selectToPattern is validate selectToPattern.in.schema.json
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "patterns" : [
                { "pattern": ".*", "flag": "+" },
                { "pattern": "path", "flag": "+" },
                { "pattern": ".*", "flag": "+" }
            ]
        }

        EOT;
        and result is validate selectToPattern.out.schema.json

    Scenario: select add

        Given argument sop.selectToPattern {"select": "#path,none", "add": ["#", "+"], "not": ["-", "!"], "alias": { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}}}
        and sop.selectToPattern is validate selectToPattern.in.schema.json
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "patterns" : [
                { "pattern": ".*", "flag": "-" },
                { "pattern": "path", "flag": "+" },
                { "pattern": ".*", "flag": "-" }
            ]
        }
        EOT;
        and result is validate selectToPattern.out.schema.json

    Scenario: select not

        Given argument sop.selectToPattern {"select": "-*,!path,all,+yyy", "add": ["+"], "not": ["-", "!"], "alias": { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}}}
        and sop.selectToPattern is validate selectToPattern.in.schema.json
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "patterns" :  [
                { "pattern": ".*", "flag": "+" },
                { "pattern": ".*", "flag": "-" },
                { "pattern": "path", "flag": "-" },
                { "pattern": ".*", "flag": "+" },
                { "pattern": "yyy", "flag": "+" }
            ]
        }

        EOT;
        and result is validate selectToPattern.out.schema.json

    Scenario: empty comma

        Given argument sop.selectToPattern {"select": "-*,,,,,!path,all,+yyy", "add": ["+"], "not": ["-", "!"], "alias": { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}}}
        and sop.selectToPattern is validate selectToPattern.in.schema.json
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "patterns": [
                { "pattern": ".*", "flag": "+" },
                { "pattern": ".*", "flag": "-" },
                { "pattern": "path", "flag": "-" },
                { "pattern": ".*", "flag": "+" },
                { "pattern": "yyy", "flag": "+" }
            ]
        }
        EOT;
        and result is validate selectToPattern.out.schema.json

    Scenario: not alias

        Given argument sop.selectToPattern {"select": "-none", "add": ["+"], "not": ["-", "!"], "alias": { "*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}}}
        and sop.selectToPattern is validate selectToPattern.in.schema.json
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern return <<<EOT
        {
            "licence" : "GPL-3.0",
            "donate" : [
                "https://pledgie.com/campaigns/28037",
                "https://gratipay.com/aminassian"
            ],
            "patterns": [
                { "pattern": ".*", "flag": "+" },
                { "pattern": ".*", "flag": "+" }
            ]
        }
        EOT;
        and result is validate selectToPattern.out.schema.json

    Scenario: options not valid

        Given argument sop.selectToPattern {"hic": null}
        When i call sop.selectToPattern with argument
        Then sop.selectToPattern throw an error