const QUESTIONS = [
"社交的な雰囲気にひかれて、人の中に入っていくのが好きな方だ",
"強い心の中から巻き起こる感覚を引き起こすものを重視するほうだ",
"まわりの出来事を理論よりも感覚でとらえるほうだ",
"親しい気の合った人とだけ議論しようとする方だ",
"自分独自の価値基準をもとうとする方だ",
"事実を尊重し、ものごとをとことんまで考えようとするほうだ",
"ものごとそのものよりも、その可能性に注目する方だ",
"自分の中に沈みこみ、ある種の予感を大切にするほうだ",
"感受性が強く、自分の世界に耽溺するほうだ",
"好き嫌いがはげしく、気の合った少数の人としか付き合わないほうだ",
"未来を自分の内にひらめくカンに頼って切り開いていくほうだ",
"大事な決定をするときは、周囲の状況を論理的に分析してきめるほうだ",
"自分の判断が、まわりの人の判断とよく一致するほうだ",
"ものごとを理屈ではなく、直観によって見きわめようとするほうだ",
"まわりのできごとよりも、人間について理解を深めようとするほうだ",
"生活を楽しむために、まわりの刺激を求めるほうだ",
"自分の気持ちは心の中にそっととどめておくほうだ",
"理屈よりもカンに頼って、現実の問題を解決するほうだ",
"抽象的な概念や、考え方にひかれるほうだ",
"自分のしていることが、社会的に認められるかどうかが気になるほうだ",
"まわりのできごとよりも、自分の中におこる強い印象に喜びを感じるほうだ",
"感情よりも、論理を先に立てて行動するほうだ",
"まわりにあるものごとに、敏感な方だ",
"心にひらめいたことを、他人に伝えるのがうまくないほうだ",
"自分自身のことよりも、まわりのできごとをよく考えるほうだ",
"難しい状況にであると、理屈よりもカンに頼るほうだ",
"まわりのことは気にしないで、自分なりの見方を大切にするほうだ",
"一般的な判断にもとづいた、常識を重んじるほうだ",
"感受性が強く、まわりの刺激に影響されやすいほうだ",
"自分自身を理屈よりも、感覚でとらえようとするほうだ",
"まわりのできごとよりも、自分の心の中からでてくる可能性を求めるほうだ",
"自分自身を哲学的にいろいろと考えようとするほうだ",
"心の中から湧きあがる強い印象に心奪われるほうだ",
"善・悪や美・醜の判断に、自分独特の考えをもつほうだ",
"心の中にひらめいたもので、自分の将来の夢を追うほうだ",
"行動のあり方が、感覚に訴えるものに左右されやすいほうだ",
"理屈っぽく考えないで、すぐに良いか悪いかをきめるほうだ",
"自分の心の内にひらめくものによって行動するほうだ",
"客観的な事実にもとづいて、論理的に考えようとするほうだ",
"自分自身のことについて、理屈っぽく考えようとするほうだ"
];

const GROUPS = {
"外向的思考 (Te)":[6,12,22,25,39],
"内向的思考 (Ti)":[4,15,19,32,40],
"外向的感情 (Fe)":[1,13,20,28,37],
"内向的感情 (Fi)":[5,10,17,27,34],
"外向的感覚 (Se)":[3,16,23,29,36],
"内向的感覚 (Si)":[2,9,21,30,33],
"外向的直観 (Ne)":[7,14,18,26,38],
"内向的直観 (Ni)":[8,11,24,31,35]
};

const CHOICES=[["はい",2],["まあ",1],["あまり",-1],["いいえ",-2]];
const KEY="jungTypeRecords_v2";

const quiz=document.getElementById("quiz");
const start=document.getElementById("start");
const teacher=document.getElementById("teacher");
const result=document.getElementById("result");

QUESTIONS.forEach((q,i)=>{
  const n=i+1;
  const div=document.createElement("div");
  div.className="question";
  div.innerHTML=`<div class="question-text"><span class="question-num">${n}.</span> ${escapeHtml(q)}</div>`;
  const opts=document.createElement("div");
  opts.className="options";
  CHOICES.forEach(([label,value])=>{
    const id=`q${n}_${value}`;
    const lab=document.createElement("label");
    lab.className="option";
    lab.htmlFor=id;
    lab.innerHTML=`<input id="${id}" type="radio" name="q${n}" value="${value}"> ${label}`;
    opts.appendChild(lab);
  });
  div.appendChild(opts);
  quiz.appendChild(div);
});
const submit=document.createElement("div");
submit.className="submit";
submit.innerHTML=`<button type="submit">診断結果を見る</button>`;
quiz.appendChild(submit);

