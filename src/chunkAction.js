// @flow
import { preloadChunks } from 'react-chunk';
export const CHUNK = 'chunk';

export default function chunkAction(options?: { getChunkLoaderStaticMethodName?: string } = {}) {
    let unsubscribeHoist = null;
    const { getChunkLoaderStaticMethodName } = Object.assign({
        getChunkLoaderStaticMethodName: 'getChunkLoader'
    }, options);

    return {
        name: CHUNK,

        // === No server action is required ===
        // Because Chunks may be defined OUTSIDE of the router, dispatcher can not be used for the server render

        // === No client action ===
        // react-chunk 'preloadReady()' must be invoked BEFORE dispatching client actions on initial render

        // Allow lifecycle methods to pre-load dynamic imports
        // - this supports loading chunks during client navigation, and client-only rendering
        initComponentAction: ({ chunkLoaders }) => ({
            chunkLoaders: chunkLoaders || []
        }),

        filterParamsToProps: ({ chunkLoaders }) => {
            return { chunkLoaders };
        },

        // Determine if any route component(s) are using react-chunk dynamic imports
        staticMethod: (props, routerCtx) => {
            const { route, routeComponentKey } = routerCtx;
            const routeComponent = route[routeComponentKey];
            if (typeof routeComponent[getChunkLoaderStaticMethodName] === 'function') {
                props.chunkLoaders.push(routeComponent[getChunkLoaderStaticMethodName]());
            }
        },

        // If any chunk loaders are found, pre-load the chunk imports
        successHandler: ({ chunkLoaders }) => {
            if (chunkLoaders && chunkLoaders.length) {
                const requiredChunks = chunkLoaders.splice(0, chunkLoaders.length);
                return preloadChunks(requiredChunks);
            }

            return Promise.resolve();
        },

        errorHandler: (err, { chunkLoaders }) => {
            if (chunkLoaders && chunkLoaders.length) {
                // clean up - remove any pending loaders
                chunkLoaders.splice(0, chunkLoaders.length);
            }

            if (typeof unsubscribeHoist === 'function') {
                unsubscribeHoist();
            }

            throw err;
        },

        hoc: function hoc(Component, ActionHOC) {
            // If the component is a react-chunk component, hoist statics on init
            if (typeof Component.hoistOnInit === 'function') {
                unsubscribeHoist = Component.hoistOnInit(() => ActionHOC);
            }

            return Component;
        }
    };
}