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

type EventT = JSRunTimeErrorEventI | PromiseRejectionEvent | ErrorEvent | XMLHttpRequest;

const config: ConfigI = { reportUrl: '/' };

function report(event: EventT) {
  // const image = new Image();
  // image.src = `${config.reportUrl}/111`;
  navigator.sendBeacon(`${config.reportUrl}`, JSON.stringify(event));
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
  function handleEvent(event: any) {
    try {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        console.log('ajaxError', event.currentTarget);
        report(event.currentTarget);
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
    oldOpen.apply(this, args);
    // this.ajaxUrl = url;
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
