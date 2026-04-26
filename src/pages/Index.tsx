import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const REVIEWS_URL = "https://functions.poehali.dev/f1eaedec-3583-4551-b803-18c3b482aab0";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Учебники по предмету и классу
const TEXTBOOKS: Record<string, Record<number, { title: string; author: string; tasks: { num: string; question: string; answer: string }[] }[]>> = {
  "Математика": {
    1: [
      {
        title: "Математика, 1 класс", author: "Моро М.И.",
        tasks: [
          { num: "№1", question: "Сколько будет 2 + 3?", answer: "2 + 3 = 5" },
          { num: "№2", question: "Сколько будет 4 + 1?", answer: "4 + 1 = 5" },
          { num: "№3", question: "Сколько будет 7 − 3?", answer: "7 − 3 = 4" },
          { num: "№4", question: "Напиши числа от 1 до 10.", answer: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10" },
        ]
      },
      {
        title: "Рабочая тетрадь, 1 класс", author: "Бантова М.А.",
        tasks: [
          { num: "Стр.5 №1", question: "Сосчитай предметы.", answer: "На рисунке 6 предметов." },
          { num: "Стр.6 №2", question: "Дорисуй до 5.", answer: "Нужно дорисовать 2 предмета." },
        ]
      }
    ],
    5: [
      {
        title: "Математика, 5 класс", author: "Виленкин Н.Я.",
        tasks: [
          { num: "№1", question: "Найди значение выражения: 48 ÷ 6 × 2", answer: "48 ÷ 6 = 8; 8 × 2 = 16. Ответ: 16" },
          { num: "№2", question: "Вычисли: 125 + 375", answer: "125 + 375 = 500" },
          { num: "№3", question: "Реши задачу: в магазине было 240 кг яблок. Продали 3/8 всех яблок. Сколько яблок продали?", answer: "240 × 3/8 = 90 кг. Продали 90 кг яблок." },
          { num: "№4", question: "Найди НОД чисел 24 и 36.", answer: "24 = 2³×3; 36 = 2²×3². НОД(24,36) = 2²×3 = 12" },
        ]
      },
      {
        title: "Сборник задач, 5 класс", author: "Чесноков А.С.",
        tasks: [
          { num: "Задача 12", question: "Поезд прошёл 360 км за 4 ч. Какова скорость поезда?", answer: "v = 360 ÷ 4 = 90 км/ч" },
          { num: "Задача 13", question: "Площадь прямоугольника 48 см², длина 8 см. Найди ширину.", answer: "b = 48 ÷ 8 = 6 см" },
        ]
      }
    ],
    9: [
      {
        title: "Алгебра, 9 класс", author: "Макарычев Ю.Н.",
        tasks: [
          { num: "№1", question: "Решите уравнение: x² − 5x + 6 = 0", answer: "D = 25 − 24 = 1; x₁ = (5+1)/2 = 3; x₂ = (5−1)/2 = 2. Ответ: 2; 3" },
          { num: "№2", question: "Найдите область определения функции y = √(x−3)", answer: "x − 3 ≥ 0; x ≥ 3. Область определения: [3; +∞)" },
        ]
      }
    ]
  },
  "Русский язык": {
    1: [
      {
        title: "Русский язык, 1 класс", author: "Канакина В.П.",
        tasks: [
          { num: "Упр.1", question: "Спиши предложение: Мама мыла раму.", answer: "Мама мыла раму. (Начинается с большой буквы, в конце точка)" },
          { num: "Упр.2", question: "Раздели слова на слоги: кот, рука, молоко", answer: "кот (1 слог), ру-ка (2 слога), мо-ло-ко (3 слога)" },
        ]
      }
    ],
    5: [
      {
        title: "Русский язык, 5 класс", author: "Ладыженская Т.А.",
        tasks: [
          { num: "Упр.10", question: "Разбери слово «подберёзовик» по составу.", answer: "под- (приставка), берёз (корень), -ов- (суффикс), -ик (суффикс)" },
          { num: "Упр.11", question: "Определи падеж: «вижу друга»", answer: "Вижу (кого?) друга — Винительный падеж" },
          { num: "Упр.12", question: "Найди в предложении грамматическую основу: «Быстрые реки текут с гор.»", answer: "Подлежащее: реки. Сказуемое: текут." },
        ]
      }
    ]
  },
  "Физика": {
    7: [
      {
        title: "Физика, 7 класс", author: "Перышкин А.В.",
        tasks: [
          { num: "§1 Вопрос 1", question: "Что изучает физика?", answer: "Физика — наука о природе. Она изучает свойства тел, явления природы и законы, по которым они происходят." },
          { num: "Задача 1", question: "Тело массой 5 кг движется с ускорением 2 м/с². Найдите силу.", answer: "F = ma = 5 × 2 = 10 Н" },
          { num: "Задача 2", question: "Чему равна скорость тела через 3 с, если начальная скорость 0, а ускорение 4 м/с²?", answer: "v = v₀ + at = 0 + 4×3 = 12 м/с" },
        ]
      }
    ],
    9: [
      {
        title: "Физика, 9 класс", author: "Перышкин А.В.",
        tasks: [
          { num: "§12 Вопрос 3", question: "Сформулируй закон сохранения импульса.", answer: "Сумма импульсов тел замкнутой системы остаётся постоянной при любых взаимодействиях тел этой системы." },
          { num: "Задача 5", question: "Тело массой 2 кг летит со скоростью 10 м/с. Найдите импульс.", answer: "p = mv = 2 × 10 = 20 кг·м/с" },
        ]
      }
    ]
  },
  "Химия": {
    8: [
      {
        title: "Химия, 8 класс", author: "Рудзитис Г.Е.",
        tasks: [
          { num: "§1 Вопрос 1", question: "Что такое атом?", answer: "Атом — наименьшая химически неделимая частица вещества, сохраняющая его химические свойства." },
          { num: "Задача 1", question: "Вычисли молярную массу H₂O.", answer: "M(H₂O) = 2×1 + 16 = 18 г/моль" },
          { num: "Задача 2", question: "Составь уравнение реакции горения метана.", answer: "CH₄ + 2O₂ → CO₂ + 2H₂O" },
        ]
      }
    ]
  },
  "Биология": {
    5: [
      {
        title: "Биология, 5 класс", author: "Пасечник В.В.",
        tasks: [
          { num: "§1 Вопрос 1", question: "Что такое биология?", answer: "Биология — наука о живой природе. Она изучает строение, жизнедеятельность, многообразие живых организмов и их связь с окружающей средой." },
          { num: "§2 Вопрос 2", question: "Назови признаки живых организмов.", answer: "Питание, дыхание, рост, размножение, раздражимость, движение, обмен веществ." },
        ]
      }
    ]
  },
  "История": {
    5: [
      {
        title: "История Древнего мира, 5 класс", author: "Вигасин А.А.",
        tasks: [
          { num: "§1 Вопрос 1", question: "Что такое история?", answer: "История — наука о прошлом человечества. Она изучает события, людей и явления прошлых эпох." },
          { num: "§3 Вопрос 2", question: "Где возникли первые государства?", answer: "Первые государства возникли в речных долинах: в Египте (р. Нил), Месопотамии (Тигр и Евфрат), Индии (Инд) и Китае (Хуанхэ)." },
        ]
      }
    ]
  },
  "Английский": {
    5: [
      {
        title: "English, 5 класс", author: "Биболетова М.З.",
        tasks: [
          { num: "Ex.1", question: "Переведи: My name is Anna. I am ten years old.", answer: "Меня зовут Анна. Мне десять лет." },
          { num: "Ex.2", question: "Составь вопрос: He goes to school every day.", answer: "Does he go to school every day?" },
        ]
      }
    ]
  },
};

const DEFAULT_TEXTBOOKS = (subjectName: string, cls: number) => [
  {
    title: `${subjectName}, ${cls} класс`,
    author: "Стандартный учебник",
    tasks: [
      { num: "§1 Вопрос 1", question: `Что изучает предмет «${subjectName}»?`, answer: `«${subjectName}» — важный школьный предмет, который помогает развивать знания и навыки, необходимые в жизни.` },
      { num: "Задача 1", question: "Выполни задание из учебника.", answer: "Ответ зависит от конкретного задания. Внимательно прочитай условие и следуй алгоритму решения." },
      { num: "Задача 2", question: "Ответь на вопрос параграфа.", answer: "Для ответа используй материал учебника и конспект урока." },
    ]
  },
  {
    title: `Рабочая тетрадь, ${cls} класс`,
    author: "Дополнительное пособие",
    tasks: [
      { num: "Стр.4 №1", question: "Выполни упражнение.", answer: "Внимательно читай задание. Если есть затруднения — обратись к теории в учебнике." },
      { num: "Стр.5 №2", question: "Реши задачу.", answer: "Запиши дано, найди формулу или правило, подставь значения и получи ответ." },
    ]
  }
];

const SUBJECTS_BY_CLASS: Record<number, { name: string; emoji: string; color: string; desc: string }[]> = {
  1: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Счёт, цифры, задачи" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Буквы, слова, письмо" },
    { name: "Окружающий мир", emoji: "🌍", color: "#22c55e", desc: "Природа и общество" },
    { name: "Чтение", emoji: "📖", color: "#f97316", desc: "Тексты и рассказы" },
    { name: "Изо", emoji: "🎨", color: "#ec4899", desc: "Рисование и творчество" },
    { name: "Музыка", emoji: "🎵", color: "#eab308", desc: "Ноты и пение" },
  ],
  2: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Сложение и вычитание" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Правила и диктанты" },
    { name: "Окружающий мир", emoji: "🌍", color: "#22c55e", desc: "Природа и общество" },
    { name: "Литературное чтение", emoji: "📖", color: "#f97316", desc: "Стихи и рассказы" },
    { name: "Английский", emoji: "🇬🇧", color: "#ec4899", desc: "Первые слова" },
    { name: "Изо", emoji: "🎨", color: "#14b8a6", desc: "Рисование" },
  ],
  3: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Умножение и деление" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Правила орфографии" },
    { name: "Окружающий мир", emoji: "🌍", color: "#22c55e", desc: "Природа и история" },
    { name: "Литературное чтение", emoji: "📖", color: "#f97316", desc: "Произведения классиков" },
    { name: "Английский", emoji: "🇬🇧", color: "#ec4899", desc: "Диалоги и тексты" },
    { name: "Изо", emoji: "🎨", color: "#14b8a6", desc: "Творческие задания" },
  ],
  4: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Дроби и задачи" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Синтаксис и морфология" },
    { name: "Окружающий мир", emoji: "🌍", color: "#22c55e", desc: "История России" },
    { name: "Литературное чтение", emoji: "📖", color: "#f97316", desc: "Классическая литература" },
    { name: "Английский", emoji: "🇬🇧", color: "#ec4899", desc: "Грамматика и тексты" },
    { name: "Технология", emoji: "🔧", color: "#eab308", desc: "Поделки и проекты" },
  ],
  5: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Алгебра и геометрия" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Морфология и синтаксис" },
    { name: "Литература", emoji: "📖", color: "#f97316", desc: "Русская и зарубежная" },
    { name: "История", emoji: "🏛️", color: "#ef4444", desc: "Древний мир" },
    { name: "Английский", emoji: "🇬🇧", color: "#ec4899", desc: "Грамматика и письмо" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "Живая природа" },
    { name: "География", emoji: "🗺️", color: "#14b8a6", desc: "Планета Земля" },
    { name: "Изо", emoji: "🎨", color: "#eab308", desc: "Искусство и творчество" },
  ],
  6: [
    { name: "Математика", emoji: "➕", color: "#7c3aed", desc: "Алгебра и геометрия" },
    { name: "Русский язык", emoji: "📝", color: "#0ea5e9", desc: "Правописание и стиль" },
    { name: "Литература", emoji: "📖", color: "#f97316", desc: "Анализ произведений" },
    { name: "История", emoji: "🏛️", color: "#ef4444", desc: "Средние века" },
    { name: "Английский", emoji: "🇬🇧", color: "#ec4899", desc: "Тексты и диалоги" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "Растения и животные" },
    { name: "География", emoji: "🗺️", color: "#14b8a6", desc: "Материки и океаны" },
    { name: "Обществознание", emoji: "👥", color: "#eab308", desc: "Общество и человек" },
  ],
  7: [
    { name: "Алгебра", emoji: "📐", color: "#7c3aed", desc: "Уравнения и функции" },
    { name: "Геометрия", emoji: "📏", color: "#0ea5e9", desc: "Фигуры и теоремы" },
    { name: "Русский язык", emoji: "📝", color: "#ec4899", desc: "Сложные предложения" },
    { name: "Литература", emoji: "📖", color: "#f97316", desc: "Классика и анализ" },
    { name: "История", emoji: "🏛️", color: "#ef4444", desc: "Новое время" },
    { name: "Физика", emoji: "⚡", color: "#eab308", desc: "Механика и силы" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "Человек и природа" },
    { name: "Английский", emoji: "🇬🇧", color: "#14b8a6", desc: "Сложные темы" },
  ],
  8: [
    { name: "Алгебра", emoji: "📐", color: "#7c3aed", desc: "Квадратные уравнения" },
    { name: "Геометрия", emoji: "📏", color: "#0ea5e9", desc: "Теоремы и задачи" },
    { name: "Русский язык", emoji: "📝", color: "#ec4899", desc: "ОГЭ подготовка" },
    { name: "Физика", emoji: "⚡", color: "#eab308", desc: "Электричество" },
    { name: "Химия", emoji: "🧪", color: "#ef4444", desc: "Реакции и вещества" },
    { name: "История", emoji: "🏛️", color: "#f97316", desc: "Россия в XIX веке" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "Человек и здоровье" },
    { name: "Обществознание", emoji: "👥", color: "#14b8a6", desc: "Право и экономика" },
  ],
  9: [
    { name: "Алгебра", emoji: "📐", color: "#7c3aed", desc: "ОГЭ: функции и графики" },
    { name: "Геометрия", emoji: "📏", color: "#0ea5e9", desc: "ОГЭ: стереометрия" },
    { name: "Русский язык", emoji: "📝", color: "#ec4899", desc: "ОГЭ подготовка" },
    { name: "Физика", emoji: "⚡", color: "#eab308", desc: "Оптика и термодинамика" },
    { name: "Химия", emoji: "🧪", color: "#ef4444", desc: "Органическая химия" },
    { name: "История", emoji: "🏛️", color: "#f97316", desc: "XX век" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "Генетика и эволюция" },
    { name: "Информатика", emoji: "💻", color: "#14b8a6", desc: "Алгоритмы и программы" },
  ],
  10: [
    { name: "Математика", emoji: "📐", color: "#7c3aed", desc: "ЕГЭ: профиль и база" },
    { name: "Физика", emoji: "⚡", color: "#eab308", desc: "ЕГЭ: механика" },
    { name: "Химия", emoji: "🧪", color: "#ef4444", desc: "ЕГЭ: теория" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "ЕГЭ: цитология" },
    { name: "История", emoji: "🏛️", color: "#f97316", desc: "ЕГЭ: Россия и мир" },
    { name: "Обществознание", emoji: "👥", color: "#14b8a6", desc: "ЕГЭ: право и соц" },
    { name: "Русский язык", emoji: "📝", color: "#ec4899", desc: "ЕГЭ: сочинение" },
    { name: "Информатика", emoji: "💻", color: "#0ea5e9", desc: "Программирование" },
    { name: "Английский", emoji: "🇬🇧", color: "#7c3aed", desc: "ЕГЭ: все разделы" },
  ],
  11: [
    { name: "Математика", emoji: "📐", color: "#7c3aed", desc: "ЕГЭ: профильный уровень" },
    { name: "Физика", emoji: "⚡", color: "#eab308", desc: "ЕГЭ: квантовая физика" },
    { name: "Химия", emoji: "🧪", color: "#ef4444", desc: "ЕГЭ: органика" },
    { name: "Биология", emoji: "🌱", color: "#22c55e", desc: "ЕГЭ: эволюция" },
    { name: "История", emoji: "🏛️", color: "#f97316", desc: "ЕГЭ: полный курс" },
    { name: "Обществознание", emoji: "👥", color: "#14b8a6", desc: "ЕГЭ: экономика" },
    { name: "Русский язык", emoji: "📝", color: "#ec4899", desc: "ЕГЭ: итоговое" },
    { name: "Информатика", emoji: "💻", color: "#0ea5e9", desc: "ЕГЭ: алгоритмы" },
    { name: "Литература", emoji: "📖", color: "#f97316", desc: "ЕГЭ: сочинение" },
    { name: "Английский", emoji: "🇬🇧", color: "#7c3aed", desc: "ЕГЭ: устная часть" },
  ],
};

