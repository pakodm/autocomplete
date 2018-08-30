import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';

import { AlertService } from '../../services/alert.service';
import * as util from '../../utils';

const server = util.getAPIBaseUrl();

@Injectable()
export class HelperAutocompleteService {

  public reload$ = new  BehaviorSubject(null);

  constructor(private http: HttpClient, private alert: AlertService) { }

  getData(uri: string) {
    return this.http.get(`${server}/${uri}`)
      .catch((error) => this.alert.errorHandler(error));
  }

  OnReloadState() {
    return this.reload$.asObservable();
  }

  requestReloadData(tag) {
    this.reload$.next(tag);
  }
}
