(function () {
    angular
        .module('angular-c360')
        .factory('c360Model', c360Model);

    function c360Model() {
        var DT = breeze.DataType; // alias
        return {
            initialize: initialize
        };

        function initialize(metadataStore) {
            metadataStore.addEntityType({
                shortName: 'UIPart',
                namespace: 'C360',
                dataProperties: {
                    refChain: {dataType: DT.String, isPartOfKey: true},
                    name: {dataType: DT.String},
                    partType: {dataType: DT.String},
                    parentRefChain: { dataType: DT.String }
                },
                navigationProperties: {
                    parent: {
                        entityTypeName: 'UIPart:#C360', isScalar: true,
                        associationName: 'UIPart_UIPart', foreignKeyNames: ['parentRefChain']
                    },
                    children: {
                        entityTypeName: 'UIPart:#C360', isScalar: false,
                        associationName: 'UIPart_UIPart'
                    }
                }
            });
        }
    }
})();