import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { getTextbooks, type Textbook, type Task } from "@/data/textbooks";

// ─── API URLs ───────────────────────────────────────────────────────────────
const API = {
  reviews:     "https://functions.poehali.dev/f1eaedec-3583-4551-b803-18c3b482aab0",
  chat:        "https://functions.poehali.dev/b4e8a360-b49c-421f-a765-dd8008a82d01",
  support:     "https://functions.poehali.dev/b4bb00ea-db2c-4541-b7ee-9a6f1aee76bf",
  grades:      "https://functions.poehali.dev/7ff24f61-7c80-4874-b70e-c2142ee983eb",
  bookReviews: "https://functions.poehali.dev/f68edadf-44bc-421c-ac34-5dce02c7b0eb",
};

const CLASSES = [1,2,3,4,5,6,7,8,9,10,11];
const CLASS_GROUPS = [
  { label:"Началка", range:[1,2,3,4], color:"#22c55e" },
  { label:"Средняя", range:[5,6,7,8,9], color:"#0ea5e9" },
  { label:"Старшая", range:[10,11], color:"#7c3aed" },
];
const SUBJECTS_BY_CLASS: Record<number,{name:string;emoji:string;color:string;desc:string}[]> = {
  1:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Счёт, цифры, задачи"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Буквы, слова, письмо"},{name:"Окружающий мир",emoji:"🌍",color:"#22c55e",desc:"Природа и общество"},{name:"Чтение",emoji:"📖",color:"#f97316",desc:"Тексты и рассказы"},{name:"Изо",emoji:"🎨",color:"#ec4899",desc:"Рисование и творчество"},{name:"Музыка",emoji:"🎵",color:"#eab308",desc:"Ноты и пение"}],
  2:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Сложение и вычитание"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Правила и диктанты"},{name:"Окружающий мир",emoji:"🌍",color:"#22c55e",desc:"Природа и общество"},{name:"Литературное чтение",emoji:"📖",color:"#f97316",desc:"Стихи и рассказы"},{name:"Английский",emoji:"🇬🇧",color:"#ec4899",desc:"Первые слова"},{name:"Изо",emoji:"🎨",color:"#14b8a6",desc:"Рисование"}],
  3:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Умножение и деление"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Правила орфографии"},{name:"Окружающий мир",emoji:"🌍",color:"#22c55e",desc:"Природа и история"},{name:"Литературное чтение",emoji:"📖",color:"#f97316",desc:"Произведения классиков"},{name:"Английский",emoji:"🇬🇧",color:"#ec4899",desc:"Диалоги и тексты"},{name:"Изо",emoji:"🎨",color:"#14b8a6",desc:"Творческие задания"}],
  4:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Дроби и задачи"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Синтаксис и морфология"},{name:"Окружающий мир",emoji:"🌍",color:"#22c55e",desc:"История России"},{name:"Литературное чтение",emoji:"📖",color:"#f97316",desc:"Классическая литература"},{name:"Английский",emoji:"🇬🇧",color:"#ec4899",desc:"Грамматика и тексты"},{name:"Технология",emoji:"🔧",color:"#eab308",desc:"Поделки и проекты"}],
  5:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Алгебра и геометрия"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Морфология и синтаксис"},{name:"Литература",emoji:"📖",color:"#f97316",desc:"Русская и зарубежная"},{name:"История",emoji:"🏛️",color:"#ef4444",desc:"Древний мир"},{name:"Английский",emoji:"🇬🇧",color:"#ec4899",desc:"Грамматика и письмо"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"Живая природа"},{name:"География",emoji:"🗺️",color:"#14b8a6",desc:"Планета Земля"},{name:"Изо",emoji:"🎨",color:"#eab308",desc:"Искусство и творчество"}],
  6:[{name:"Математика",emoji:"➕",color:"#7c3aed",desc:"Алгебра и геометрия"},{name:"Русский язык",emoji:"📝",color:"#0ea5e9",desc:"Правописание и стиль"},{name:"Литература",emoji:"📖",color:"#f97316",desc:"Анализ произведений"},{name:"История",emoji:"🏛️",color:"#ef4444",desc:"Средние века"},{name:"Английский",emoji:"🇬🇧",color:"#ec4899",desc:"Тексты и диалоги"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"Растения и животные"},{name:"География",emoji:"🗺️",color:"#14b8a6",desc:"Материки и океаны"},{name:"Обществознание",emoji:"👥",color:"#eab308",desc:"Общество и человек"}],
  7:[{name:"Алгебра",emoji:"📐",color:"#7c3aed",desc:"Уравнения и функции"},{name:"Геометрия",emoji:"📏",color:"#0ea5e9",desc:"Фигуры и теоремы"},{name:"Русский язык",emoji:"📝",color:"#ec4899",desc:"Сложные предложения"},{name:"Литература",emoji:"📖",color:"#f97316",desc:"Классика и анализ"},{name:"История",emoji:"🏛️",color:"#ef4444",desc:"Новое время"},{name:"Физика",emoji:"⚡",color:"#eab308",desc:"Механика и силы"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"Человек и природа"},{name:"Английский",emoji:"🇬🇧",color:"#14b8a6",desc:"Сложные темы"}],
  8:[{name:"Алгебра",emoji:"📐",color:"#7c3aed",desc:"Квадратные уравнения"},{name:"Геометрия",emoji:"📏",color:"#0ea5e9",desc:"Теоремы и задачи"},{name:"Русский язык",emoji:"📝",color:"#ec4899",desc:"ОГЭ подготовка"},{name:"Физика",emoji:"⚡",color:"#eab308",desc:"Электричество"},{name:"Химия",emoji:"🧪",color:"#ef4444",desc:"Реакции и вещества"},{name:"История",emoji:"🏛️",color:"#f97316",desc:"Россия в XIX веке"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"Человек и здоровье"},{name:"Обществознание",emoji:"👥",color:"#14b8a6",desc:"Право и экономика"}],
  9:[{name:"Алгебра",emoji:"📐",color:"#7c3aed",desc:"ОГЭ: функции"},{name:"Геометрия",emoji:"📏",color:"#0ea5e9",desc:"ОГЭ: стереометрия"},{name:"Русский язык",emoji:"📝",color:"#ec4899",desc:"ОГЭ подготовка"},{name:"Физика",emoji:"⚡",color:"#eab308",desc:"Оптика и термодинамика"},{name:"Химия",emoji:"🧪",color:"#ef4444",desc:"Органическая химия"},{name:"История",emoji:"🏛️",color:"#f97316",desc:"XX век"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"Генетика и эволюция"},{name:"Информатика",emoji:"💻",color:"#14b8a6",desc:"Алгоритмы и программы"}],
  10:[{name:"Математика",emoji:"📐",color:"#7c3aed",desc:"ЕГЭ: профиль и база"},{name:"Физика",emoji:"⚡",color:"#eab308",desc:"ЕГЭ: механика"},{name:"Химия",emoji:"🧪",color:"#ef4444",desc:"ЕГЭ: теория"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"ЕГЭ: цитология"},{name:"История",emoji:"🏛️",color:"#f97316",desc:"ЕГЭ: Россия и мир"},{name:"Обществознание",emoji:"👥",color:"#14b8a6",desc:"ЕГЭ: право и соц"},{name:"Русский язык",emoji:"📝",color:"#ec4899",desc:"ЕГЭ: сочинение"},{name:"Информатика",emoji:"💻",color:"#0ea5e9",desc:"Программирование"},{name:"Английский",emoji:"🇬🇧",color:"#7c3aed",desc:"ЕГЭ: все разделы"}],
  11:[{name:"Математика",emoji:"📐",color:"#7c3aed",desc:"ЕГЭ: профильный уровень"},{name:"Физика",emoji:"⚡",color:"#eab308",desc:"ЕГЭ: квантовая физика"},{name:"Химия",emoji:"🧪",color:"#ef4444",desc:"ЕГЭ: органика"},{name:"Биология",emoji:"🌱",color:"#22c55e",desc:"ЕГЭ: эволюция"},{name:"История",emoji:"🏛️",color:"#f97316",desc:"ЕГЭ: полный курс"},{name:"Обществознание",emoji:"👥",color:"#14b8a6",desc:"ЕГЭ: экономика"},{name:"Русский язык",emoji:"📝",color:"#ec4899",desc:"ЕГЭ: итоговое"},{name:"Информатика",emoji:"💻",color:"#0ea5e9",desc:"ЕГЭ: алгоритмы"},{name:"Литература",emoji:"📖",color:"#f97316",desc:"ЕГЭ: сочинение"},{name:"Английский",emoji:"🇬🇧",color:"#7c3aed",desc:"ЕГЭ: устная часть"}],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGroupColor(cls:number){ for(const g of CLASS_GROUPS){if(g.range.includes(cls))return g.color;} return "#7c3aed"; }
