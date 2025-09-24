/// <reference types="jquery" />

$(function () {
  let timer_c: number = 0; // 1/100秒
  let timer_s: number = 0; // 秒
  let timer_m: number = 0; // 分
  let intervalId: number | null = null;
  let running: boolean = false;

  // タイマー自体
  const render = ():void => {
    const cs = String(timer_c).padStart(2, "0");
    const ss = String(timer_s).padStart(2, "0");
    const mm = String(timer_m).padStart(2, "0");
    $(".timer").text(`${mm}:${ss}.${cs}`);
  };

  // タイマーの数字
  const tick = ():void => {
    timer_c++;
    if (timer_c === 100) {
      timer_c = 0;
      timer_s++;
    }
    if (timer_s === 60) {
      timer_s = 0;
      timer_m++;
    }
    render();
  };

  // タイマー表示
  render();

  // ボタン
  $(".start-button").on("click", () => {
    if (!running) {
      running = true;
      intervalId = setInterval(tick, 10); // 10msごとに更新
      $(".start-button").prop("disabled", true).css("opacity", "0.5");
    } else return;
  });

  $(".stop-button").on("click", () => {
    if (running && intervalId !== null) {
      running = false;
      clearInterval(intervalId);
      intervalId = null;
      $(".start-button").prop("disabled", false).css("opacity", "1");
    } else return
  });

  $(".reset-button").on("click", () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    running = false;
    timer_m = timer_s = timer_c = 0;
    $(".start-button").prop("disabled", false).css("opacity", "1");
    render();
  });
});
