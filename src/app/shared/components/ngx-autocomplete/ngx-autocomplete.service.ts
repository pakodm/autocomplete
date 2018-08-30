import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../shared/services/alert.service';
import * as util from '../../utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';

const server = util.getAPIBaseUrl();

@Injectable()
export class NgxAutocompleteService {

  public reload$ = new  BehaviorSubject(null);

  constructor(private http: HttpClient, private alert: AlertService) { }

  getData(uri: string) {
    return this.http.get(`${server}/${uri}`)
      .catch((error) => this.alert.errorHandler(error));
  }
}
