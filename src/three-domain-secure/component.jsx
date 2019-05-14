/* @flow */
/** @jsx node */
/* eslint max-lines: 0 */

import { node, dom } from 'jsx-pragmatic/src';
import { create, type ZoidComponent } from 'zoid/src';
import { inlineMemoize } from 'belter/src';
import { getSDKMeta, getClientID } from '@paypal/sdk-client/src';
import { ZalgoPromise } from 'zalgo-promise/src';

import { Overlay } from '../overlay';
import { getThreeDomainSecureUrl } from '../config';

export type TDSResult = {|
    
|};

export type TDSProps = {|
    action : string,
    xcomponent : string,
    flow : string,
    orderID : string,
    onSuccess : (TDSResult) => void,
    onError : (mixed) => void,
    sdkMeta : string,
    content : ?{
        windowMessage : string,
        continueMessage : string
    }
|};

export function getThreeDomainSecureComponent() : ZoidComponent<TDSProps> {
    return inlineMemoize(getThreeDomainSecureComponent, () => {
        return create({
            tag:               'three-domain-secure',
            url:               getThreeDomainSecureUrl,

            attributes: {
                iframe: {
                    scrolling: 'no'
                }
            },

            containerTemplate: ({ context, focus, close, frame, prerenderFrame, doc, event, props }) => {
                return (
                    <Overlay
                        context={ context }
                        close={ close }
                        focus={ focus }
                        event={ event }
                        frame={ frame }
                        prerenderFrame={ prerenderFrame }
                        content={ props.content }
                    />
                ).render(dom({ doc }));
            },

            props: {
                action: {
                    type:       'string',
                    queryParam: true,
                    value:      () => 'verify'
                },
                xcomponent: {
                    type:       'string',
                    queryParam: true,
                    value:      () => '1'
                },
                flow: {
                    type:       'string',
                    queryParam: true,
                    value:      () => '3ds'
                },
                createOrder: {
                    type:       'function',
                    queryParam: 'cart_id',
                    queryValue: ({ value }) => {
                        return ZalgoPromise.try(value);
                    }
                },
                clientID: {
                    type:       'string',
                    value:      getClientID,
                    queryParam: true
                },
                onSuccess: {
                    type:     'function',
                    alias:    'onContingencyResult',
                    decorate: ({ value, onError }) => {
                        return (err, result) => {
                            if (err) {
                                return onError(err);
                            }

                            return value(result);
                        };
                    }
                },
                sdkMeta: {
                    type:        'string',
                    queryParam:  true,
                    sendToChild: false,
                    value:       getSDKMeta
                },
                content: {
                    type:     'object',
                    required: false
                }
            }
        });
    });
}