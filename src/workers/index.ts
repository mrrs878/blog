function createWorker(src: Function) {
  let code = src.toString();
  code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
  const blob = new Blob([code], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
}

async function worker() {
  function fetch(url: string, method: 'GET'|'POST', header?: Array<{ key: string, value: string }>) {
    return new Promise((resolve, reject) => {
      const httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        reject(new Error('Giving up :( Cannot create an XML HTTP instance'));
        return false;
      }
      httpRequest.onreadystatechange = () => {
        try {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              resolve(JSON.parse(httpRequest.response));
            } else {
              reject(new Error('There was a problem with the request'));
            }
          }
        } catch (e) {
          reject(e);
          console.log(`Caught Exception: ${e.description}`);
        }
      };
      httpRequest.open(method, url);
      httpRequest.setRequestHeader('Content-Type', 'application/json');
      httpRequest.setRequestHeader('Accept', 'application/json, text/plain, */*');
      header?.forEach((item) => {
        httpRequest.setRequestHeader(item.key, item.value);
      });
      httpRequest.send();
    });
  }

  onmessage = async (e: MessageEvent) => {
    console.log(e.data);
    if (e.data === 'test') {
      const res = await fetch('http://www.gmmsj.com/gmminf/tradeapi/config?src_code=11&app_version=0&app_channel=ios_browser&method=SearchGameList&params=%7B%22src_code%22:%2211%22,%22device_id%22:%22TvXk44v5e8vdXc967cMSS5FNrxVec2xT%22,%22system_deviceId%22:%22TvXk44v5e8vdXc967cMSS5FNrxVec2xT%22,%22search_type%22:0,%22size%22:99999%7D', 'GET');
      console.log(res);
    }
  };
}

export default createWorker(worker);
