/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

const l = 42; // 滑块边长
const r = 9; // 滑块半径
const w = 350; // canvas宽度
const h = 200; // canvas高度
const { PI } = Math;
const L = l + r * 2 + 3; // 滑块实际边长

interface PropsI {
  onSuccess: () => any;
  onClose: () => any;
}

function sum(x: number, y: number) {
  return x + y;
}

function square(x: number) {
  return x * x;
}

function getRandomNumberByRange(start: number, end: number) {
  return Math.round(Math.random() * (end - start) + start);
}

function getRandomImg() {
  // return `https://picsum.photos/350/200/?image=${getRandomNumberByRange(0, 1084)}`;
  return 'https://i.picsum.photos/id/648/350/200.jpg?hmac=2BO8hrHzcalCSb3b3oKIJ8lvFFd_wyhZakTGj3fDZ0k';
}

function createElement<T>(tagName: string, className: string = ''): T {
  const elment = document.createElement(tagName) as any;
  elment.className = className;
  return elment;
}

function createImg() {
  const img = createElement<HTMLImageElement>('img');
  img.crossOrigin = 'Anonymous';
  img.src = getRandomImg();
  return img;
}

function drawD(ctx: CanvasRenderingContext2D|null, x: number, y: number, operation: 'fill'|'clip', shape: number) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  if (shape === 0) {
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
  } else if (shape === 1) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l + 2);
    ctx.arc(x + l / 2, y + l + 8, r, -0.21 * PI, 1.21 * PI);
    ctx.lineTo(x, y + l + 2);
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  } else if (shape === 2) {
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + 5, y + l / 2, r, 1.31 * PI, 2.71 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.arc(x + l / 2, y + l - 5, r, 0.21 * PI, 0.81 * PI, true);
    ctx.lineTo(x, y + l);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = 'overlay';
}

enum DragStatus {
  pending,
  start,
  move,
  end
}

enum VerifyStatus {
  pending,
  success,
  fail
}

