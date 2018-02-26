// @flow
import { preloadChunks } from 'react-chunk';
export const CHUNK = 'chunk';

export default function chunkAction(options?: { getChunkLoaderStaticMethodName?: string } = {}) {
    const { getChunkLoaderStaticMethodName } = Object.assign({
        getChunkLoaderStaticMethodName: 'getChunkLoader'
    }, options);

    return {
        name: CHUNK,

        // No server action is required:
        // Because Chunks may be defined OUTSIDE of the router, dispatcher can not be used for the server render

        // Prepare client routes for pre-loading dynamic imports
        initClientAction: ({ chunkLoaders }) => ({
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
                return preloadChunks(chunkLoaders);
            }

            return Promise.resolve();
        }
    };
}