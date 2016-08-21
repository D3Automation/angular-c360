(function () {
    'use strict';

    angular
    .module('angular-c360')
    .directive('c360Prop', c360Prop);

    /* @ngInject */
    function c360Prop($compile, $injector) {
        var templateUrl = 'c360Prop.html';

        try {
            templateUrl = $injector.get('c360PropTemplateUrl');
        }
        catch(err) {
        }

        return {
            restrict: 'E',
            scope: {
                uiProp: '=',
                labelText: '@'
            },
            controller: function ($scope) {
                setLabel();

                $scope.$watch('uiProp', function (newValue, oldValue) {
                    setLabel();
                });

                function setLabel() {
                    if ($scope.uiProp && !$scope.labelText) {
                        $scope.labelText = $scope.uiProp.fullName;
                    }
                }
            },
            templateUrl: templateUrl
        }
    }
})();