const MVerify = (props: PropsI) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blockRef = useRef<HTMLCanvasElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const refreshIconRef = useRef<HTMLDivElement>(null);
  const sliderMaskRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderIconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [dragStatus, setDragStatus] = useState(DragStatus.pending);
  const [moveX, setMoveX] = useState(0);
  const [blockLeft, setBlockLeft] = useState(0);
  const [verifyStatus, setVerifyStatus] = useState(VerifyStatus.pending);
  const [canvasCtx, setCanvasCtx] = useState(canvasRef?.current?.getContext('2d') || null);
  const [blockCtx, setBlockCtx] = useState(blockRef?.current?.getContext('2d') || null);

  const position = { x: 0, y: 0 };
  const trail: Array<number> = [];
  let blockShape = 0;
  const blockPositionFix = [0, 15, 0];
  let unBindEvents = () => {};

  function draw() {
    const x = getRandomNumberByRange(L + 10, w - (L + 10));
    const y = getRandomNumberByRange(10 + r * 2, h - (L + 10));
    position.x = x;
    position.y = y;
    blockShape = (Math.random() * 100) % 3 >> 0;
    drawD(canvasCtx, x, y, 'fill', blockShape);
    drawD(blockCtx, x, y, 'clip', blockShape);
  }

  function initImg() {
    const _img = createImg();
    _img.onload = () => {
      draw();
      const { y, x } = position;
      blockCtx?.drawImage(_img, 0, 0, w, h);
      canvasCtx?.drawImage(_img, 0, 0, w, h);
      const _y = y - r * 2 - 1 + blockPositionFix[blockShape];
      const imageData = blockCtx?.getImageData(x - 3, _y, L, L);
      if (imageData && blockCtx) {
        blockCtx.canvas.width = imageData?.width || 0;
        blockCtx.putImageData(imageData, 0, _y);
      }
    };
  }

  function clean() {
    canvasCtx?.clearRect(0, 0, w, h);
    blockCtx?.clearRect(0, 0, w, h);
    if (blockRef.current) blockRef.current.width = w;
  }

  function verify() {
    const arr = trail; // 拖动时y轴的移动距离
    const average = arr.reduce(sum) / arr.length;
    const deviations = arr.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    const left = parseInt(blockRef?.current?.style?.left || '', 10);
    return {
      spliced: Math.abs(left - position.x) < 10,
      verified: stddev !== 0, // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    };
  }

  function reset() {
    setMoveX(0);
    setBlockLeft(0);
    setVerifyStatus(VerifyStatus.pending);
    setDragStatus(DragStatus.pending);
    clean();
    initImg();
  }

  function onFail() {
    setVerifyStatus(VerifyStatus.fail);
    setTimeout(() => {
      reset();
    }, 1000);
  }

  function onSuccess() {
    setVerifyStatus(VerifyStatus.success);
    setTimeout(() => {
      props.onClose();
      props.onSuccess();
      reset();
    }, 1000);
  }

  function bindEvents() {
    let originX: number;
    let originY: number;
    let isMouseDown = false;

    const handleDragStart = (e: any) => {
      originX = e.clientX || e.touches[0].clientX;
      originY = e.clientY || e.touches[0].clientY;
      isMouseDown = true;
      setDragStatus(DragStatus.start);
    };

    const handleDragMove = (e: any) => {
      if (!isMouseDown) return false;
      const eventX = e.clientX || e.touches[0].clientX;
      const eventY = e.clientY || e.touches[0].clientY;
      const _moveX = eventX - originX;
      const moveY = eventY - originY;
      if (_moveX < 0 || _moveX + 38 >= w) return false;
      setMoveX(_moveX);
      setBlockLeft(((w - 40 - 20) / (w - 40)) * _moveX);
      setDragStatus(DragStatus.move);
      trail.push(moveY);
    };

    const handleDragEnd = (e: any) => {
      if (!isMouseDown) return false;
      isMouseDown = false;
      const eventX = e.clientX || e.changedTouches[0].clientX;
      if (eventX === originX) return false;

      setDragStatus(DragStatus.end);

      const { spliced, verified } = verify();
      if (spliced) {
        if (verified) {
          onSuccess();
        } else {
          onFail();
        }
      } else {
        onFail();
      }
    };

    refreshIconRef?.current?.addEventListener('click', reset);
    sliderRef?.current?.addEventListener('mousedown', handleDragStart);
    sliderRef?.current?.addEventListener('touchstart', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    unBindEvents = () => {
      refreshIconRef?.current?.removeEventListener('click', reset);
      sliderRef?.current?.removeEventListener('mousedown', handleDragStart);
      sliderRef?.current?.removeEventListener('touchstart', handleDragStart);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }

  useEffect(() => {
    initImg();
    bindEvents();
    return () => {
      reset();
      unBindEvents();
    };
  }, [blockCtx]);

  useEffect(() => {
    setCanvasCtx(canvasRef?.current?.getContext('2d') || null);
  }, [canvasRef]);

  useEffect(() => {
    setBlockCtx(blockRef?.current?.getContext('2d') || null);
  }, [blockRef]);

  return (
    <div style={{
      padding: '20px 0 20px',
      boxSizing: 'content-box',
      backgroundColor: '#fff',
      height: 280,
      width: 350,
      margin: '0 auto',
    }}
    >
      <p>请完成以下验证后继续:</p>
      <div
        ref={containerRef}
        style={{
          borderRadius: 10, width: 350, height: 200, backgroundColor: '#fff', position: 'relative' }}
      >
        <canvas ref={canvasRef} className="" width={w} height={h} />
        <div ref={refreshIconRef} className="refreshIcon" />
        <canvas ref={blockRef} width={w} height={h} style={{ left: `${blockLeft}px` }} className="block" />
        <div
          ref={sliderContainerRef}
          className={`sliderContainer
            ${dragStatus === DragStatus.move ? 'sliderContainer_active' : ''}
            ${verifyStatus === VerifyStatus.success ? 'sliderContainer_success' : ''}
            ${verifyStatus === VerifyStatus.fail ? 'sliderContainer_fail' : ''}
          `}
        >
          <div ref={sliderMaskRef} style={{ width: `${moveX}px` }} className="sliderMask" />
          <div ref={sliderRef} style={{ left: `${moveX}px` }} className="slider">
            <span ref={sliderIconRef} className="sliderIcon" />
          </div>
          <span ref={textRef} className="sliderText">向右滑动填充拼图</span>
        </div>
      </div>
    </div>
  );
};

export default MVerify;
