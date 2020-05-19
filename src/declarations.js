/* @flow */
/* eslint import/unambiguous: 0 */

import type { FundingEligibilityType } from '@paypal/sdk-client/src';
import { FUNDING } from '@paypal/sdk-constants/src';

declare var __PAYPAL_CHECKOUT__ : {|
    __REMEMBERED_FUNDING__ : Array<$Values<typeof FUNDING>> // eslint-disable-line flowtype/no-mutable-array
|};

declare var __paypal_checkout__ : {|
    serverConfig : {|
        fundingEligibility : FundingEligibilityType
    |}
|};

declare var __hosted_fields__ : void;
