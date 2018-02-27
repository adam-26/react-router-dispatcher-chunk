// @flow
import { preloadChunks } from 'react-chunk';
export const CHUNK = 'chunk';

export default function chunkAction(options?: { getChunkLoaderStaticMethodName?: string } = {}) {
    const { getChunkLoaderStaticMethodName } = Object.assign({
        getChunkLoaderStaticMethodName: 'getChunkLoader'
    }, options);

    return {
        name: CHUNK,

        // HOC does not require the 'mapParamsToProps' option
        requireMapParamsToProps: false,

        // === No server action is required ===
        // Because Chunks may be defined OUTSIDE of the router, dispatcher can not be used for the server render

        // === No client action ===
        // react-chunk 'preloadReady()' must be invoked BEFORE dispatching client actions on initial render

        // Allow lifecycle methods to pre-load dynamic imports
        // - this supports loading chunks during client navigation, and client-only rendering
        initComponentAction: ({ chunkLoaders }) => ({
            chunkLoaders: chunkLoaders || []
        }),

        // Determine if any route component(s) are using react-chunk dynamic imports
        staticMethod: (routeProps, actionProps, routerCtx) => {
            const { route, routeComponentKey } = routerCtx;
            const routeComponent = route[routeComponentKey];
            if (typeof routeComponent[getChunkLoaderStaticMethodName] === 'function') {
                actionProps.chunkLoaders.push(routeComponent[getChunkLoaderStaticMethodName]());
            }
        },

        // If any chunk loaders are found, pre-load the chunk imports
        successHandler: (routeProps, { chunkLoaders }) => {
            if (chunkLoaders && chunkLoaders.length) {
                const requiredChunks = chunkLoaders.splice(0, chunkLoaders.length);
                return preloadChunks(requiredChunks);
            }

            return Promise.resolve();
        },

        errorHandler: (err, routeProps, { chunkLoaders }) => {
            if (chunkLoaders && chunkLoaders.length) {
                // clean up - remove any pending loaders
                chunkLoaders.splice(0, chunkLoaders.length);
            }

            throw err;
        }
    };
}