document.getElementById("begin").addEventListener("click",()=>{
  const no=document.getElementById("studentNo").value.trim();
  if(!no){alert("学生番号を入力してください。");return;}
  start.classList.add("hidden");
  quiz.classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
});

quiz.addEventListener("submit",(e)=>{
  e.preventDefault();
  const missing=[];
  for(let i=1;i<=40;i++) if(!document.querySelector(`input[name="q${i}"]:checked`)) missing.push(i);
  if(missing.length){
    alert(`未回答があります（${missing.join(", ")}番）。すべて回答してください。`);
    document.querySelector(`input[name="q${missing[0]}"]`).closest(".question").scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }

  const scores={};
  for(const [group,items] of Object.entries(GROUPS)){
    scores[group]=items.reduce((sum,n)=>sum+Number(document.querySelector(`input[name="q${n}"]:checked`).value),0);
  }
  const sorted=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const record={
    timestamp:new Date().toLocaleString("ja-JP"),
    studentNo:document.getElementById("studentNo").value.trim(),
    name:document.getElementById("studentName").value.trim(),
    type:sorted[0][0],
    scores
  };

  const saved=loadRecords();
  saved.push(record);
  localStorage.setItem(KEY,JSON.stringify(saved));

  showResult(record,sorted);
  quiz.classList.add("hidden");
  teacher.classList.remove("hidden");
  renderRecords();
  window.scrollTo({top:0,behavior:"smooth"});
});

function showResult(record,sorted){
  result.innerHTML=`<div class="panel">
    <h2>診断結果</h2>
    <div class="type-box">${escapeHtml(record.type)}</div>
    <p class="small">8つの心理機能のうち、最も得点が高かった機能を表示しています。</p>
    ${sorted.map(([name,score])=>{
      const pct=Math.max(0,Math.min(100,(score+10)/20*100));
      return `<div class="score"><div>${escapeHtml(name)}</div><div class="barbg"><div class="bar" style="width:${pct}%"></div></div><strong>${score>0?"+":""}${score}</strong></div>`;
    }).join("")}
  </div>`;
  result.classList.remove("hidden");
}

function loadRecords(){
  try{return JSON.parse(localStorage.getItem(KEY)||"[]");}
  catch(e){return[];}
}

function renderRecords(){
  const saved=loadRecords();
  const box=document.getElementById("records");
  if(!saved.length){box.innerHTML="<p>まだ回答データはありません。</p>";return;}
  const groups=Object.keys(GROUPS);
  box.innerHTML=`<div class="table-wrap"><table>
  <thead><tr><th>日時</th><th>学生番号</th><th>氏名</th><th>判定</th>${groups.map(g=>`<th>${escapeHtml(g)}</th>`).join("")}</tr></thead>
  <tbody>${saved.map(r=>`<tr><td>${escapeHtml(r.timestamp)}</td><td>${escapeHtml(r.studentNo)}</td><td>${escapeHtml(r.name||"")}</td><td>${escapeHtml(r.type)}</td>${groups.map(g=>`<td>${r.scores[g]}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

document.getElementById("csv").addEventListener("click",()=>{
  const saved=loadRecords();
  if(!saved.length){alert("保存された回答データがありません。");return;}
  const groups=Object.keys(GROUPS);
  const rows=[
    ["日時","学生番号","氏名","判定",...groups],
    ...saved.map(r=>[r.timestamp,r.studentNo,r.name||"",r.type,...groups.map(g=>r.scores[g])])
  ];
  const csv="\\uFEFF"+rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\\r\\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="jung_type_results.csv";a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("clear").addEventListener("click",()=>{
  if(confirm("このブラウザに保存された回答データをすべて削除します。よろしいですか？")){
    localStorage.removeItem(KEY);renderRecords();
  }
});

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

renderRecords();
