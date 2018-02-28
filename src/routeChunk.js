// @flow
import { withActions } from 'react-router-dispatcher';
import chunkAction from './chunkAction';

export default function routeChunk({ mapParamsToProps, ...chunkOptions } = {}) {
    return withActions(mapParamsToProps, chunkAction(chunkOptions));
}
