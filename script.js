(() => {
  let cur = "0"; // 画面の現在入力、つなげるのでstring型
  let prev = null; // 直前の値（number | null）
  let op = null; // "+", "-", "*", "/", または null
  let justEq = false; // 直前に=したか

  const show = (s) => (document.querySelector(".display").value = s); // htmlのvalueをsに変換
  const toNum = (s) => Number(s || "0"); // 文字をNumメソッドで数字に変換
  const trim = (n) => Number(n.toFixed(12)); // 小数点を切り捨て

  function inputDigit(d) {
    if (justEq) {
      cur = "0";
      justEq = false;
    } // ＝で結果を出した後、1から計算するように更新

    if (cur === "0") cur = d;
    else if (cur === "-0") cur = "-" + d;
    else cur += d;

    if (op && prev !== null && cur === "0") {
      show(`${prev}${op}`);
    } else if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
    // 電卓全体の動作
  }

  function inputDot() {
    if (justEq) {
      cur = "0";
      justEq = false;
    }

    if (!cur.includes(".")) cur += ".";
    show(cur);
    // 小数点が含まれてない時に小数点を追加、一度に二度小数点を入力することは不可
  }

  function setOp(symbol) {
    if (op && prev !== null && !justEq) evaluate(); // 四則演算子が１つ以上ある場合に事前にprevの中に数字を格納する
    prev = toNum(cur);
    op = symbol;
    cur = "0";
    justEq = false;

    if (op && prev !== null && cur === "0") {
      show(`${prev}${op}`);
    } else if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
    // 前回の数字を記録し、inputを0に戻す。次の数字入力に移行
  }

  function evaluate() {
    if (op === null || prev === null) return;
    const a = prev,
      b = toNum(cur);
    let res;
    switch (op) {
      case "+":
        res = a + b;
        break;
      case "-":
        res = a - b;
        break;
      case "*":
        res = a * b;
        break;
      case "/":
        if (b === 0) {
          show("Error");
          resetAll();
          justEq = true;
          return;
        }
        res = a / b;
        break;
    }
    // 四則演算子によって効果を変える
    cur = String(trim(res));
    prev = null;
    op = null;
    justEq = true;
    if (op && prev !== null && cur === "0") {
      show(`${prev}${op}`);
    } else if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
    // =で結果を出した時に値をjustEq以外リセットする、justEqをtrueにしているのは結果を表示している時に別の計算をしたい時に0に戻す
  }

  function clearEntry() {
    cur = "0";
    if (op && prev !== null && cur === "0") {
      show(`${prev}${op}`);
    } else if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
    // 文字リセット
  }
  function resetAll() {
    cur = "0";
    prev = null;
    op = null;
    justEq = false;
    if (op && prev !== null && cur === "0") {
      show(`${prev}${op}`);
    } else if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
    // 値を全部リセット
  }

  function backspace() {
    if (justEq) return;
    if (cur.length <= 1 || cur === "-0")
      cur = "0"; //数字が一文字か負符号の場合、0に戻す
    else cur = cur.slice(0, -1); //0番めから末端から-1文字めまでを取得、実質一文字削除
    if (op && prev !== null) {
      show(`${prev}${op}${cur}`);
    } else {
      show(`${cur}`);
    }
  }

  // クリック（イベント委譲）
  document.querySelector(".keys").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const v = btn.dataset.val;
    const a = btn.dataset.act;
    const o = btn.dataset.op;

    if (v !== undefined) return inputDigit(String(v)); // 入力の値が数字だった場合のロジック
    if (a === "dot") return inputDot(); // ドットのロジック
    if (a === "eq") return evaluate(); // =の計算のロジック
    if (a === "ac") return resetAll(); //全リセット時のロジック
    if (a === "ce") return clearEntry(); // その時点の数字のみリセットのロジック
    if (a === "bs") return backspace(); // 一文字のみ消したい時のロジック
    if (o) return setOp(o); // 四則演算子を押した時のロジック
  });

  // pcのキーボード対応のロジック
  document.addEventListener("keydown", (e) => {
    const k = e.key;
    if (/\d/.test(k)) return inputDigit(k); //数字かチェック
    if (k === ".") return inputDot(); // ドットのロジック
    if (k === "Enter" || k === "=") return evaluate(); // =の計算のロジック
    if (k === "Escape") return resetAll(); //全リセット時のロジック
    if (k === "Backspace") return backspace(); // 一文字のみ消したい時のロジック
    if (["+", "-", "*", "/"].includes(k)) return setOp(k); // 四則演算子を押した時のロジック
  });

  if (op && prev !== null) {
    show(`${prev}${op}${cur}`);
  } else {
    show(`${cur}`);
  } // 画面表示
})();
