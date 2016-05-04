'use strict';

describe('etoContext provider', function () {
    var etoContext, httpBackend;

    beforeEach(module('angular-c360'));

    beforeEach(inject(function (_etoContext_, $httpBackend) {
        etoContext = _etoContext_;
        httpBackend = $httpBackend;

        var data = tableConfiguratorMockData.getNewModel();
        httpBackend.whenGET('api/model/new').respond(data);
    }));

    it('should start with null root', function () {
        var root = etoContext.getRoot();
        assert.isNull(root);
    });

    it('should handle getModel data', function (done) {
        etoContext.getNewModel().then(function (data) {
            assert.isNotNull(data);
            done();
        });

        httpBackend.flush();
    });

    describe('part processor', function () {
        beforeEach(function (done) {
            httpBackend.whenGET('api/model').respond(tableConfiguratorMockData.getNewModel());
            etoContext.getNewModel().then(function (data) {
                done();
            });

            httpBackend.flush();
        });

        describe('after initial model retrieval', function () {
            it('should set root', function () {
                var root = etoContext.getRoot();
                assert.isNotNull(root);
            });

            it('should create correct number of parts', function () {
                var parts = etoContext.getParts();
                assert.lengthOf(parts, 6);
            });

            it('should create correct number of properties', function () {
                var props = etoContext.getProperties();
                assert.lengthOf(props, 22);
            });

            it('should create correct number of messages', function () {
                var messages = etoContext.getMessages();
                assert.lengthOf(messages, 0);
            });

            it('should create correct number of actions', function () {
                var actions = etoContext.getActions();
                assert.lengthOf(actions, 4);
            });

            it('should create correct number of graphics entities', function () {
                var graphicsData = etoContext.getGraphicsData();

                assert.lengthOf(graphicsData, 5);
            });
        });

        describe('after updating count of dynamic parts', function () {
            beforeEach(function (done) {
                var data = tableConfiguratorMockData.updateDynamicParts();
                httpBackend.whenPUT('api/properties', { id: 8, value: 5 }).respond(data);
                etoContext.updateProperty(8, 5).then(function (data) {
                    done();
                });

                httpBackend.flush();
            });

            it('should update to the correct number of parts', function () {
                var parts = etoContext.getParts();
                assert.lengthOf(parts, 7);
            });

            it('should update to the correct number of properties', function () {
                var props = etoContext.getProperties();
                assert.lengthOf(props, 25);
            });

            it('should update to the correct number of messages', function () {
                var messages = etoContext.getMessages();
                assert.lengthOf(messages, 1);
            });

            it('should update to the correct number of actions', function () {
                var actions = etoContext.getActions();
                assert.lengthOf(actions, 5);
            });

            it('should update to the correct number of graphics entities', function () {
                var graphicsData = etoContext.getGraphicsData();

                assert.lengthOf(graphicsData, 6);
            });
        });
    });
});