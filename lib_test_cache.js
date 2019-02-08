define(['N/runtime', 'N/log', 'N/cache'], function(runtime, log, cache) {
    const CACHE_NAME = 'TEST_CACHE';
    const CACHE_JSON = 'CACHE_JSON';
    var JSON_cache = '';

    function getCacheTest(type) {
/*        var ex = runtime.executionContext;
        log.debug('type', ex);
        log.debug('type', type);*/
        /*        if (type == 'client') {
                    log.debug('client');
                    return testCacheLoader();
                } else {*/
        //require(['N/cache'], function(cache) {

        log.debug('cache loader function lib');
        var testCache = cache.getCache({
            name: CACHE_NAME
        });
        var testCacheJSON = testCache.get({
            key: CACHE_JSON,
            loader: testCacheLoader
        });

        //JSON_cache = testCacheJSON;
        // });
        return testCacheJSON;
        // }

    }

    function testCacheLoader() {
        var obj = {
            test1: 1,
            test2: 2,
            test3: 3
        }
        return obj;
    }

    return {
        getCacheTest: getCacheTest
    };
})