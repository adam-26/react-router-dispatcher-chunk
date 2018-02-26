// @flow
import { withActions } from 'react-router-dispatcher';
import chunkAction from './chunkAction';

export default function routeChunk(options) {
    return withActions(chunkAction(options));
}
