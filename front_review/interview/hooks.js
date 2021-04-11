/**
 * Life if frame(一个帧) 16.66ms
 * 
 * 1. Input events: Blocking input events(-touch -wheel)
 *                : Non-blocking input events (-keypress)
 * 
 * 2. Javascript: Timers(定时器) 
 * 
 * 3. Begin frame: pre frame events(每一帧事件: window.size, scroll, media query change)
 * 
 * 4. requestAnimationFrame: raf(frame callbacks)
 * 
 * 5. Layout: (1. Recalculate style、2. update layout)
 *
 * 6. Paint: 1.Compositing update 2. Paint invalidation 3. Record
 * 
 * 7. idle peroid: idle callback1、idle callback2
 *  
 */