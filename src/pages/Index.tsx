import { useState } from "react";
import Icon from "@/components/ui/icon";

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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

export default function Index() {
  const [selectedClass, setSelectedClass] = useState<number>(5);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = SUBJECTS_BY_CLASS[selectedClass] || [];

  const getGroupColor = (cls: number) => {
    for (const g of CLASS_GROUPS) {
      if (g.range.includes(cls)) return g.color;
    }
    return "#7c3aed";
  };

  const activeSubject = subjects.find((s) => s.name === selectedSubject);

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
            <div>
              <h1
                className="text-xl font-black leading-none"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  background: "linear-gradient(135deg, #7c3aed, #0ea5e9, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ГДЗ
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Готовые домашние задания</p>
            </div>
          </div>

          {/* Class selector */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              {CLASSES.map((cls) => {
                const color = getGroupColor(cls);
                const isActive = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    onClick={() => { setSelectedClass(cls); setSelectedSubject(null); }}
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
        </div>
      </header>

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
          <p className="text-muted-foreground mt-1 text-base">
            Выбери предмет — найдём нужное решение
          </p>
        </div>
      </section>

      {/* Subjects grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {subjects.map((subject, index) => {
            const isSelected = selectedSubject === subject.name;
            return (
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
                  onClick={() => setSelectedSubject(isSelected ? null : subject.name)}
                  className="subject-card w-full rounded-2xl p-4 text-left relative overflow-hidden group"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${subject.color}20, ${subject.color}10)`
                      : "rgba(255,255,255,0.85)",
                    border: `2px solid ${isSelected ? subject.color : subject.color + "30"}`,
                    boxShadow: isSelected
                      ? `0 8px 24px ${subject.color}30`
                      : "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: subject.color }}
                  />
                  <div className="text-3xl mb-2 leading-none">{subject.emoji}</div>
                  <div
                    className="font-bold text-sm leading-tight mb-1"
                    style={{ color: isSelected ? subject.color : "#1e293b" }}
                  >
                    {subject.name}
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">{subject.desc}</div>
                  {isSelected && (
                    <div
                      className="mt-2 text-xs font-bold flex items-center gap-1"
                      style={{ color: subject.color }}
                    >
                      <Icon name="ChevronRight" size={12} />
                      Смотреть ГДЗ
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected subject panel */}
        {selectedSubject && activeSubject && (
          <div
            className="mt-6 animate-fade-in-scale rounded-3xl p-6 glass-card"
            style={{
              border: `2px solid ${activeSubject.color}30`,
              boxShadow: `0 12px 40px ${activeSubject.color}20`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${activeSubject.color}20, ${activeSubject.color}10)`,
                  border: `2px solid ${activeSubject.color}40`,
                }}
              >
                {activeSubject.emoji}
              </div>
              <div>
                <h3
                  className="font-black text-lg"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  {selectedSubject}
                </h3>
                <p className="text-sm text-muted-foreground">{selectedClass} класс</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Учебник", "Рабочая тетрадь", "Контрольные", "Самостоятельные", "Тесты", "Все задания"].map(
                (type, i) => (
                  <button
                    key={type}
                    className="py-2.5 px-3 rounded-xl text-sm font-semibold text-left transition-all hover:scale-[1.02] active:scale-95"
                    style={{
                      background: i === 0 ? activeSubject.color : "rgba(255,255,255,0.8)",
                      color: i === 0 ? "#fff" : "#1e293b",
                      border: `1.5px solid ${i === 0 ? "transparent" : activeSubject.color + "30"}`,
                    }}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            ГДЗ для 1–11 класса по всем предметам школьной программы
          </p>
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
    </div>
  );
}
