/* 공간좌표 — 그림 모음
   교과서 TikZ 그림은 수학 좌표 (x, y, z) 를 TikZ (y, z, x) 로 그린다: x 축이 앞쪽(왼쪽 아래), y 축이 오른쪽, z 축이 위.
   M(x, y, z) 가 그 바꿈이다. 항목 형식은 공간도형의 figs.js 와 같다. */
(function (root) {
  "use strict";
  const add = (a, b) => a.map((v, i) => v + b[i]), sub = (a, b) => a.map((v, i) => v - b[i]), mul = (a, k) => a.map(v => v * k);
  const mid = (a, b) => mul(add(a, b), 0.5), len = a => Math.hypot(...a), nrm = a => mul(a, 1 / len(a));
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const seg = (a, b, o = {}) => ["seg", a, b, o], pt = (a, o = {}) => ["pt", a, o], lab = (a, t, o = {}) => ["lab", a, t, o];
  const plane = (ps, o = {}) => ["plane", ps, o], face = (ps, o = {}) => ["face", ps, o], ra = (c, u, v, o = {}) => ["ra", c, u, v, o];
  const tick = (a, b, o = {}) => ["tick", a, b, o], arrow = (a, b, o = {}) => ["arrow", a, b, o], circ = (c, n, r, o = {}) => ["circ", c, n, r, o];
  const sph = (c, r, o = {}) => ["sphere", c, r, o], ell = (c, u, v, o = {}) => ["ell", c, u, v, o];
  const M = (x, y, z) => [y, z, x];
  const R = s => `$\\rm ${s}$`;
  // 좌표축: 양의 끝 x1, y1, z1 / 음의 끝 x0, y0, z0 (수학 좌표)
  function axes(x1 = 4, y1 = 4, z1 = 4, x0 = 0, y0 = 0, z0 = 0, o = {}) {
    return [arrow(M(x0, 0, 0), M(x1, 0, 0), { w: 0.06, p: o.p }), arrow(M(0, y0, 0), M(0, y1, 0), { w: 0.06, p: o.p }), arrow(M(0, 0, z0), M(0, 0, z1), { w: 0.06, p: o.p }),
      lab(M(x1 + 0.5, 0, 0), "$x$", { p: o.p }), lab(M(0, y1 + 0.5, 0), "$y$", { p: o.p }), lab(M(0, 0, z1 + 0.5), "$z$", { p: o.p }), lab(M(0, 0, 0), R("O"), { o: "al", p: o.p })];
  }
  // 원점과 P(a, b, c) 를 마주 보는 꼭짓점으로 하는 상자 (좌표 상자)
  function cbox(a, b, c, o = {}) {
    const V = { O: M(0, 0, 0), X: M(a, 0, 0), Y: M(0, b, 0), Z: M(0, 0, c), XY: M(a, b, 0), YZ: M(0, b, c), ZX: M(a, 0, c), P: M(a, b, c) };
    const E = [["X", "XY"], ["Y", "XY"], ["Y", "YZ"], ["Z", "YZ"], ["Z", "ZX"], ["X", "ZX"], ["XY", "P"], ["YZ", "P"], ["ZX", "P"]];
    const it = E.map(([p, q]) => seg(V[p], V[q], { w: 0.05, dash: o.dash, p: o.p, c: o.c }));
    if (o.faces !== false) it.push(face([V.O, V.X, V.XY, V.Y], { c: "n", op: 0.1, p: o.p }), face([V.X, V.XY, V.P, V.ZX], { c: "n", op: 0.1, p: o.p }), face([V.Y, V.XY, V.P, V.YZ], { c: "n", op: 0.1, p: o.p }));
    return { V, it };
  }
  const F = {};

  F.intro = () => { const b = cbox(2, 3, 2.4); return { P: {}, size: 20, I: [...axes(4, 5, 4), ...b.it, pt(b.V.P), lab(b.V.P, R("P(a,\\,b,\\,c)"), { o: "ar" }), sph(M(1, 4.5, 3.4), 0.9, { c: "g", op: 0.3 })] }; };
  // 좌표축과 좌표평면
  F.axesPlanes = () => ({ P: {}, size: 20, I: [...axes(5, 5, 5, -2, -2, -2),
    plane([M(-2, -2, 0), M(4, -2, 0), M(4, 4, 0), M(-2, 4, 0)], { c: "y", op: 0.2, p: 1 }), lab(M(4.6, 4.2, 0), "{y:$xy$평면}  $z=0$", { p: 1, sz: 1.2 }),
    plane([M(0, -2, -2), M(0, 4, -2), M(0, 4, 4), M(0, -2, 4)], { c: "b", op: 0.2, p: 1 }), lab(M(0, 4.4, 4.4), "{b:$yz$평면}  $x=0$", { p: 1, sz: 1.2 }),
    plane([M(-2, 0, -2), M(4, 0, -2), M(4, 0, 4), M(-2, 0, 4)], { c: "m", op: 0.2, p: 1 }), lab(M(4.6, 0, 4.4), "{m:$zx$평면}  $y=0$", { p: 1, sz: 1.2 })] });
  // 점의 좌표: P 에서 세 축에 내린 수선의 발 a, b, c
  F.pointCoord = () => { const b = cbox(2, 3, 2.5); const V = b.V;
    return { P: {}, size: 20, I: [...axes(4, 5, 4), ...b.it, pt(V.P), lab(V.P, R("P"), { o: "ar" }),
      pt(V.X, { c: "b" }), pt(V.Y, { c: "b" }), pt(V.Z, { c: "b" }), lab(V.X, "$a$", { o: "bl", c: "b" }), lab(V.Y, "$b$", { o: "br", c: "b" }), lab(V.Z, "$c$", { o: "l", c: "b" }),
      lab(V.P, "$(a,\\,b,\\,c)$", { o: "r", p: 1, c: "g" }), ra(V.X, V.O, V.ZX, { p: 0 }), ra(V.Y, V.O, V.YZ, { p: 0 })] }; };
  // 보기: P(1, 2, 4) 와 수선의 발
  F.bogiP = () => { const b = cbox(1, 2, 4); const V = b.V;
    return { P: {}, size: 20, I: [...axes(3, 4, 5), ...b.it, pt(V.P), lab(V.P, R("P(1,\\,2,\\,4)"), { o: "r" }),
      pt(V.XY, { c: "m" }), pt(V.YZ, { c: "m" }), pt(V.ZX, { c: "m" }), lab(V.XY, R("A"), { o: "br", c: "m" }), lab(V.YZ, R("B"), { o: "r", c: "m" }), lab(V.ZX, R("C"), { o: "l", c: "m" }),
      pt(V.X, { c: "b", p: 1 }), pt(V.Y, { c: "b", p: 1 }), pt(V.Z, { c: "b", p: 1 }), lab(V.X, R("D"), { o: "bl", c: "b", p: 1 }), lab(V.Y, R("E"), { o: "br", c: "b", p: 1 }), lab(V.Z, R("F"), { o: "l", c: "b", p: 1 }),
      lab(V.X, "$1$", { o: "b", p: 1 }), lab(V.Y, "$2$", { o: "b", p: 1 }), lab(V.Z, "$4$", { o: "al", p: 1 })] }; };
  // 문제: 두 그림
  F.prob1 = () => {
    const b1 = cbox(2, 4, 3), sh = [9, 0, 0], S = q => add(q, sh);
    const it = [...axes(4, 6, 5), ...b1.it, pt(b1.V.P), lab(b1.V.P, R("A"), { o: "ar" }), lab(b1.V.ZX, R("B"), { o: "l" }), lab(b1.V.Z, R("C"), { o: "l" }),
      lab(b1.V.X, "$2$", { o: "bl" }), lab(b1.V.Y, "$4$", { o: "b" }), lab(b1.V.Z, "$3$", { o: "r" }), lab(M(5, 2, 0), "{g:(1)}", { sz: 1.3 })];
    const b2 = cbox(3, -6, 5);
    const ax2 = axes(5, 2, 7, 0, -8, 0).map(x => x[0] === "arrow" ? ["arrow", S(x[1]), S(x[2]), x[3]] : ["lab", S(x[1]), x[2], x[3]]);
    it.push(...ax2, ...b2.it.map(x => x[0] === "seg" ? ["seg", S(x[1]), S(x[2]), x[3]] : ["face", x[1].map(S), x[2]]),
      pt(S(b2.V.YZ)), pt(S(b2.V.P)), pt(S(b2.V.X)), lab(S(b2.V.YZ), R("A"), { o: "a" }), lab(S(b2.V.P), R("C"), { o: "r" }), lab(S(b2.V.X), R("B"), { o: "r" }),
      lab(S(b2.V.Z), "$5$", { o: "r" }), lab(S(b2.V.Y), "$-6$", { o: "b" }), lab(S(b2.V.X), "$3$", { o: "bl" }), lab(S(M(5, -3, 0)), "{g:(2)}", { sz: 1.3 }));
    return { P: {}, size: 30, I: it, yaw: -0.45 };
  };
  F.prob2 = () => { const b = cbox(2, 4, -1); return { P: {}, size: 20, I: [...axes(4, 6, 1.5, -2, -2, -2.5), ...b.it, pt(b.V.P), lab(b.V.P, R("P(2,\\,4,\\,-1)"), { o: "b" })] }; };
  // 두 점 사이의 거리
  F.dist = () => {
    const A = M(4, 3, 4), B = M(1, 8, 6), P = M(4, 8, 4), Q = M(1, 8, 4);
    const C = { A, B, P, Q, A2: M(1, 3, 4), A3: M(4, 3, 6), A4: M(1, 3, 6), P2: M(4, 8, 6) };
    const E = [["A", "P"], ["P", "Q"], ["Q", "A2"], ["A2", "A"], ["A", "A3"], ["P", "P2"], ["Q", "B"], ["A2", "A4"], ["A3", "P2"], ["P2", "B"], ["B", "A4"], ["A4", "A3"]];
    return { P: C, size: 20, I: [...axes(6, 9, 7), ...E.map(([p, q]) => seg(p, q, { w: 0.05 })), seg("A", "B", { c: "r", w: 0.11 }),
      seg("A", "Q", { c: "b", w: 0.08, p: 1 }), ra("P", "A", "Q", { p: 1 }), ra("Q", "A", "B", { p: 1 }),
      ...["A", "B", "P", "Q"].map(n => pt(n)), lab("A", R("A"), { o: "bl" }), lab("B", R("B"), { o: "al" }), lab("P", R("P"), { o: "br" }), lab("Q", R("Q"), { o: "br" })] };
  };
  // 점 몇 개 + 선분 (문제·보기용)
  F.pts = (list, segs = [], o = {}) => {
    const P = {}, I = [];
    for (const [n, x, y, z, an] of list) { P[n] = M(x, y, z); I.push(pt(n, { c: o.c }), lab(n, R(`${n}(${x},\\,${y},\\,${z})`.replace(/-/g, "-")), { o: an || "a", sz: 1.25 })); }
    for (const [p, q, c] of segs) I.push(seg(p, q, { c: c || "b", w: 0.08 }));
    const r = o.ax || [5, 6, 6, -3, -4, -3];
    return { P, size: o.size || 20, I: [...axes(...r), ...I, ...(o.extra || [])] };
  };
  F.ex1 = () => { const f = F.pts([["A", 1, -3, 4, "a"], ["B", -2, 1, 3, "a"]], [], { ax: [4, 3, 5, -3, -4, -1] });
    f.P.P = M(2, 0, 0); f.I.push(pt("P", { c: "g", p: 1 }), lab("P", R("P(2,\\,0,\\,0)"), { o: "b", p: 1, c: "g" }), seg("A", "P", { c: "m", p: 1 }), seg("B", "P", { c: "m", p: 1 }),
      seg("A", M(1, -3, 0), { dash: true, w: 0.04 }), seg("B", M(-2, 1, 0), { dash: true, w: 0.04 })); return f; };
  F.mirror = () => { const f = F.pts([["A", 1, 4, 5, "a"], ["B", -1, 2, 3, "a"]], [], { ax: [3, 6, 6, -2, -1, -4] });
    f.I.push(plane([M(-2, -1, 0), M(3, -1, 0), M(3, 5, 0), M(-2, 5, 0)], { c: "y", op: 0.2 })); return f; };
  // 내분점: xy 평면 위로의 정사영
  F.section = () => {
    const P = { A: [2, 2, 2], P: [4, 3, 3], B: [6, 4, 4], A1: [2, 0, 2], P1: [4, 0, 3], B1: [6, 0, 4] };
    return { P, size: 20, I: [arrow([0, 0, 0], [0, 0, 5], { w: 0.06 }), arrow([0, 0, 0], [7, 0, 0], { w: 0.06 }), arrow([0, 0, 0], [0, 4.5, 0], { w: 0.06 }),
      lab([0, 0, 5.5], "$x$", {}), lab([7.5, 0, 0], "$y$", {}), lab([0, 5, 0], "$z$", {}), lab([0, 0, 0], R("O"), { o: "al" }),
      plane([[0, 0, 0], [7, 0, 0], [7, 0, 5], [0, 0, 5]], { c: "y", op: 0.14 }),
      seg("A", "B", { c: "r", w: 0.1 }), seg("A1", "B1", { c: "m", w: 0.09, p: 1 }),
      seg("A", "A1", { dash: true, w: 0.04, p: 1 }), seg("P", "P1", { dash: true, w: 0.04, p: 1 }), seg("B", "B1", { dash: true, w: 0.04, p: 1 }),
      ...["A", "P", "B"].map(n => pt(n)), ...["A1", "P1", "B1"].map(n => pt(n, { c: "m", p: 1 })),
      lab("A", R("A"), { o: "l" }), lab("P", R("P"), { o: "a" }), lab("B", R("B"), { o: "r" }),
      lab("A1", "$\\rm A'$", { o: "bl", p: 1 }), lab("P1", "$\\rm P'$", { o: "b", p: 1 }), lab("B1", "$\\rm B'$", { o: "b", p: 1 }),
      lab(mid(P.A, P.P), "$m$", { o: "al", c: "g" }), lab(mid(P.P, P.B), "$n$", { o: "al", c: "g" })] };
  };
  F.lineDiv = () => { const f = F.pts([["A", 1, 2, -3, "l"], ["B", -2, 5, 3, "a"]], [["A", "B", "r"]], { ax: [4, 7, 4, -3, -2, -10], size: 22 });
    f.P.P = M(0, 3, -1); f.P.Q = M(4, -1, -9);
    f.I.push(pt("P", { c: "g" }), lab("P", R("P(0,\\,3,\\,-1)"), { o: "r", c: "g" }), seg("A", "Q", { c: "m", dash: true, p: 1 }), pt("Q", { c: "m", p: 1 }), lab("Q", R("Q(4,\\,-1,\\,-9)"), { o: "r", c: "m", p: 1 })); return f; };
  // 무게중심
  F.centroid = () => { const P = { A: [5, 3, 0], B: [0, 5, 3], C: [4, 0, 3] }; P.M = mid(P.B, P.C); P.G = add(P.M, mul(sub(P.A, P.M), 1 / 3));
    return { P, size: 20, I: [arrow([0, 0, 0], [0, 0, 4], { w: 0.06 }), arrow([0, 0, 0], [6.5, 0, 0], { w: 0.06 }), arrow([0, 0, 0], [0, 6, 0], { w: 0.06 }),
      lab([0, 0, 4.5], "$x$", {}), lab([7, 0, 0], "$y$", {}), lab([0, 6.5, 0], "$z$", {}), lab([0, 0, 0], R("O"), { o: "al" }),
      face(["A", "B", "C"], { c: "b", op: 0.2 }), seg("A", "B", { w: 0.07 }), seg("B", "C", { w: 0.07 }), seg("C", "A", { w: 0.07 }), seg("A", "M", { c: "m" }), tick("B", "M"), tick("M", "C"),
      ...["A", "B", "C", "M"].map(n => pt(n)), pt("G", { c: "g" }),
      lab("A", R("A"), { o: "a" }), lab("B", R("B"), { o: "al" }), lab("C", R("C"), { o: "b" }), lab("M", R("M"), { o: "l" }), lab("G", R("G"), { o: "b", c: "g" }),
      lab(mid(P.A, P.G), "$2$", { o: "ar", c: "g", p: 1 }), lab(mid(P.G, P.M), "$1$", { o: "ar", c: "g", p: 1 })] }; };
  F.tetraG = () => { const a = 4, h = Math.sqrt(6) * a / 3, d = Math.sqrt(3) * a / 3, c = x => Math.cos(x * Math.PI / 180), s = x => Math.sin(x * Math.PI / 180);
    const P = { A: [0, h, 0], B: [d * c(180), 0, d * s(180)], C: [d * c(60), 0, d * s(60)], D: [d * c(300), 0, d * s(300)] };
    P.G = mul(add(add(P.A, P.B), add(P.C, P.D)), 0.25);
    return { P, size: 18, I: [face(["A", "B", "C"], { c: "y", op: 0.12 }), face(["A", "C", "D"], { c: "y", op: 0.12 }), ...["AB", "AC", "AD", "BC", "CD", "DB"].map(e => seg(e[0], e[1], { w: 0.075 })),
      ...["A", "B", "C", "D"].map(n => pt(n)), lab("A", R("A"), { o: "a" }), lab("B", R("B"), { o: "l" }), lab("C", R("C"), { o: "b" }), lab("D", R("D"), { o: "r" })] }; };
  // 구
  F.sphere = (part2 = false) => { const Cc = M(3, 4, 3), dir = nrm([0.7, 0.35, 0.62]), P = add(Cc, mul(dir, 2));
    return { P: { C: Cc, P }, size: 20, I: [...axes(5, 7, 6), sph(Cc, 2, { c: "y", op: 0.3 }), circ(Cc, [0, 1, 0], 2, { c: "y" }), seg("C", "P", { c: "m", w: 0.09 }), pt("C"), pt("P", { c: "m" }),
      lab("C", R("C(a,\\,b,\\,c)"), { o: "b" }), lab("P", R("P(x,\\,y,\\,z)"), { o: "ar", c: "m" }), lab(mid(Cc, P), "$r$", { o: "al", c: "g" })] }; };
  F.sphereDia = () => { const A = M(2, 4, -1), B = M(0, -2, 3), C = M(1, 1, 1), r = Math.sqrt(14);
    return { P: { A, B, C }, size: 20, I: [...axes(5, 6, 6, -2, -4, -3), sph(C, r, { c: "y", op: 0.22 }), seg("A", "B", { c: "m", w: 0.09 }), pt("A"), pt("B"), pt("C", { c: "g", p: 1 }),
      lab("A", R("A(2,\\,4,\\,-1)"), { o: "r" }), lab("B", R("B(0,\\,-2,\\,3)"), { o: "l" }), lab("C", R("C(1,\\,1,\\,1)"), { o: "b", c: "g", p: 1 }), seg("A", "C", { c: "g", w: 0.1, p: 1 })] }; };
  F.sphereAt = (x, y, z, r, o = {}) => { const C = M(x, y, z);
    return { P: { C }, size: o.size || 20, I: [...axes(...(o.ax || [Math.max(4, x + r + 1), Math.max(4, y + r + 1), Math.max(4, z + r + 1), Math.min(-2, x - r - 1), Math.min(-2, y - r - 1), Math.min(-2, z - r - 1)])),
      sph(C, r, { c: o.c || "y", op: 0.25 }), circ(C, [0, 1, 0], r, { c: o.c || "y" }), pt("C"), lab("C", R(o.lab || `C(${x},\\,${y},\\,${z})`), { o: "b" }), ...(o.extra || [])] }; };
  F.quad = () => F.sphereAt(1, -2, 2, 2.5, { lab: "\\left(-\\frac A2,\\,-\\frac B2,\\,-\\frac C2\\right)" });
  F.ex3 = () => F.sphereAt(1, -5, 3, 4 * Math.SQRT2, { size: 20, extra: [seg(M(1, -5, 3), M(1, -5, 3 + 4 * Math.SQRT2), { c: "m", w: 0.09, p: 1 }), lab(M(1, -5, 3 + 2.8), "$4\\sqrt2$", { o: "r", c: "m", p: 1 })] });
  // 중단원 마무리
  F.feet = () => { const b = cbox(3, -7, 2); return { P: {}, size: 20, I: [...axes(5, 2, 4, -1, -9, -1), ...b.it, pt(b.V.P), lab(b.V.P, R("P(3,\\,-7,\\,2)"), { o: "a" })] }; };
  F.circA = () => ({ P: { A: M(3, -4, 2) }, size: 20, I: [...axes(5, 4, 4, -4, -6, -1), circ(M(0, 0, 0), [0, 1, 0], 2, { fill: true, c: "b" }), pt("A"), lab("A", R("A(3,\\,-4,\\,2)"), { o: "a" }), lab(M(0, 2.6, 0.4), "$x^2+y^2=4$", { c: "b", sz: 1.2 })] });
  F.tangent = () => { const C = M(-3, 2, 1), Pp = M(2, 1, 3), r = Math.sqrt(14), d = sub(Pp, C), L = len(d), u = nrm(d), v = nrm(cross(u, [0, 1, 0])), cf = r / L, sf = Math.sqrt(1 - cf * cf);
    const Q = add(C, add(mul(u, r * cf), mul(v, r * sf)));
    return { P: { C, P: Pp, Q }, size: 20, I: [...axes(4, 4, 6, -7, -3, -3), sph(C, r, { c: "y", op: 0.22 }), pt("C"), pt("P"), pt("Q", { c: "m" }), seg("P", "Q", { c: "m", w: 0.09 }), seg("C", "Q", { w: 0.06 }), ra("Q", "C", "P"),
      lab("C", R("C"), { o: "b" }), lab("P", R("P(2,\\,1,\\,3)"), { o: "r" }), lab("Q", R("Q"), { o: "a", c: "m" })] }; };
  F.sphereMin = () => F.sphereAt(2, -10, 2, 6, { extra: [seg(M(0, 0, 0), M(2, -10, 2), { c: "m", w: 0.08, dash: true })] });
  F.segCD = () => ({ P: { A: M(4, 0, 0), B: M(0, 2, 0), D: M(0, 0, 6) }, size: 18, I: [...axes(6, 4, 8), seg("A", "B", { c: "b", w: 0.1 }), pt("A"), pt("B"), pt("D"),
    lab("A", R("A(4,\\,0,\\,0)"), { o: "bl" }), lab("B", R("B(0,\\,2,\\,0)"), { o: "br" }), lab("D", R("D(0,\\,0,\\,6)"), { o: "r" })] });
  F.shadow = () => { const Pp = M(0, 0, 20), C = M(0, 0, 8), rs = 20 * Math.tan(Math.PI / 6);
    return { P: { P: Pp, C }, size: 22, I: [...axes(8, 14, 22, 0, 0, 0), sph(C, 6, { c: "b", op: 0.3 }), circ(M(0, 0, 0), [0, 1, 0], rs, { fill: true, c: "#8890b0" }), pt("P", { c: "g" }),
      seg("P", M(0, rs, 0), { c: "y", w: 0.06 }), seg("P", M(0, -rs, 0), { c: "y", w: 0.06 }), seg("P", M(rs, 0, 0), { c: "y", w: 0.06 }), lab("P", R("P(0,\\,0,\\,20)"), { o: "l" })] }; };
  F.sphereS = () => { const c = Math.sqrt(80); return F.sphereAt(8, 8, c, 12, { lab: "S", ax: [22, 22, 22, -6, -6, -6], size: 22 }); };
  F.paraD = () => F.pts([["A", 2, 3, 0, "a"], ["B", 4, 1, -2, "r"], ["C", -4, 1, 2, "l"]], [["A", "B"], ["B", "C"]], { ax: [5, 5, 4, -5, -2, -3] });

  root.FIGS = F;
})(typeof window !== "undefined" ? window : globalThis);
