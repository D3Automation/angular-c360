(function () {
    'use strict';

    angular
    .module('angular-c360')
    .directive('c360Prop', c360Prop);

    function c360Prop($compile) {
        return {
            restrict: 'E',
            scope: {
                uiProp: '=',
                propLabel: '@'
            },
            controller: function ($scope) {
                setLabel();

                $scope.$watch('uiProp', function (newValue, oldValue) {
                    setLabel();
                });

                function setLabel() {
                    if ($scope.uiProp && !$scope.propLabel) {
                        $scope.propLabel = $scope.uiProp.fullName;
                    }
                }
            },
            templateUrl: 'c360Prop.html'
        }
    }
})();