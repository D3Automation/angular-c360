(function () {
    'use strict';

    angular
    .module('angular-c360')
    .directive('c360Prop', c360Prop);

    function c360Prop($compile) {
        return {
            compile: compile,
            priority: 1000,
            restrict: 'A',
            terminal: true
        };

        function compile(elem, attrs) {
            var prop = attrs.c360Prop;

            // Remove the attribute so it doesn't get processed again
            elem.removeAttr('c360-prop');

            // Add all of these attributes unconditionally
            elem.addClass('c360-prop');
            elem.attr('ng-model', prop + '.value');
            elem.attr('ng-class', '{ \'c360-modified\': ' + prop + '.isModified, \'c360-invalid\': ' + prop + '.errorInfo }');
            elem.attr('ng-disabled', prop + '.isReadOnly');
            elem.attr('tooltip', '{{' + prop + '.tooltip}}');
            elem.attr('tooltip-popup-delay', '1000');

            // Add the remaining attributes only if they're not already set, so that they
            //  can be overridden on a case-by-case basis

            if (!angular.isDefined(elem.attr('ng-model-options'))) {
                elem.attr('ng-model-options', '{ updateOn: ' + prop + '.updateOn }');
            }

            if (elem[0].nodeName === 'INPUT' && !angular.isDefined(elem.attr('type'))) {
                elem.attr('type', '{{' + prop + '.inputType}}');
            }

            if (elem[0].nodeName === 'SELECT' && !angular.isDefined(elem.attr('ng-options'))) {
                elem.attr('ng-options', 'choice.value as choice.text for choice in ' + prop + '.choiceList');
            }

            return {
                pre: function preLink(scope, iElement, iAttrs, controller) { },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    $compile(iElement)(scope);
                }
            };
        }
    }
})();