function sessionId(){ let s=localStorage.getItem("gdz_sid"); if(!s){s=Math.random().toString(36).slice(2);localStorage.setItem("gdz_sid",s);} return s; }

// ─── Star rating ─────────────────────────────────────────────────────────────
function Stars({value,onChange}:{value:number;onChange?:(v:number)=>void}){
  const[hov,setHov]=useState(0);
  return(
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <button key={s} type="button" onClick={()=>onChange&&onChange(s)}
          onMouseEnter={()=>onChange&&setHov(s)} onMouseLeave={()=>onChange&&setHov(0)}
          className="text-xl transition-transform hover:scale-110" style={{cursor:onChange?"pointer":"default"}}>
          <span style={{color:s<=(hov||value)?"#eab308":"#d1d5db"}}>★</span>
        </button>
      ))}
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({onClose,children,title}:{onClose:()=>void;children:React.ReactNode;title?:string}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl animate-fade-in-scale bg-white"
        style={{boxShadow:"0 24px 80px rgba(0,0,0,0.25)"}}>
        {title&&(
          <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b rounded-t-3xl z-10">
            <h2 className="font-black text-lg" style={{fontFamily:"'Unbounded',sans-serif"}}>{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Icon name="X" size={16}/>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface ReviewItem { id:number; author_name:string; rating:number; comment:string; created_at:string; }
interface ChatMsg { id:number; author_name:string; message:string; is_admin:boolean; created_at:string; }

// ─── Reviews modal ────────────────────────────────────────────────────────────
function ReviewsModal({onClose}:{onClose:()=>void}){
  const[reviews,setReviews]=useState<ReviewItem[]>([]);
  const[loading,setLoading]=useState(true);
  const[form,setForm]=useState({author_name:"",rating:5,comment:""});
  const[err,setErr]=useState("");
  const[ok,setOk]=useState(false);
  const[sub,setSub]=useState(false);

  useEffect(()=>{ fetch(API.reviews).then(r=>r.json()).then(d=>setReviews(d.reviews||[])).finally(()=>setLoading(false)); },[]);

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    if(!form.comment.trim()){setErr("Напишите комментарий");return;}
    setSub(true);
    const res=await fetch(API.reviews,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d=await res.json(); setSub(false);
    if(!res.ok||d.error){setErr(d.error||"Ошибка");}
    else{setOk(true);setReviews([d.review,...reviews]);setForm({author_name:"",rating:5,comment:""});setTimeout(()=>setOk(false),3000);}
  };

  const avg=reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):null;

  return(
    <Modal onClose={onClose} title="Отзывы о сайте">
      {avg&&<div className="flex items-center gap-2 px-5 pb-3"><span className="text-yellow-400">★</span><span className="font-bold">{avg}</span><span className="text-xs text-muted-foreground">({reviews.length} отзывов)</span></div>}
      <form onSubmit={submit} className="px-5 pb-4 border-b">
        <p className="font-bold text-sm mb-3">Оставить отзыв</p>
        <input type="text" placeholder="Ваше имя (необязательно)" value={form.author_name} onChange={e=>setForm({...form,author_name:e.target.value})} maxLength={100} className="w-full rounded-xl border px-3 py-2 text-sm mb-2 outline-none focus:border-purple-400"/>
        <div className="mb-2"><p className="text-xs text-muted-foreground mb-1">Оценка</p><Stars value={form.rating} onChange={v=>setForm({...form,rating:v})}/></div>
        <textarea placeholder="Ваш комментарий..." value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} maxLength={1000} rows={3} className="w-full rounded-xl border px-3 py-2 text-sm mb-2 outline-none focus:border-purple-400 resize-none"/>
        {err&&<p className="text-red-500 text-xs mb-2 font-medium">{err}</p>}
        {ok&&<p className="text-green-600 text-xs mb-2 font-medium">Отзыв опубликован!</p>}
        <button type="submit" disabled={sub} className="w-full py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)",opacity:sub?0.7:1}}>{sub?"Отправляю...":"Опубликовать"}</button>
      </form>
      <div className="p-5">
        {loading?<p className="text-center text-sm text-muted-foreground py-6">Загрузка...</p>:
         reviews.length===0?<div className="text-center py-8"><p className="text-4xl mb-2">💬</p><p className="text-muted-foreground text-sm">Пока нет отзывов. Будь первым!</p></div>:
         <div className="flex flex-col gap-3">
           {reviews.map(r=>(
             <div key={r.id} className="rounded-2xl p-4 bg-gray-50 border border-gray-100">
               <div className="flex items-start justify-between gap-2 mb-1">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{background:`hsl(${(r.author_name||"А").charCodeAt(0)*37%360},65%,55%)`}}>{(r.author_name||"А")[0].toUpperCase()}</div>
                   <span className="font-bold text-sm">{r.author_name||"Аноним"}</span>
                 </div>
                 <Stars value={r.rating}/>
               </div>
               <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
               <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"})}</p>
             </div>
           ))}
         </div>}
      </div>
    </Modal>
  );
}

