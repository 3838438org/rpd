var Rpd = Rpd, Kefir = Kefir, prettify = prettify;

var RpdMatchers = RpdMatchers;

if ((typeof Rpd === 'undefined')
 && (typeof Kefir === 'undefined')
 && (typeof RpdMatchers === 'undefined')
 && (typeof prettify === 'undefined')
 && (typeof require !== 'undefined')) {
    Kefir = require('../vendor/kefir.min.js');
    Rpd = require('../src/rpd.js');
    RpdMatchers = require('./matchers.js');
    prettify = require('./prettify.js');
}

prettify(Rpd); // inject pretty-print for Jasmine

// SPEC CODE

Rpd.channeltype('spec/any', { });

describe('registering', function() {

// -----------------------------------------------------------------------------
// ===============================- renderer -==================================
// -----------------------------------------------------------------------------

describe('renderer', function() {
});

// -----------------------------------------------------------------------------
// =================================- node -====================================
// -----------------------------------------------------------------------------

function withNewModel(fn) {
    var updateSpy = jasmine.createSpy('update');
    var renderer = Rpd.renderer('foo', function(user_conf) {
        return updateSpy;
    });

    var model = Rpd.Model.start().renderWith('foo').attachTo({});

    fn(model, updateSpy);
}

describe('node type', function() {

    beforeEach(function() {
        jasmine.addMatchers({
            toHaveBeenOrderlyCalledWith: RpdMatchers.toHaveBeenOrderlyCalledWith,
            toHaveBeenCalledOnce: RpdMatchers.toHaveBeenCalledOnce,
            toHaveBeenCalledTwice: RpdMatchers.toHaveBeenCalledTwice,
            toHaveBeenCalledTimes: RpdMatchers.toHaveBeenCalledTimes
        });
    });

    it('could be registered with an empty object', function() {
        expect(function() {
            Rpd.nodetype('spec/foo', {});
        }).not.toThrow();
    });

    it('redefining the type re-writes previous type');

    it('passes the specified name to every created instance');

    it('creates specified inlets for the node instance', function() {
        Rpd.nodetype('spec/foo', {
            inlets: {
                'a': { type: 'spec/any' },
                'b': { type: 'spec/any' }
            }
        });

        withNewModel(function(model, updateSpy) {

            var node = new Rpd.Node('spec/foo');

            expect(updateSpy).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining(
                    { type: 'inlet/add',
                      inlet: jasmine.objectContaining({
                          name: 'a',
                          type: 'spec/any'
                      }) })
            );

            expect(updateSpy).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining(
                    { type: 'inlet/add',
                      inlet: jasmine.objectContaining({
                          name: 'b',
                          type: 'spec/any'
                      }) })
            );

        });
    });

    it('creates specified outlets for the node instance', function() {

        Rpd.nodetype('spec/foo', {
            outlets: {
                'a': { type: 'spec/any' },
                'b': { type: 'spec/any' }
            }
        });

        withNewModel(function(model, updateSpy) {

            var node = new Rpd.Node('spec/foo');

            expect(updateSpy).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining(
                    { type: 'outlet/add',
                      outlet: jasmine.objectContaining({
                          name: 'a',
                          type: 'spec/any'
                      }) })
            );

            expect(updateSpy).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining(
                    { type: 'outlet/add',
                      outlet: jasmine.objectContaining({
                          name: 'b',
                          type: 'spec/any'
                      }) })
            );

        });
    });

    it('informs it is ready when all inlets and outlets are ready', function() {

        Rpd.nodetype('spec/foo', {
            inlets:  { 'a': { type: 'spec/any' },
                       'b': { type: 'spec/any' } },
            outlets: { 'c': { type: 'spec/any' },
                       'd': { type: 'spec/any' } }
        });

        withNewModel(function(model, updateSpy) {

            var node = new Rpd.Node('spec/foo');

            expect(updateSpy).toHaveBeenOrderlyCalledWith([
                [ jasmine.anything(), jasmine.objectContaining({ type: 'inlet/add' }) ],
                [ jasmine.anything(), jasmine.objectContaining({ type: 'outlet/add' }) ],
                [ jasmine.anything(), jasmine.objectContaining({ type: 'node/ready' }) ]
            ]);

        });
    });

    it('informs it is ready only once', function() {

        Rpd.nodetype('spec/foo', {
            inlets:  { 'a': { type: 'spec/any' } },
            outlets: { 'b': { type: 'spec/any' } }
        });

        withNewModel(function(model, updateSpy) {

            var node = new Rpd.Node('spec/foo');

            updateSpy.calls.reset();

            node.addInlet('spec/any', 'foo');

            expect(updateSpy).not.toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({ type: 'node/ready' }));

        });
    });

    it('informs inlet was updated when its default value was set');

    it('informs outlet was updated when its default value was set');

    it('accepts streams as default values for inlets');

    it('accepts streams as default values for outlets');

    it('still informs about update when inlet is hidden');

    it('still informs about update when inlet is cold');

    describe('processing function', function() {

        var processSpy;

        beforeEach(function() { processSpy = jasmine.createSpy('process'); });

        it('is not called when inlets have no default values', function() {

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any' },
                           'b': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                var node = new Rpd.Node('spec/foo');
                expect(processSpy).not.toHaveBeenCalled();
            });

        });

        it('is still not called when inlets have no default values and there is an outlet', function() {

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any' },
                           'b': { type: 'spec/any' } },
                outlets: { 'c': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                var node = new Rpd.Node('spec/foo');
                expect(processSpy).not.toHaveBeenCalled();
            });

        });

        it('is called once when single inlet has some default value', function() {

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any', default: 10 },
                           'b': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                var node = new Rpd.Node('spec/foo');
                expect(processSpy).toHaveBeenCalledWith({ 'a': 10 }, jasmine.anything());
                expect(processSpy).toHaveBeenCalledOnce();
            });

        });

        it('is called for every inlet which have a default value', function() {

            Rpd.nodetype('spec/foo', {
                inlets: { 'a': { type: 'spec/any', default: 10 },
                          'b': { type: 'spec/any', default: 5  } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                // this tests are required due to the fact processing function receives the same object
                // modified through time, so if these checks are preformed after the calls, they do fail
                // see: https://github.com/shamansir/rpd/issues/89
                // and: https://github.com/jasmine/jasmine/issues/872
                var ensureExecuted = handleNextCalls(processSpy, [
                    function() { expect(processSpy).toHaveBeenCalledWith({ 'a': 10 }, jasmine.anything()); },
                    function() { expect(processSpy).toHaveBeenCalledWith({ 'a': 10, 'b': 5 }, jasmine.anything()); }
                ]);

                var node = new Rpd.Node('spec/foo');

                ensureExecuted();

            });

        });

        it('is not affected with number of outlets', function() {

            Rpd.nodetype('spec/foo', {
                inlets: { 'a': { type: 'spec/any', default: 10 },
                          'b': { type: 'spec/any', default: 5  } },
                outlets: { 'c': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                var node = new Rpd.Node('spec/foo');
                expect(processSpy).toHaveBeenCalledTwice();
            });

        });

        it('gets values from inlets even when there\'s no outlets', function() {

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any' },
                           'b': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                node.inlets['a'].receive(2);
                expect(processSpy).toHaveBeenCalledWith({ a: 2 }, jasmine.anything());
                node.inlets['b'].receive('abc');
                expect(processSpy).toHaveBeenCalledWith({ a: 2, b: 'abc' }, jasmine.anything());

            });

        });

        it('sets outlets to their default values', function() {

            Rpd.nodetype('spec/foo', {
                inlets: { 'a': { type: 'spec/any' },
                          'b': { type: 'spec/any' } },
                outlets: { 'c': { type: 'spec/any', default: 17 } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                var node = new Rpd.Node('spec/foo');
                var outlet = node.outlets['c'];
                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outlet,
                        value: 17
                    })
                );
                expect(processSpy).not.toHaveBeenCalled();
            });

        });

        it('called only when node is ready', function() {
            var nodeReady = false;

            Rpd.nodetype('spec/foo', {
                inlets: { 'a': { type: 'spec/any', default: 5 },
                          'b': { type: 'spec/any', default: [ 2, 1 ] },
                          'c': { type: 'spec/any', default: {} },
                          'd': { type: 'spec/any', default: '' } },
                outlets: { 'e': { type: 'spec/any', default: 17 },
                           'f': { type: 'spec/any', default: [] } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {
                updateSpy.and.callFake(function(trg, update) {
                    if (update.type === 'node/ready') {
                        expect(processSpy).not.toHaveBeenCalled();
                        nodeReady = true;
                    } else if (!nodeReady) {
                        expect(processSpy).not.toHaveBeenCalled();
                    }
                }.bind(this));

                var node = new Rpd.Node('spec/foo');

                expect(updateSpy).toHaveBeenCalled();
                expect(processSpy).toHaveBeenCalled();
            });
        });

        it('when inlet is set to transfer some stream by default, gets values from this stream one by one');

        it('when stream was sent to the inlet, still gets values one by one');

        it('passes previous values with a call');

        it('gets values from hidden inlets');

        it('does not reacts if updated inlet was cold, but keeps its value for next update');

        it('passes values to corresponding outlets based on default inlets values', function() {

            processSpy.and.callFake(function(inlets) {
                return { 'c': (inlets.a || 0) * (inlets.b || 1) };
            });

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any', default: 7 },
                           'b': { type: 'spec/any', default: 2 } },
                outlets: { 'c': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                var outlet = node.outlets['c'];

                expect(processSpy).toHaveBeenCalled();

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outlet,
                        value: 7 // 7 * 1
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outlet,
                        value: 14 // 2 * 7
                    })
                );

            });

        });

        it('passes single values to corresponding outlets', function() {

            processSpy.and.callFake(function(inlets) {
                return { 'c': inlets.a * (inlets.b || 1),
                         'd': (inlets.b || 0) * 3 };
            });

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any' },
                           'b': { type: 'spec/any' } },
                outlets: { 'c': { type: 'spec/any' },
                           'd': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                node.inlets['a'].receive(7);
                node.inlets['b'].receive(2);
                node.inlets['b'].receive(6);

                var outletC = node.outlets['c'];
                var outletD = node.outlets['d'];

                expect(processSpy).toHaveBeenCalled();

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletC,
                        value: 7 // 7 * 1
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletC,
                        value: 14 // 7 * 2
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletC,
                        value: 42 // 7 * 6
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletD,
                        value: 0 // 0 * 3
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletD,
                        value: 6 // 2 * 3
                    })
                );

                expect(updateSpy).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        type: 'outlet/update',
                        outlet: outletD,
                        value: 18 // 6 * 3
                    })
                );

            });

        });

        it('passes streamed values to corresponding outlets', function(done) {

            var values = [ 2, 4, 5, 6 ];
            var period = 30;

            processSpy.and.callFake(function(inlets) {
                return { 'out': Kefir.sequentially(period, values)
                                     .map(function(value) {
                                         return (inlets.in * value);
                                     }) };
            });

            Rpd.nodetype('spec/foo', {
                inlets:  { 'in': { type: 'spec/any' } },
                outlets: { 'out': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                node.inlets['in'].receive(7);

                var outlet = node.outlets['out'];

                expect(processSpy).toHaveBeenCalled();

                setTimeout(function() {
                    for (var i = 0; i < values.length; i++) {
                        expect(updateSpy).toHaveBeenCalledWith(
                            jasmine.anything(),
                            jasmine.objectContaining({ type: 'outlet/update',
                                                       outlet: outlet,
                                                       value: values[i] * 7 }));
                    }
                    done();
                }, period * (values.length + 1));

            });

        });

        it('updates the outlet value even when processing function was executed before this outlet was created');

        it('switches off previous stream when new one was plugged to outlet');

        it('if no outlet was updated, does not fires the update for this outlet', function() {

            processSpy.and.callFake(function(inlets) {
                return {};
            });

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any', default: 4 },
                           'b': { type: 'spec/any' } },
                outlets: { 'c': { type: 'spec/any' },
                           'd': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                node.inlets['b'].receive(7);

                expect(processSpy).not.toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({ type: 'outlet/update' })
                );

            });

        });

        it('treats no return value as no update to any outlet', function() {
            processSpy.and.callFake(function(inlets) { });

            Rpd.nodetype('spec/foo', {
                inlets:  { 'a': { type: 'spec/any', default: 2 },
                           'b': { type: 'spec/any' } },
                outlets: { 'c': { type: 'spec/any' },
                           'd': { type: 'spec/any' } },
                process: processSpy
            });

            withNewModel(function(model, updateSpy) {

                var node = new Rpd.Node('spec/foo');

                node.inlets['b'].receive(12);

                expect(processSpy).not.toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({ type: 'outlet/update' })
                );

                expect(processSpy).toHaveBeenCalledWith(
                    jasmine.objectContaining({ a: 2 }),
                    jasmine.anything()
                );

                expect(processSpy).toHaveBeenCalledWith(
                    jasmine.objectContaining({ b: 12 }),
                    jasmine.anything()
                );

            });
        });

        it('is not bound to the types of the values inlets or outlets receive');

        describe('tuning', function() {});

    });

});

// -----------------------------------------------------------------------------
// ===============================- channel -===================================
// -----------------------------------------------------------------------------

describe('channel type', function() {

});

// -----------------------------------------------------------------------------
// =================================- link -====================================
// -----------------------------------------------------------------------------

describe('link type', function() {

});

// -----------------------------------------------------------------------------
// ============================- node renderer -================================
// -----------------------------------------------------------------------------

describe('node renderer', function() {

});

// -----------------------------------------------------------------------------
// ==========================- channel renderer -===============================
// -----------------------------------------------------------------------------

describe('channel renderer', function() {

});

});

function handleNextCalls(spy, handlers) {
    var timesCalled = 0;

    spy.and.callFake(function() {
        expect(handlers[timesCalled]).toBeTruthy('No handler for a call #' + timesCalled);
        handlers[timesCalled](spy);
        timesCalled++;
    });

    return function() {
        expect(spy).toHaveBeenCalledTimes(handlers.length);
    }
}
