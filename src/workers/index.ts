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

  function _postMessage(data: any) {
    // @ts-ignore
    postMessage(data);
  }

  async function getLastCommit(type: string) {
    try {
      const data = await fetch('https://api.github.com/repos/mrrs878/blog/commits?page=1&per_page=1', 'GET');
      _postMessage({ type, data });
    } catch (e) {
      console.log(e);
    }
  }

  onmessage = async (e: MessageEvent) => {
    if (e.data === 'getLastCommit') {
      getLastCommit('last');
    }
    if (e.data === 'computeCommit') {
      setInterval(getLastCommit, 1000 * 60 * 5, 'compute');
    }
  };
}

export default createWorker(worker);