// ─── Support modal ────────────────────────────────────────────────────────────
function SupportModal({onClose}:{onClose:()=>void}){
  const[form,setForm]=useState({author_name:"",contact:"",message:""});
  const[err,setErr]=useState("");
  const[ok,setOk]=useState(false);
  const[sub,setSub]=useState(false);

  const aiReply=(msg:string)=>{
    const lower=msg.toLowerCase();
    if(lower.includes("не работает")||lower.includes("ошибка"))return"Спасибо за сообщение! Наши специалисты уже смотрят на проблему. Обычно исправляем в течение 24 часов.";
    if(lower.includes("учебник")||lower.includes("задача"))return"Мы постоянно пополняем базу решений. Ваш запрос добавлен в список приоритетов!";
    if(lower.includes("спасибо")||lower.includes("отлично"))return"Спасибо за добрые слова! 🌟 Мы стараемся для вас.";
    return"Спасибо за обращение! Ваше сообщение получено. Мы ответим в ближайшее время — следите за нашим Telegram-каналом @otlichnik_gdz11.";
  };

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    if(!form.message.trim()){setErr("Напишите сообщение");return;}
    setSub(true);
    await fetch(API.support,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setSub(false); setOk(true); setForm({author_name:"",contact:"",message:""});
  };

  return(
    <Modal onClose={onClose} title="📩 Связь с нами">
      <div className="p-5">
        {!ok?(
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Напишите нам — администратор или ИИ-помощник ответит вам</p>
            <input type="text" placeholder="Ваше имя" value={form.author_name} onChange={e=>setForm({...form,author_name:e.target.value})} maxLength={100} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400"/>
            <input type="text" placeholder="Telegram / email (необязательно)" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} maxLength={200} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400"/>
            <textarea placeholder="Ваш вопрос или предложение..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={4} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"/>
            {err&&<p className="text-red-500 text-xs font-medium">{err}</p>}
            <button type="submit" disabled={sub} className="py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)",opacity:sub?0.7:1}}>{sub?"Отправляю...":"Отправить"}</button>
          </form>
        ):(
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4 bg-green-50 border border-green-200">
              <p className="text-sm font-bold text-green-700 mb-1">✅ Сообщение отправлено!</p>
            </div>
            <div className="rounded-2xl p-4 bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">ИИ</div>
                <span className="font-bold text-sm text-purple-700">ИИ-помощник Отличника</span>
              </div>
              <p className="text-sm text-gray-700">{aiReply(form.message||"спасибо")}</p>
            </div>
            <button onClick={onClose} className="py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}>Закрыть</button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── AI Assistant modal ───────────────────────────────────────────────────────
function AiModal({onClose,title,persona}:{onClose:()=>void;title:string;persona:string}){
  const[msgs,setMsgs]=useState<{from:"user"|"ai";text:string}[]>([
    {from:"ai",text:persona}
  ]);
  const[input,setInput]=useState("");
  const endRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const aiAnswer=(q:string)=>{
    const lower=q.toLowerCase();
    if(title.includes("Сочинитель")){
      if(lower.includes("сочинени")||lower.includes("напиши"))return`Конечно! Вот план сочинения:\n1. Введение — вступительный тезис\n2. Основная часть — 2-3 аргумента с примерами\n3. Заключение — вывод и своё мнение\n\nУточни тему, и я помогу составить полный текст!`;
      if(lower.includes("изложени"))return"Для изложения: 1) Прочитай текст 2-3 раза; 2) Запиши ключевые мысли каждого абзаца; 3) Перескажи своими словами, сохранив стиль автора. Какой текст нужно изложить?";
      if(lower.includes("пересказ"))return"Для пересказа определи: кто действует, что происходит, чем заканчивается. Потом расскажи кратко, сохранив главное. Напиши текст — помогу!";
      return"Привет! Я помогу с сочинением, изложением, пересказом или развёрнутым ответом. Напиши тему или вставь текст!";
    }
    if(lower.includes("помог")||lower.includes("привет"))return"Привет! Я рад помочь. Задай любой вопрос по школьным предметам 📚";
    if(lower.includes("математик")||lower.includes("задач"))return"Для решения задачи: 1) Запиши условие; 2) Определи формулу; 3) Подставь значения; 4) Вычисли ответ. Напиши условие задачи!";
    if(lower.includes("русск")||lower.includes("правил"))return"По русскому языку — спрашивай правила, правописание, разборы слов. Что именно нужно?";
    if(lower.includes("физик")||lower.includes("хими"))return"Для физики и химии важно знать формулы и единицы измерения. Напиши конкретный вопрос!";
    if(lower.includes("истори"))return"По истории помогу с датами, событиями, персоналиями. Какой период тебя интересует?";
    if(lower.includes("биолог"))return"По биологии — строение организмов, процессы жизнедеятельности, классификация. Задавай!";
    if(lower.includes("спасибо"))return"Всегда пожалуйста! 😊 Если понадоблюсь — пиши!";
    return`Хороший вопрос! Для более точного ответа уточни: о каком предмете и классе идёт речь? Я готов помочь!`;
  };

  const send=()=>{
    if(!input.trim())return;
    const userMsg=input.trim();
    setInput("");
    setMsgs(prev=>[...prev,{from:"user",text:userMsg}]);
    setTimeout(()=>{
      setMsgs(prev=>[...prev,{from:"ai",text:aiAnswer(userMsg)}]);
    },600);
  };

  return(
    <Modal onClose={onClose} title={title}>
      <div className="flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {msgs.map((m,i)=>(
            <div key={i} className={`flex gap-2 ${m.from==="user"?"justify-end":""}`}>
              {m.from==="ai"&&<div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">ИИ</div>}
              <div className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] leading-relaxed whitespace-pre-line ${m.from==="ai"?"bg-purple-50 border border-purple-100 text-gray-800":"bg-purple-600 text-white"}`}>{m.text}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div className="p-4 border-t flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Напиши вопрос..." className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400"/>
          <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}>
            <Icon name="Send" size={16}/>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Chat modal ───────────────────────────────────────────────────────────────
function ChatModal({onClose}:{onClose:()=>void}){
  const[msgs,setMsgs]=useState<ChatMsg[]>([]);
  const[input,setInput]=useState("");
  const[name,setName]=useState(()=>localStorage.getItem("gdz_name")||"");
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(true);
  const endRef=useRef<HTMLDivElement>(null);

  const load=()=>{fetch(API.chat).then(r=>r.json()).then(d=>setMsgs(d.messages||[])).finally(()=>setLoading(false));};
  useEffect(()=>{load();const t=setInterval(load,5000);return()=>clearInterval(t);},[]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=async()=>{
    if(!input.trim())return;
    setErr("");
    const res=await fetch(API.chat,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({author_name:name||"Аноним",message:input.trim()})});
    const d=await res.json();
    if(!res.ok||d.error){setErr(d.error||"Ошибка");}
    else{setMsgs(prev=>[...prev,d.message]);setInput("");if(name)localStorage.setItem("gdz_name",name);}
  };

  return(
    <Modal onClose={onClose} title="💬 Общий чат">
      <div className="px-4 pb-2 text-xs text-muted-foreground flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
        Онлайн-чат • Администратор следит за порядком
      </div>
      <div className="flex flex-col" style={{height:"55vh"}}>
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-2">
          {loading?<p className="text-center text-sm text-muted-foreground py-6">Загрузка...</p>:
           msgs.length===0?<p className="text-center text-sm text-muted-foreground py-6">Чат пуст. Начни общение!</p>:
           msgs.map((m,i)=>(
             <div key={i} className={`flex gap-2 ${m.is_admin?"":"" }`}>
               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${m.is_admin?"bg-purple-600":"bg-gray-400"}`} style={!m.is_admin?{background:`hsl(${(m.author_name||"А").charCodeAt(0)*37%360},55%,50%)`}:{}}>{m.is_admin?"А":(m.author_name||"?")[0].toUpperCase()}</div>
               <div>
                 <div className="flex items-baseline gap-2">
                   <span className={`text-xs font-bold ${m.is_admin?"text-purple-600":""}`}>{m.is_admin?"Администратор":m.author_name||"Аноним"}</span>
                   <span className="text-[10px] text-muted-foreground">{new Date(m.created_at).toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}</span>
                 </div>
                 <div className={`rounded-2xl rounded-tl-none px-3 py-2 text-sm mt-0.5 ${m.is_admin?"bg-purple-50 border border-purple-100":"bg-gray-100"}`}>{m.message}</div>
               </div>
             </div>
           ))}
          <div ref={endRef}/>
        </div>
        <div className="p-4 border-t flex flex-col gap-2">
          <div className="flex gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ваше имя" className="w-28 rounded-xl border px-2 py-2 text-xs outline-none focus:border-purple-400"/>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Сообщение..." className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400"/>
            <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}><Icon name="Send" size={16}/></button>
          </div>
          {err&&<p className="text-red-500 text-xs font-medium">{err}</p>}
          <p className="text-[10px] text-muted-foreground">Запрещены: маты, фото, видео, голосовые. Разрешены стикеры 🐱</p>
        </div>
      </div>
    </Modal>
  );
}

