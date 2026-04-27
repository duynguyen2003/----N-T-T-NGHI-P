import { OPTION_LABELS } from './constants';

export const getStatusFromExam = (exam) => exam?.status || 'DRAFT';

export const getDifficultyLabel = (difficulty) => {
  const mapping = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó'
  };
  return mapping[difficulty] || 'Chưa đặt';
};

export const normalizeQuestionFromApi = (questionItem) => {
  const rawOptions = Array.isArray(questionItem?.options) ? questionItem.options : [];
  const normalizedOptions = OPTION_LABELS.map((_, optionIndex) => `${rawOptions[optionIndex] || ''}`);
  const normalizedCorrectAnswer = Number.isInteger(Number(questionItem?.correctAnswer))
    ? Number(questionItem.correctAnswer)
    : 0;

  return {
    question: `${questionItem?.question || ''}`,
    options: normalizedOptions,
    correctAnswer: Math.min(Math.max(normalizedCorrectAnswer, 0), 3),
    explanation: `${questionItem?.explanation || ''}`,
    imageUrl: `${questionItem?.imageUrl || ''}`
  };
};

export const parseCorrectAnswer = (value) => {
  if (Number.isInteger(Number(value))) {
    const numericValue = Number(value);
    if (numericValue >= 0 && numericValue <= 3) return numericValue;
    if (numericValue >= 1 && numericValue <= 4) return numericValue - 1;
  }

  const text = `${value || ''}`.trim().toUpperCase();
  const answerIndex = OPTION_LABELS.indexOf(text);
  if (answerIndex !== -1) return answerIndex;

  throw new Error(`Đáp án đúng "${value}" không hợp lệ (chấp nhận: A-D, 0-3, 1-4).`);
};

export const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

export const toImportedQuestionsFromCsv = (csvText) => {
  const rows = csvText
    .replace(/^\uFEFF/, '')
    .replace(/\r/g, '')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map(parseCsvLine);

  if (rows.length === 0) return [];

  const firstRow = rows[0].map((value) => value.toLowerCase());
  const hasHeader = firstRow.includes('question') && (firstRow.includes('optiona') || firstRow.includes('option_a'));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map((row) => ({
    question: row[0] || '',
    optionA: row[1] || '',
    optionB: row[2] || '',
    optionC: row[3] || '',
    optionD: row[4] || '',
    correctAnswer: row[5] || '',
    explanation: row[6] || '',
    imageUrl: row[7] || ''
  }));
};

export const normalizeImportedQuestion = (rawQuestion, index) => {
  const questionText = `${rawQuestion?.question || rawQuestion?.content || ''}`.trim();
  if (!questionText) {
    throw new Error(`Dòng ${index + 1}: thiếu nội dung câu hỏi.`);
  }

  const options = Array.isArray(rawQuestion?.options)
    ? OPTION_LABELS.map((_, optionIndex) => `${rawQuestion.options[optionIndex] || ''}`.trim())
    : [
        `${rawQuestion?.optionA || rawQuestion?.a || ''}`.trim(),
        `${rawQuestion?.optionB || rawQuestion?.b || ''}`.trim(),
        `${rawQuestion?.optionC || rawQuestion?.c || ''}`.trim(),
        `${rawQuestion?.optionD || rawQuestion?.d || ''}`.trim()
      ];

  if (options.some((option) => !option)) {
    throw new Error(`Dòng ${index + 1}: cần đủ 4 đáp án A/B/C/D.`);
  }

  const correctAnswer = parseCorrectAnswer(rawQuestion?.correctAnswer ?? rawQuestion?.answer);

  return {
    question: questionText,
    options,
    correctAnswer,
    explanation: `${rawQuestion?.explanation || ''}`.trim(),
    imageUrl: `${rawQuestion?.imageUrl || ''}`.trim()
  };
};

export const formatExamDate = (value) => {
  if (!value) return '--/--/----';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--/--/----';
  return date.toLocaleDateString('vi-VN');
};
