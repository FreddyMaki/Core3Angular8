import { HttpParams, HttpHeaders } from '@angular/common/http';

export namespace HttpModels {
  export class HttpFileResponse {
    constructor(public fileName: string, public blob: Blob) {}
  }

  export class BlobInfoResponse {
    fileName: string;
    blobReadOnlyPath: string;
    canPreview?: boolean;
  }

  export class OptionOverrides {
    headers?: HttpHeaders;
    reportProgress?: boolean;
    withCredentials?: boolean = true;
  }

  export interface QueryStringData {
    [key: string]: number | string | boolean | Array<number | string>;
  }

  export class OptionsBase extends OptionOverrides {
    params?: HttpParams;

    constructor(queryString: QueryStringData, overrides?: OptionOverrides) {
      super();
      if (queryString) {
        this.params = this.getHttpParams(queryString);
      }

      if (overrides) {
        Object.assign(this, overrides);
      }
    }

    protected getHttpParams(queryStringData: QueryStringData) {
      // HttpParams is immutable, so we .reduce on the list and build the httpParam
      let params = new HttpParams();

      for (let key in queryStringData) {
        if (queryStringData.hasOwnProperty(key)) {
          let data = queryStringData[key];
          if (data === undefined || data === null || data === '') {
            // do not add null or undefined values in the final queryString
            continue;
          }
          if (data instanceof Array) {
            params = data.reduce((httpParam: HttpParams, currData: string | number, i: number) => {
              if (i === 0) {
                return httpParam.set(key, currData.toString());
              } else {
                return httpParam.append(key, currData.toString());
              }
            }, params);
          } else {
            params = params.set(key, data.toString());
          }
        }
      }

      return params;
    }
  }
  export class GetBlobOptions extends OptionsBase {
    observe: 'response' = 'response';
    responseType: 'blob' = 'blob';

    constructor(queryString: { [key: string]: number | string | string[] }, overrides?: OptionOverrides) {
      super(queryString, overrides);
    }
  }

  export class GetJsonOptions extends OptionsBase {
    observe: 'body' = 'body';
    responseType: 'json' = 'json';

    constructor(queryString: QueryStringData, overrides?: OptionOverrides) {
      super(queryString, overrides);
    }
  }

  export class GetJsonResponseOptions extends OptionsBase {
    observe: 'response' = 'response';
    responseType: 'json' = 'json';

    constructor(queryString: { [key: string]: string | string[] }, overrides?: OptionOverrides) {
      super(queryString, overrides);
    }
  }
}