// ─── Grades modal ─────────────────────────────────────────────────────────────
function GradesModal({onClose}:{onClose:()=>void}){
  const[stats,setStats]=useState<Record<string,number>>({});
  const[total,setTotal]=useState(0);
  const[voted,setVoted]=useState(()=>!!localStorage.getItem("gdz_voted"));
  const[loading,setLoading]=useState(true);

  useEffect(()=>{fetch(API.grades).then(r=>r.json()).then(d=>{setStats(d.stats||{});setTotal(d.total||0);}).finally(()=>setLoading(false));},[]);

  const vote=async(g:string)=>{
    if(voted)return;
    await fetch(API.grades,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:sessionId(),grade:g})});
    localStorage.setItem("gdz_voted","1");
    setVoted(true);
    setStats(prev=>({...prev,[g]:(prev[g]||0)+1}));
    setTotal(prev=>prev+1);
  };

  const GRADES=[
    {g:"5",color:"#22c55e",emoji:"🏆",label:"Отлично"},
    {g:"4",color:"#0ea5e9",emoji:"😊",label:"Хорошо"},
    {g:"3",color:"#eab308",emoji:"😐",label:"Нормально"},
    {g:"2",color:"#f97316",emoji:"😟",label:"Плохо"},
    {g:"1",color:"#ef4444",emoji:"😱",label:"Ужасно"},
  ];

  return(
    <Modal onClose={onClose} title="🏆 Рейтинг оценок">
      <div className="p-5">
        <p className="text-sm text-muted-foreground mb-4">Какие оценки ты получал за последний год с помощью ГДЗ?</p>
        {loading?<p className="text-center py-6 text-muted-foreground text-sm">Загрузка...</p>:(
          <div className="flex flex-col gap-3">
            {GRADES.map(({g,color,emoji,label})=>{
              const cnt=stats[g]||0;
              const pct=total>0?Math.round(cnt/total*100):0;
              return(
                <button key={g} onClick={()=>vote(g)} disabled={voted}
                  className="flex items-center gap-3 rounded-2xl p-3 border-2 transition-all hover:scale-[1.01]"
                  style={{borderColor:voted?color+"30":color+"50",background:voted?color+"08":"white",cursor:voted?"default":"pointer"}}>
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{label} ({g})</span>
                      <span className="text-sm font-bold" style={{color}}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:color}}/>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cnt} голосов</p>
                  </div>
                </button>
              );
            })}
            <p className="text-center text-sm text-muted-foreground mt-2">Всего проголосовало: {total}</p>
            {voted&&<p className="text-center text-green-600 text-sm font-medium">✅ Вы уже проголосовали!</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Book reviews ─────────────────────────────────────────────────────────────
function BookReviews({bookKey}:{bookKey:string}){
  const[open,setOpen]=useState(false);
  const[reviews,setReviews]=useState<ReviewItem[]>([]);
  const[loading,setLoading]=useState(false);
  const[form,setForm]=useState({author_name:"",rating:5,comment:""});
  const[err,setErr]=useState("");
  const[ok,setOk]=useState(false);

  const load=async()=>{
    setLoading(true);
    const d=await fetch(`${API.bookReviews}?book_key=${encodeURIComponent(bookKey)}`).then(r=>r.json());
    setReviews(d.reviews||[]);setLoading(false);
  };

  const toggle=()=>{if(!open){load();}setOpen(!open);};

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setErr("");
    if(!form.comment.trim()){setErr("Напишите комментарий");return;}
    const res=await fetch(API.bookReviews,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,book_key:bookKey})});
    const d=await res.json();
    if(!res.ok||d.error){setErr(d.error||"Ошибка");}
    else{setOk(true);setReviews([d.review,...reviews]);setForm({author_name:"",rating:5,comment:""});setTimeout(()=>setOk(false),3000);}
  };

  return(
    <div className="mt-4 border-t pt-3">
      <button onClick={toggle} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <Icon name={open?"ChevronUp":"ChevronDown"} size={14}/>
        {open?"Скрыть отзывы":"Отзывы к учебнику"}
      </button>
      {open&&(
        <div className="mt-3">
          <form onSubmit={submit} className="mb-4 flex flex-col gap-2">
            <input type="text" placeholder="Ваше имя" value={form.author_name} onChange={e=>setForm({...form,author_name:e.target.value})} maxLength={100} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400"/>
            <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Оценка:</span><Stars value={form.rating} onChange={v=>setForm({...form,rating:v})}/></div>
            <textarea placeholder="Ваш отзыв об учебнике..." value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})} rows={2} maxLength={500} className="rounded-xl border px-3 py-2 text-sm outline-none focus:border-purple-400 resize-none"/>
            {err&&<p className="text-red-500 text-xs">{err}</p>}
            {ok&&<p className="text-green-600 text-xs">Отзыв добавлен!</p>}
            <button type="submit" className="py-2 rounded-xl text-sm font-bold text-white" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}>Добавить отзыв</button>
          </form>
          {loading?<p className="text-sm text-muted-foreground text-center py-2">Загрузка...</p>:
           reviews.length===0?<p className="text-sm text-muted-foreground text-center py-2">Нет отзывов. Будь первым!</p>:
           <div className="flex flex-col gap-2">
             {reviews.map(r=>(
               <div key={r.id} className="rounded-xl p-3 bg-gray-50 border border-gray-100">
                 <div className="flex items-center justify-between mb-1">
                   <span className="font-bold text-xs">{r.author_name||"Аноним"}</span>
                   <Stars value={r.rating}/>
                 </div>
                 <p className="text-xs text-gray-700">{r.comment}</p>
               </div>
             ))}
           </div>}
        </div>
      )}
    </div>
  );
}

