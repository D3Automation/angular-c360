'use strict';

describe("c360-prop", function () {
    var $compile,
        $rootScope,
        element;

    beforeEach(module('angular-c360'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe("input node", function () {
        beforeEach(function () {
            $rootScope.testProp = {
                inputType: 'text',
                DataType: 'String',
                Value: 'TestValue'
            };

            element = $compile('<input c360-prop="testProp" />')($rootScope);
            $rootScope.$digest();
        });

        it("should bind to Value", function () {
            assert.equal(element.val(), 'TestValue');
        });

        describe("input type", function () {
            it("should detect date", function () {
                $rootScope.testProp.inputType = "date";
                $rootScope.$digest();
                assert.equal(element.attr("type"), "date");
            });

            it("should detect boolean", function () {
                $rootScope.testProp.inputType = "checkbox";
                $rootScope.$digest();
                assert.equal(element.attr("type"), "checkbox");
            });

            it("should detect text", function () {
                $rootScope.testProp.inputType = "text";
                $rootScope.$digest();
                assert.equal(element.attr("type"), "text");
            });
        });
    });

    describe("select node", function () {
        beforeEach(function () {
            $rootScope.testProp = {
                inputType: 'text',
                Value: '1',
                DataType: 'String',
                ChoiceList: [
                    {
                        "value": "1",
                        "text": "Test Value 1"
                    },
                    {
                        "value": "2",
                        "text": "Test Value 2"
                    }
                ]
            };

            element = $compile('<select c360-prop="testProp" ></select>')($rootScope);
            $rootScope.$digest();
        });

        it("should bind to Value", function () {
            assert.equal(element.contents().length, 2);
        });
    });
});