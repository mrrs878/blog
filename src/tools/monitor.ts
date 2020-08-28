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

interface AssetsErrorI extends ErrorEvent {}

interface AjaxErrorEventI {
  response: string;
  status: number;
  method: string;
  url: string;
}

const config: ConfigI = { reportUrl: '/' };

const formater = {
  JSRunTimeErrorEventI<T>(error: T) {},
  PromiseRejectionEvent<T>(error: T) {},
  AssetsErrorI<T>(error: T) {},
  AjaxErrorEventI<T>(error: T) {},
};

function report<T>(data: { type: 'JSRunTimeErrorEventI' | 'PromiseRejectionEvent' | 'AssetsErrorI' | 'AjaxErrorEventI'; info: T }) {
  // const image = new Image();
  // image.src = `${config.reportUrl}?error=${JSON.stringify(event)}`;
  console.log(data.type);
  const formattedInfo = formater[data.type]<T>(data.info);
  console.log(formattedInfo);
  
}

// js运行时异常
function syncAndAsyncError() {
  window.onerror = function (event, source, lineno, colno, error) {
    console.log('syncAndAsyncError', { event, source, lineno, colno, error });
    console.log(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    report<JSRunTimeErrorEventI>({ type: 'JSRunTimeErrorEventI', info: { event, source, error, lineno, colno } });
    return true;
  };
}

// Promise异常
function promiseError() {
  window.addEventListener('unhandledrejection', (error: PromiseRejectionEvent) => {
    error.preventDefault();
    report<PromiseRejectionEvent>({ type: 'PromiseRejectionEvent', info: error });
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
    report<AssetsErrorI>({ type: 'AssetsErrorI', info: e });
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
        const { response, status } = event.currentTarget;
        const { method, url } = oldArgs;
        report<AjaxErrorEventI>({ type: 'AjaxErrorEventI', info: { response: JSON.parse(response), status, method, url } });
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