const CLASS_GROUPS = [
  { label: "Началка", range: [1, 2, 3, 4], color: "#22c55e" },
  { label: "Средняя", range: [5, 6, 7, 8, 9], color: "#0ea5e9" },
  { label: "Старшая", range: [10, 11], color: "#7c3aed" },
];

interface Review {
  id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className="text-2xl transition-transform hover:scale-110"
          style={{ cursor: onChange ? "pointer" : "default" }}
        >
          <span style={{ color: star <= (hover || value) ? "#eab308" : "#d1d5db" }}>★</span>
        </button>
      ))}
    </div>
  );
}

function ReviewsModal({ onClose }: { onClose: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ author_name: "", rating: 5, comment: "" });

  useEffect(() => {
    fetch(REVIEWS_URL)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.comment.trim()) { setError("Напишите комментарий"); return; }
    setSubmitting(true);
    const res = await fetch(REVIEWS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok || data.error) {
      setError(data.error || "Ошибка при отправке");
    } else {
      setSuccess(true);
      setReviews([data.review, ...reviews]);
      setForm({ author_name: "", rating: 5, comment: "" });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl animate-fade-in-scale"
        style={{ background: "#fff", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-5 border-b"
          style={{ background: "#fff", borderRadius: "1.5rem 1.5rem 0 0" }}
        >
          <div>
            <h2 className="font-black text-lg" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              Отзывы
            </h2>
            {avgRating && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="font-bold text-sm">{avgRating}</span>
                <span className="text-xs text-muted-foreground">({reviews.length} отзывов)</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Write review form */}
        <form onSubmit={submit} className="p-5 border-b bg-gray-50">
          <p className="font-bold text-sm mb-3">Оставить отзыв</p>
          <input
            type="text"
            placeholder="Ваше имя (необязательно)"
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            maxLength={100}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-2 outline-none focus:border-purple-400 transition-colors"
          />
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">Оценка</p>
            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          </div>
          <textarea
            placeholder="Ваш комментарий..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            maxLength={1000}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 text-sm mb-2 outline-none focus:border-purple-400 transition-colors resize-none"
          />
          {error && (
            <p className="text-red-500 text-xs mb-2 font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-xs mb-2 font-medium">Отзыв успешно опубликован!</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Отправляю..." : "Опубликовать отзыв"}
          </button>
        </form>

        {/* Reviews list */}
        <div className="p-5">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Загрузка...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">💬</p>
              <p className="text-muted-foreground text-sm">Пока нет отзывов. Будь первым!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl p-4 bg-gray-50 border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: `hsl(${(r.author_name.charCodeAt(0) * 37) % 360}, 65%, 55%)` }}
                      >
                        {(r.author_name || "А")[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-sm">{r.author_name || "Аноним"}</span>
                    </div>
                    <StarRating value={r.rating} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(r.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubjectPage({
  subject,
  cls,
  onBack,
}: {
  subject: { name: string; emoji: string; color: string; desc: string };
  cls: number;
  onBack: () => void;
}) {
  const books = TEXTBOOKS[subject.name]?.[cls] || DEFAULT_TEXTBOOKS(subject.name, cls);
  const [activeBook, setActiveBook] = useState(0);
  const [openTask, setOpenTask] = useState<number | null>(null);

  const book = books[activeBook];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold mb-5 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Icon name="ChevronLeft" size={16} />
        Назад к предметам
      </button>

      {/* Subject header */}
      <div
        className="rounded-3xl p-5 mb-5 animate-fade-in-scale"
        style={{
          background: `linear-gradient(135deg, ${subject.color}15, ${subject.color}05)`,
          border: `2px solid ${subject.color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: subject.color + "20", border: `2px solid ${subject.color}40` }}
          >
            {subject.emoji}
          </div>
          <div>
            <h2 className="font-black text-xl" style={{ fontFamily: "'Unbounded', sans-serif", color: subject.color }}>
              {subject.name}
            </h2>
            <p className="text-sm text-muted-foreground">{cls} класс · {books.length} учебника</p>
          </div>
        </div>
      </div>

      {/* Textbook tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {books.map((b, i) => (
          <button
            key={i}
            onClick={() => { setActiveBook(i); setOpenTask(null); }}
            className="flex-shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: activeBook === i ? subject.color : "rgba(255,255,255,0.9)",
              color: activeBook === i ? "#fff" : "#374151",
              border: `2px solid ${activeBook === i ? "transparent" : subject.color + "30"}`,
              boxShadow: activeBook === i ? `0 4px 16px ${subject.color}40` : "none",
            }}
          >
            📚 {b.title}
          </button>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-4">
        <Icon name="User" size={14} />
        <span className="text-xs text-muted-foreground font-medium">Автор: {book.author}</span>
      </div>

      {/* Tasks list */}
      <div className="flex flex-col gap-2">
        {book.tasks.map((task, i) => {
          const isOpen = openTask === i;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden glass-card border"
              style={{ borderColor: isOpen ? subject.color + "60" : "transparent" }}
            >
              <button
                onClick={() => setOpenTask(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left gap-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-xs font-black px-2 py-1 rounded-lg flex-shrink-0 mt-0.5"
                    style={{ background: subject.color + "20", color: subject.color }}
                  >
                    {task.num}
                  </span>
                  <span className="text-sm font-medium text-gray-800 leading-snug">{task.question}</span>
                </div>
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform"
                  style={{
                    background: isOpen ? subject.color : subject.color + "15",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <Icon name="ChevronDown" size={14} style={{ color: isOpen ? "#fff" : subject.color }} />
                </div>
              </button>
              {isOpen && (
                <div
                  className="px-4 pb-4 animate-fade-in-up"
                  style={{ animationDuration: "0.2s" }}
                >
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: subject.color + "10", border: `1.5px solid ${subject.color}25` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={14} style={{ color: subject.color }} />
                      <span className="text-xs font-bold" style={{ color: subject.color }}>Ответ</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">{task.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Index() {
  const [selectedClass, setSelectedClass] = useState<number>(5);
  const [selectedSubject, setSelectedSubject] = useState<{ name: string; emoji: string; color: string; desc: string } | null>(null);
  const [showReviews, setShowReviews] = useState(false);

  const subjects = SUBJECTS_BY_CLASS[selectedClass] || [];

  const getGroupColor = (cls: number) => {
    for (const g of CLASS_GROUPS) {
      if (g.range.includes(cls)) return g.color;
    }
    return "#7c3aed";
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black text-white animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
            >
              📚
            </div>
            <div className="flex-1">
              <h1
                className="font-black leading-none tracking-tight"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: "clamp(18px, 4vw, 26px)",
                  background: "linear-gradient(180deg, #fff 0%, #e8d5ff 40%, #7c3aed 70%, #4c1d95 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 0px #4c1d95) drop-shadow(0 4px 8px rgba(124,58,237,0.5))",
                  letterSpacing: "-0.02em",
                }}
              >
                Отличник ГДЗ
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Готовые домашние задания</p>
            </div>
            {/* Help & Reviews button */}
            <button
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed20, #0ea5e920)",
                border: "1.5px solid #7c3aed40",
                color: "#7c3aed",
              }}
            >
              <Icon name="Star" size={13} />
              <span className="hidden sm:inline">Отзывы</span>
            </button>
          </div>

          {/* Class selector */}
          {!selectedSubject && (
            <div className="overflow-x-auto pb-1 -mx-1 px-1">
              <div className="flex gap-2 min-w-max">
                {CLASSES.map((cls) => {
                  const color = getGroupColor(cls);
                  const isActive = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className="class-btn relative flex flex-col items-center"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold"
                        style={{
                          background: isActive ? color : "rgba(255,255,255,0.7)",
                          color: isActive ? "#fff" : color,
                          border: `2px solid ${isActive ? color : color + "40"}`,
                          boxShadow: isActive ? `0 4px 16px ${color}50` : "none",
                          transform: isActive ? "scale(1.1)" : "scale(1)",
                          transition: "all 0.2s",
                        }}
                      >
                        {cls}
                      </div>
                      <span
                        className="text-[9px] font-semibold mt-0.5"
                        style={{ color: isActive ? color : "#94a3b8" }}
                      >
                        кл
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Breadcrumb when subject is open */}
          {selectedSubject && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {selectedClass} класс
              </button>
              <Icon name="ChevronRight" size={12} />
              <span className="font-bold" style={{ color: selectedSubject.color }}>{selectedSubject.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      {selectedSubject ? (
        <SubjectPage
          subject={selectedSubject}
          cls={selectedClass}
          onBack={() => setSelectedSubject(null)}
        />
      ) : (
        <>
          {/* Hero section */}
          <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.05s", opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-2 mb-1">
                {CLASS_GROUPS.map(
                  (g) =>
                    g.range.includes(selectedClass) && (
                      <span
                        key={g.label}
                        className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: g.color }}
                      >
                        {g.label}
                      </span>
                    )
                )}
              </div>
              <h2
                className="text-3xl sm:text-4xl font-black leading-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${getGroupColor(selectedClass)}, #ec4899)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {selectedClass} класс
                </span>
              </h2>
              <p className="text-muted-foreground mt-1 text-base">Выбери предмет — найдём нужное решение</p>
            </div>
          </section>

          {/* Subjects grid */}
          <section className="max-w-7xl mx-auto px-4 pb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {subjects.map((subject, index) => (
                <div
                  key={subject.name}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${0.08 + index * 0.05}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  <button
                    onClick={() => setSelectedSubject(subject)}
                    className="subject-card w-full rounded-2xl p-4 text-left relative overflow-hidden group"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: `2px solid ${subject.color}30`,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: subject.color }}
                    />
                    <div className="text-3xl mb-2 leading-none">{subject.emoji}</div>
                    <div className="font-bold text-sm leading-tight mb-1" style={{ color: "#1e293b" }}>
                      {subject.name}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">{subject.desc}</div>
                    <div
                      className="mt-2 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: subject.color }}
                    >
                      <Icon name="ChevronRight" size={12} />
                      Смотреть ГДЗ
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">ГДЗ для 1–11 класса по всем предметам школьной программы</p>
          <div className="flex justify-center gap-4 mt-3">
            {CLASS_GROUPS.map((g) => (
              <div key={g.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                <span className="text-xs text-muted-foreground font-medium">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Reviews modal */}
      {showReviews && <ReviewsModal onClose={() => setShowReviews(false)} />}
    </div>
  );
}
