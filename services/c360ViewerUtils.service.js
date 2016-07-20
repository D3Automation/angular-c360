(function() {
    'use strict';

    angular
        .module('angular-c360')
        .factory('c360ViewerUtils', c360ViewerUtils);

    /* @ngInject */
    function c360ViewerUtils() {
        return {
            componentElement: undefined
        };
    }
})();