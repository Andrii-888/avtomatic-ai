import type { MessageKey } from "./en";

// Русский
export const ru: Record<MessageKey, string> = {
  "common.openDemo": "Открыть демо",
  "common.tryDemo": "Попробовать демо",
  "common.howItWorks": "Как это работает",

  "nav.tagline": "ИИ-ассистент по документам",

  "hero.title": "Интеллектуальная обработка документов для бизнеса",
  "hero.subtitle":
    "От PDF к структурированным данным — локально, без отправки данных куда-либо.",

  "solve.title": "Какие задачи решаем",
  "solve.subtitle": "От ручной работы к полной автоматизации.",

  "badge.live": "Доступно",
  "badge.inDevelopment": "В разработке",
  "badge.roadmap": "В планах",
  "card.tryIt": "Попробовать",

  "features.pdf.title": "Из PDF в структурированные данные",
  "features.pdf.desc": "Автоматически извлекает текст из любого PDF.",
  "features.classify.title": "ИИ-классификация документов",
  "features.classify.desc":
    "Определяет счёт, договор, резюме, сертификат.",
  "features.extract.title": "Извлечение ключевых данных",
  "features.extract.desc":
    "Автоматически находит суммы, даты, стороны и имена.",
  "features.privacy.title": "Приватность с локальным ИИ",
  "features.privacy.desc":
    "Данные никогда не покидают вашу инфраструктуру. Ollama работает локально.",
  "features.summary.title": "Краткое содержание документа",
  "features.summary.desc":
    "Получите главное, не читая документ целиком.",
  "features.status.title": "Автообновление статуса",
  "features.status.desc":
    "Статус обработки в реальном времени, без перезагрузки страницы.",
  "features.chat.title": "Чат с документом",
  "features.chat.desc":
    "Задавайте вопросы по любому документу на естественном языке.",
  "features.search.title": "Поиск по документам",
  "features.search.desc":
    "Мгновенно находите любой документ по его содержимому.",
  "features.cloud.title": "Облачные ИИ-провайдеры",
  "features.cloud.desc":
    "Опционально Claude или OpenAI для тех, кто предпочитает облако.",
  "features.export.title": "Экспорт в Excel / CSV",
  "features.export.desc":
    "Скачивайте извлечённые данные готовыми таблицами.",
  "features.ocr.title": "OCR для сканов",
  "features.ocr.desc": "Обрабатывает отсканированные PDF и изображения.",
  "features.erp.title": "Интеграция с ERP/CRM",
  "features.erp.desc":
    "Экспортируйте структурированные данные прямо в ваши бизнес-инструменты.",

  "section.howItWorks": "Как это работает",
  "steps.upload.title": "Загрузите PDF",
  "steps.upload.desc": "Перетащите любой бизнес-документ.",
  "steps.analyze.title": "ИИ анализирует локально",
  "steps.analyze.desc":
    "Локальная LLM извлекает и классифицирует данные на вашем сервере.",
  "steps.structured.title": "Получите структурированные данные",
  "steps.structured.desc": "Используйте извлечённые данные в своих процессах.",

  "section.whoIsItFor": "Для кого это",
  "audience.fiduciaries.title": "Фидуциарии",
  "audience.fiduciaries.desc":
    "Автоматизируйте обработку счетов и договоров.",
  "audience.law.title": "Юридические фирмы",
  "audience.law.desc":
    "Мгновенно извлекайте ключевые условия из договоров.",
  "audience.hr.title": "HR-команды",
  "audience.hr.desc":
    "Разбирайте резюме и автоматически извлекайте данные кандидатов.",

  "privacy.title": "Ваши данные никогда не покидают вашу инфраструктуру",
  "privacy.body":
    "Анализ выполняется локальной ИИ-моделью (Ollama) на вашем собственном сервере. Никакого стороннего облака, никакой отправки данных — ваши конфиденциальные документы остаются там, где им место.",

  "footer.cta.title": "Готовы заставить документы работать на вас?",
  "footer.cta.subtitle":
    "Попробуйте ассистента на своих PDF — он работает локально, ничего не покидает ваш компьютер.",
  "footer.brandDesc":
    "Интеллектуальная обработка документов для бизнеса. От PDF к структурированным данным — локально, без отправки данных куда-либо.",
  "footer.localAi": "Локальный ИИ · на вашем сервере",
  "footer.product": "Продукт",
  "footer.features": "Возможности",
  "footer.liveDemo": "Живое демо",
  "footer.resources": "Ресурсы",
  "footer.privacy": "Приватность",
  "footer.builtForSmes": "Создано для малого и среднего бизнеса",

  "demo.documents": "Документы",
  "demo.noDocuments": "Пока нет документов",
  "demo.noResults": "Документы не найдены",
  "demo.uploadDocument": "Загрузить документ",
  "demo.uploading": "Загрузка...",
  "demo.search": "Поиск документов...",
  "demo.emptySubtitle": "Загрузите PDF, чтобы начать",
  "demo.uploadFirst": "Загрузите свой первый документ",
  "demo.analyze": "Анализировать",
  "demo.analyzing": "Анализ...",
  "demo.fileTooLarge": "Файл слишком большой (макс. 15 МБ).",
  "demo.uploadFailed": "Не удалось загрузить.",

  "status.READY": "Готово",
  "status.PROCESSING": "Обработка",
  "status.ERROR": "Ошибка",
  "status.UPLOADED": "Загружено",
  "status.document": "Документ",

  "doc.back": "Назад к документам",
  "doc.backShort": "Назад",
  "doc.notFound": "Документ не найден",
  "doc.loadFailed": "Не удалось загрузить документ",
  "doc.open": "Открыть",
  "doc.download": "Скачать",
  "doc.previewUnavailable":
    "Предпросмотр недоступен на этом устройстве.",
  "doc.openPdf": "Открыть PDF",
  "doc.noFile": "К этому документу не прикреплён файл.",
  "doc.summary": "Краткое содержание",
  "doc.aiAnalysis": "ИИ-анализ",
  "doc.documentType": "Тип документа",
  "doc.language": "Язык",
  "doc.confidence": "Уверенность",
  "doc.extractedEntities": "Извлечённые сущности",
  "doc.analyzingDocument": "Анализ документа…",

  "docLang.it": "Итальянский",
  "docLang.de": "Немецкий",
  "docLang.en": "Английский",
  "docLang.fr": "Французский",
  "docLang.ru": "Русский",
  "docLang.other": "Другой",

  "chat.title": "Чат с документом",
  "chat.placeholder": "Задайте вопрос по этому документу…",
  "chat.send": "Отправить",
  "chat.empty": "Спросите что угодно об этом документе.",
  "chat.error": "Не удалось получить ответ.",
  "chat.unavailable": "ИИ-чат недоступен в этом окружении.",

  "lang.label": "Язык",
};
