interface ConfigI {
  reportUrl: string;
}

interface JSRunTimeErrorEventI {
  event: Event | string;
  message?: string;
  stack?: string;
  lineno?: number;
  colno?: number;
}

interface AssetsErrorI {
  url: string;
  nodeName: string;
}

interface AjaxErrorEventI {
  response: string;
  status: number;
  method: string;
  url: string;
}

interface PromiseErrorT {
  message: string;
  stack: string;
  event: PromiseRejectionEvent;
}

const config: ConfigI = { reportUrl: '/' };

function report<T>(data: { type: 'JSRunTimeErrorI' | 'PromiseErrorT' | 'AssetsErrorI' | 'AjaxErrorEventI'; info: T }) {
  const image = new Image();
  const _data = { ...data, title: document.title, location: window.location.href };
  image.src = `${config.reportUrl}?error=${JSON.stringify(_data)}`;
}

// js运行时异常
function syncAndAsyncError() {
  window.onerror = function (event, source, lineno, colno, error) {
    const { message, stack } = error || {};
    report<JSRunTimeErrorEventI>({ type: 'JSRunTimeErrorI', info: { event, message, stack, lineno, colno } });
    return true;
  };
}

// Promise异常
function promiseError() {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    event.preventDefault();
    let message = '';
    let stack = '';
    message = event.reason;
    if (event instanceof Error) {
      message = event.message;
      stack = event.stack || '';
    }
    report<PromiseErrorT>({ type: 'PromiseErrorT', info: { message, stack, event } });
    return true;
  }, true);
}

// 静态资源加载异常
function assetsError() {
  window.addEventListener('error', (event: Event) => {
    const { target } = event;
    const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
    if (!isElementTarget) return false;
    let url = '';
    let nodeName = '';
    if (target instanceof HTMLImageElement || target instanceof HTMLScriptElement) {
      url = target.src;
      nodeName = target.nodeName;
    }
    if (target instanceof HTMLLinkElement) {
      url = target.href;
      nodeName = target.nodeName;
    }

    report<AssetsErrorI>({ type: 'AssetsErrorI', info: { url, nodeName } });
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
}

export default init;
