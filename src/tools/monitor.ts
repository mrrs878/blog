interface ConfigI {
  reportUrl: string;
}

interface JSRunTimeErrorEventI {
  event: Event | string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
}

interface AjaxErrorEventI {
  response: string;
  responseText: string;
  responseType: string;
  responseURL: string;
  responseXML: string;
  status: number;
  method: string;
  url: string;
}

type EventT = JSRunTimeErrorEventI | PromiseRejectionEvent | AjaxErrorEventI | ErrorEvent | XMLHttpRequest;

const config: ConfigI = { reportUrl: '/' };

function report(event: EventT) {
  const image = new Image();
  image.src = `${config.reportUrl}?error=${JSON.stringify(event)}`;
  // navigator.sendBeacon(`${config.reportUrl}`, JSON.stringify(event));
}

// js运行时异常
function syncAndAsyncError() {
  window.onerror = function (event, source, lineno, colno, error) {
    console.log('syncAndAsyncError', { event, source, lineno, colno, error });
    report({ event, source, error, lineno, colno });
    return true;
  };
}

// Promise异常
function promiseError() {
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    e.preventDefault();
    console.log('promiseError', e);
    report(e);
    return true;
  }, true);
}

// 静态资源加载异常
function assetsError() {
  window.addEventListener('error', (e: ErrorEvent) => {
    const { target } = e;
    const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
    if (!isElementTarget) return false;
    console.log('assetsError', e);
    report(e);
    return true;
  }, true);
}

// ajax请求异常
function ajaxError() {
  const { protocol } = window.location;
  if (protocol === 'file:') return;
  if (!window.XMLHttpRequest) return;
  const xmlReq = window.XMLHttpRequest;
  const oldSend = xmlReq.prototype.send;
  const oldOpen = xmlReq.prototype.open;
  const oldArgs = { method: '', url: '' };
  function handleEvent(event: any) {
    try {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        const { response, responseText, responseType, responseURL, responseXML, status } = event.currentTarget;
        console.log('ajaxError', JSON.stringify({ response, responseText, responseType, responseURL, responseXML, status, ...oldArgs }));
        report({ response, responseText, responseType, responseURL, responseXML, status, ...oldArgs });
      }
    } catch (e) {
      console.log(`Tool's error: ${e}`);
    }
  }
  xmlReq.prototype.send = function (...args) {
    this.addEventListener('error', handleEvent);
    this.addEventListener('load', handleEvent);
    this.addEventListener('abort', handleEvent);
    return oldSend.apply(this, args);
  };
  xmlReq.prototype.open = function (...args: any) {
    const [method, url] = args;
    Object.assign(oldArgs, { method, url });
    oldOpen.apply(this, args);
  };
}

function init(_config: ConfigI) {
  Object.assign(config, _config);
  syncAndAsyncError();
  promiseError();
  assetsError();
  ajaxError();

  console.log(config);
}

export default init;
