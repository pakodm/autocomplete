import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/observable/throw';

import * as util from '../utils';

@Injectable()
export class AlertService {

  constructor(public snackBar: MatSnackBar) {
  }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    let errorMsg = '';
    if (error.status === 400) {
      if (error && error.status && error.error.status !== undefined
        && error.error.status.isError === 1) {
        errorMsg = error.error.status.messages[0];
      } else {
        console.log('Uknown backend error', error);
        errorMsg = 'Server error';
      }
      this.snackBar.open(errorMsg, '', {
        duration: util.getAlertDuration(),
        panelClass: 'error-alert'
      });
    }
    return Observable.throw((error || 'Server error'));
  }

  showError(errorMsg: string): Observable<any> {
    this.snackBar.open(errorMsg, '', {
      duration: util.getAlertDuration(),
      panelClass: 'error-alert'
    });
    return Observable.throw(errorMsg);
  }

}
