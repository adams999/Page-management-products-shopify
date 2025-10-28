import { Injectable } from '@angular/core';
import { SplitFactory } from '@splitsoftware/splitio-browserjs';
import { fromEvent, Subscription } from 'rxjs';

@Injectable()
export class SplitIoService {

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-09 02:15:28
   * @Desc: split service code in https://www.split.io/blog/continuous-deployment-in-angular/
   */
    splitio: SplitIO.ISDK;
    splitClient: SplitIO.IClient;
    isReady = false;
    treatments: SplitIO.Treatments;
    subscription: Subscription;
    features: string[] = [
        'channel-youtube'
    ];


    isTreatmentOn(treatmentName: string) : boolean {
      let treatment = this.splitClient.getTreatment(treatmentName);
      let result = null;

      if (treatment == 'on') {
        result = true;
      } else if (treatment == 'off') {
        result = false;
      } else {
        result = false;
      }

      //console.log(`Value of: ${treatmentName} is ${treatment}`);

      return result;
    }

    initSdk(): void {
        this.splitio = SplitFactory({
            core: {
                authorizationKey: 'lbpkffs0ks7ra0olte5ff45oir1p28bim2vd',
                key: 'user_id'
            }
        });

        this.splitClient = this.splitio.client();
        this.verifyReady();
    }


    private verifyReady(): void {
        const isReadyEvent = fromEvent(this.splitClient, this.splitClient.Event.SDK_READY);

        this.subscription = isReadyEvent.subscribe({
            next() {
                this.isReady = true;
                console.log('Sdk ready: ', this.isReady);
            },
            error(err) {
                console.log('Sdk error: ', err);
                this.isReady = false;
            }
        });
    }

    getTreatments(): void {
        this.treatments = this.splitClient.getTreatments(this.features);
    }
      }