// ─── Subject page ─────────────────────────────────────────────────────────────
function SubjectPage({subject,cls,onBack}:{subject:{name:string;emoji:string;color:string;desc:string};cls:number;onBack:()=>void}){
  const books=getTextbooks(subject.name,cls);
  const[activeBook,setActiveBook]=useState(0);
  const[openTask,setOpenTask]=useState<number|null>(null);
  const[search,setSearch]=useState("");

  const book=books[activeBook];
  const filtered=book.tasks.filter(t=>
    !search||t.num.toLowerCase().includes(search.toLowerCase())||t.question.toLowerCase().includes(search.toLowerCase())
  );

  return(
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold mb-5 text-muted-foreground hover:text-foreground transition-colors">
        <Icon name="ChevronLeft" size={16}/>Назад к предметам
      </button>

      <div className="rounded-3xl p-5 mb-5 animate-fade-in-scale" style={{background:`linear-gradient(135deg,${subject.color}15,${subject.color}05)`,border:`2px solid ${subject.color}30`}}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{background:subject.color+"20",border:`2px solid ${subject.color}40`}}>{subject.emoji}</div>
          <div>
            <h2 className="font-black text-xl" style={{fontFamily:"'Unbounded',sans-serif",color:subject.color}}>{subject.name}</h2>
            <p className="text-sm text-muted-foreground">{cls} класс · {books.length} {books.length===1?"учебник":"учебника"}</p>
          </div>
        </div>
      </div>

      {/* Textbook tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {books.map((b,i)=>(
          <button key={i} onClick={()=>{setActiveBook(i);setOpenTask(null);setSearch("");}}
            className="flex-shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all"
            style={{background:activeBook===i?subject.color:"rgba(255,255,255,0.9)",color:activeBook===i?"#fff":"#374151",border:`2px solid ${activeBook===i?"transparent":subject.color+"30"}`,boxShadow:activeBook===i?`0 4px 16px ${subject.color}40`:"none"}}>
            📚 {b.title}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Icon name="User" size={14}/>
        <span className="text-xs text-muted-foreground font-medium">Автор: {book.author}</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setOpenTask(null);}}
          placeholder="Поиск по номеру или вопросу..." className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-purple-400"/>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2">
        {filtered.length===0&&<p className="text-center py-8 text-muted-foreground text-sm">Ничего не найдено. Попробуй другой запрос.</p>}
        {filtered.map((task,i)=>{
          const isOpen=openTask===i;
          return(
            <div key={i} className="rounded-2xl overflow-hidden glass-card border" style={{borderColor:isOpen?subject.color+"60":"transparent"}}>
              <button onClick={()=>setOpenTask(isOpen?null:i)} className="w-full flex items-center justify-between p-4 text-left gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 mt-0.5" style={{background:subject.color+"20",color:subject.color}}>{task.num}</span>
                  <span className="text-sm font-medium text-gray-800 leading-snug">{task.question}</span>
                </div>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform"
                  style={{background:isOpen?subject.color:subject.color+"15",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>
                  <Icon name="ChevronDown" size={14} style={{color:isOpen?"#fff":subject.color}}/>
                </div>
              </button>
              {isOpen&&(
                <div className="px-4 pb-4">
                  <div className="rounded-2xl p-4" style={{background:subject.color+"10",border:`1.5px solid ${subject.color}25`}}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={14} style={{color:subject.color}}/>
                      <span className="text-xs font-bold" style={{color:subject.color}}>Ответ</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-line">{task.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Book reviews */}
      <BookReviews bookKey={book.key}/>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
type ModalType = "reviews"|"support"|"ai"|"composer"|"chat"|"grades"|"tutor"|null;

export default function Index(){
  const[cls,setCls]=useState(5);
  const[subject,setSubject]=useState<{name:string;emoji:string;color:string;desc:string}|null>(null);
  const[modal,setModal]=useState<ModalType>(null);
  const[tgBanner,setTgBanner]=useState(true);

  const subjects=SUBJECTS_BY_CLASS[cls]||[];

  const NAV_BTNS=[
    {id:"support",icon:"MessageCircle",label:"Связь",color:"#0ea5e9"},
    {id:"ai",icon:"Bot",label:"ИИ-помощник",color:"#7c3aed"},
    {id:"composer",icon:"PenLine",label:"Сочинитель",color:"#ec4899"},
    {id:"reviews",icon:"Star",label:"Отзывы",color:"#eab308"},
    {id:"grades",icon:"Trophy",label:"Рейтинг",color:"#f97316"},
    {id:"chat",icon:"MessageSquare",label:"Чат",color:"#22c55e"},
    {id:"tutor",icon:"GraduationCap",label:"Репетитор",color:"#ef4444"},
  ] as const;

  return(
    <div className="min-h-screen mesh-bg">
      {/* TG Banner */}
      {tgBanner&&(
        <div className="relative z-40" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}>
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
            <a href="https://t.me/otlichnik_gdz11" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white text-xs font-bold hover:opacity-90 transition-opacity">
              <span className="text-base">📢</span>
              <span>Новый Telegram-канал <span className="underline">@otlichnik_gdz11</span> — подпишись!</span>
            </a>
            <button onClick={()=>setTgBanner(false)} className="text-white/70 hover:text-white flex-shrink-0"><Icon name="X" size={14}/></button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/40">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0 animate-pulse-glow" style={{background:"linear-gradient(135deg,#7c3aed,#0ea5e9)"}}>📚</div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black leading-none tracking-tight" style={{fontFamily:"'Unbounded',sans-serif",fontSize:"clamp(15px,3.5vw,22px)",background:"linear-gradient(180deg,#fff 0%,#e8d5ff 40%,#7c3aed 70%,#4c1d95 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 2px 0px #4c1d95) drop-shadow(0 3px 6px rgba(124,58,237,0.5))"}}>
                Отличник ГДЗ
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium">Готовые домашние задания</p>
            </div>
            {/* Nav buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {NAV_BTNS.slice(0,3).map(b=>(
                <button key={b.id} onClick={()=>setModal(b.id as ModalType)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                  style={{background:b.color+"18",border:`1.5px solid ${b.color}40`,color:b.color}}>
                  <Icon name={b.icon} size={12}/>
                  <span className="hidden sm:inline">{b.label}</span>
                </button>
              ))}
              <button onClick={()=>setModal("reviews")}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{background:"#eab30818",border:"1.5px solid #eab30840",color:"#eab308"}}>
                <Icon name="Star" size={12}/>
                <span className="hidden sm:inline">Отзывы</span>
              </button>
            </div>
          </div>

          {/* Class selector */}
          {!subject&&(
            <div className="overflow-x-auto pb-1 -mx-1 px-1">
              <div className="flex gap-1.5 min-w-max">
                {CLASSES.map(c=>{
                  const color=getGroupColor(c);
                  const isActive=cls===c;
                  return(
                    <button key={c} onClick={()=>setCls(c)} className="class-btn relative flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{background:isActive?color:"rgba(255,255,255,0.7)",color:isActive?"#fff":color,border:`2px solid ${isActive?color:color+"40"}`,boxShadow:isActive?`0 4px 12px ${color}50`:"none",transform:isActive?"scale(1.1)":"scale(1)",transition:"all 0.2s"}}>
                        {c}
                      </div>
                      <span className="text-[9px] font-semibold mt-0.5" style={{color:isActive?color:"#94a3b8"}}>кл</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {subject&&(
            <div className="flex items-center gap-2 text-sm">
              <button onClick={()=>setSubject(null)} className="text-muted-foreground hover:text-foreground transition-colors font-medium">{cls} класс</button>
              <Icon name="ChevronRight" size={12}/>
              <span className="font-bold" style={{color:subject.color}}>{subject.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      {subject?(
        <SubjectPage subject={subject} cls={cls} onBack={()=>setSubject(null)}/>
      ):(
        <>
          <section className="max-w-7xl mx-auto px-4 pt-6 pb-3">
            <div className="animate-fade-in-up" style={{animationDelay:"0.05s",opacity:0,animationFillMode:"forwards"}}>
              <div className="flex items-center gap-2 mb-1">
                {CLASS_GROUPS.map(g=>g.range.includes(cls)&&(
                  <span key={g.label} className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{background:g.color}}>{g.label}</span>
                ))}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black" style={{fontFamily:"'Unbounded',sans-serif"}}>
                <span style={{background:`linear-gradient(135deg,${getGroupColor(cls)},#ec4899)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{cls} класс</span>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">Выбери предмет — найдём нужное решение</p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {subjects.map((s,i)=>(
                <div key={s.name} className="animate-fade-in-up" style={{animationDelay:`${0.08+i*0.04}s`,opacity:0,animationFillMode:"forwards"}}>
                  <button onClick={()=>setSubject(s)}
                    className="subject-card w-full rounded-2xl p-4 text-left relative overflow-hidden group"
                    style={{background:"rgba(255,255,255,0.85)",border:`2px solid ${s.color}30`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{background:s.color}}/>
                    <div className="text-3xl mb-2 leading-none">{s.emoji}</div>
                    <div className="font-bold text-sm leading-tight mb-1" style={{color:"#1e293b"}}>{s.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{s.desc}</div>
                    <div className="mt-2 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{color:s.color}}>
                      <Icon name="ChevronRight" size={12}/>Смотреть ГДЗ
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom feature buttons */}
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {id:"grades",icon:"Trophy",label:"Рейтинг оценок",desc:"Проголосуй!",color:"#f97316"},
                {id:"chat",icon:"MessageSquare",label:"Общий чат",desc:"Онлайн",color:"#22c55e"},
                {id:"tutor",icon:"GraduationCap",label:"Репетитор",desc:"Помощь от учителя",color:"#ef4444"},
                {id:"composer",icon:"PenLine",label:"Сочинитель текстов",desc:"ИИ Данил Колбасенко",color:"#ec4899"},
              ].map(b=>(
                <button key={b.id} onClick={()=>setModal(b.id as ModalType)}
                  className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95 group"
                  style={{background:"rgba(255,255,255,0.85)",border:`2px solid ${b.color}30`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:b.color+"18"}}>
                    <Icon name={b.icon} size={20} style={{color:b.color}}/>
                  </div>
                  <div className="font-bold text-sm leading-tight" style={{color:"#1e293b"}}>{b.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">ГДЗ для 1–11 класса по всем предметам школьной программы</p>
          <p className="text-sm mt-2 font-medium" style={{color:"#7c3aed"}}>♥ С уважением, Администрация ГДЗ Отличник</p>
          <div className="flex justify-center gap-4 mt-3">
            {CLASS_GROUPS.map(g=>(
              <div key={g.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{background:g.color}}/>
                <span className="text-xs text-muted-foreground font-medium">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Modals */}
      {modal==="reviews"&&<ReviewsModal onClose={()=>setModal(null)}/>}
      {modal==="support"&&<SupportModal onClose={()=>setModal(null)}/>}
      {modal==="ai"&&<AiModal onClose={()=>setModal(null)} title="🤖 ИИ-помощник" persona="Привет! Я ИИ-помощник Отличника ГДЗ. Задай любой вопрос по школьным предметам — помогу разобраться с задачей, объясню правило или дам совет 📚"/>}
      {modal==="composer"&&<AiModal onClose={()=>setModal(null)} title="✍️ Сочинитель текстов" persona="Привет! Меня зовут Данил Колбасенко, и я рад помочь тебе с любыми текстами 📝\n\nЯ помогу написать:\n• Сочинение на любую тему\n• Изложение по тексту\n• Развёрнутый ответ\n• Пересказ произведения\n• Эссе и творческие работы\n\nНапиши тему или вставь текст — начнём!"/>}
      {modal==="chat"&&<ChatModal onClose={()=>setModal(null)}/>}
      {modal==="grades"&&<GradesModal onClose={()=>setModal(null)}/>}
      {modal==="tutor"&&(
        <Modal onClose={()=>setModal(null)} title="👨‍🏫 Репетитор">
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4">👩‍🏫</div>
            <h3 className="font-black text-xl mb-2" style={{fontFamily:"'Unbounded',sans-serif"}}>Нужен репетитор?</h3>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">Помогаем найти репетитора по любому школьному предмету. Напишите нам в Telegram — подберём специалиста под ваши потребности и бюджет.</p>
            <a href="https://t.me/katixxia" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{background:"linear-gradient(135deg,#ef4444,#ec4899)"}}>
              <Icon name="Send" size={16}/>Написать @katixxia
            </a>
            <p className="text-xs text-muted-foreground mt-4">♥ С уважением, Администрация ГДЗ Отличник</p>
          </div>
        </Modal>
      )}
    </div>
  );
}