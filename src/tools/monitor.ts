interface ConfigI {
  reportUrl: string;
}

interface BaseinfoI {
  title: string;
  location: string;
  message: string;
  kind: string;
  type: string;
  errorType: string;
}

interface JSRunTimeErrorEventI extends BaseinfoI {
  filename: string;
  position: string;
  stack: string;
  selector: string;
}

interface AssetsErrorI extends BaseinfoI {
  url: string;
  nodeName: string;
}

interface AjaxErrorEventI extends BaseinfoI {
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

function getLastEvent(): undefined | Event {
  let lastEvent;
  ['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach((eventType) => document.addEventListener(eventType, (event) => {
    lastEvent = event;
  }, {
    capture: true,
    passive: true,
  }));
  return lastEvent;
}

function getSelector(path: Array<EventTarget>) {
  return '';
}

function report<T>(data: { type: 'JSRunTimeErrorI' | 'PromiseErrorT' | 'AssetsErrorI' | 'AjaxErrorEventI'; info: T }) {
  const image = new Image();
  image.src = `${config.reportUrl}?error=${JSON.stringify(data.info)}`;
}

function getCommonInfoFromEvent(event?: Event) {
  return {
    title: document.title.replace(/&/, ''),
    location: window.location.href.replace(/&/, ''),
    kind: 'stability',
    type: 'error',
  };
}

function getLines(stack: string | undefined) {
  return stack?.split('\n').slice(1).map((item) => item.replace(/^\s+at\s+/g, '')).join('') || '';
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
    console.log(event);

    report<PromiseErrorT>({ type: 'PromiseErrorT', info: { message, stack, event } });
    return true;
  }, true);
}

// 静态资源加载异常&JSRuntime异常
function assetsError() {
  window.addEventListener('error', (event: ErrorEvent) => {
    const { target } = event;
    console.log(event);
    const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
    if (!isElementTarget) {
      const { message, filename, lineno, colno, error } = event;
      const position = `${lineno}:${colno}`;
      const stack = getLines(error instanceof Error ? error.stack : '');
      const lastEvent = getLastEvent();
      const selector = lastEvent ? getSelector(lastEvent.composedPath()) : '';
      report<JSRunTimeErrorEventI>({
        type: 'JSRunTimeErrorI',
        info: { ...getCommonInfoFromEvent(), message, errorType: 'jsError', filename, position, stack, selector },
      });
    } else {
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

      report<AssetsErrorI>({ type: 'AssetsErrorI',
        info: {
          url,
          errorType: 'AjaxError',
          nodeName,
          message: '',
          ...getCommonInfoFromEvent() } });
    }
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
        const { response, status, statusText } = event.currentTarget;
        const { method, url } = oldArgs;
        console.log(event);

        report<AjaxErrorEventI>({
          type: 'AjaxErrorEventI',
          info: {
            response: JSON.parse(response),
            status,
            method,
            url,
            message: statusText,
            errorType: 'AjaxError',
            ...getCommonInfoFromEvent(),
          },
        });
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
  promiseError();
  assetsError();
  ajaxError();
}

export default init;
