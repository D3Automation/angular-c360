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
                    RefChain: {dataType: DT.String, isPartOfKey: true},
                    Name: {dataType: DT.String},
                    PartType: {dataType: DT.String},
                    ParentRefChain: { dataType: DT.String }
                },
                navigationProperties: {
                    Parent: {
                        entityTypeName: 'UIPart:#C360', isScalar: true,
                        associationName: 'UIPart_UIPart', foreignKeyNames: ['ParentRefChain']
                    },
                    Children: {
                        entityTypeName: 'UIPart:#C360', isScalar: false,
                        associationName: 'UIPart_UIPart'
                    }
                }
            });
        }
    }
})();